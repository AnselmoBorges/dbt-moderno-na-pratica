#!/usr/bin/env python3
"""Score provider-neutral agent traces against deterministic business ground truth."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import jsonschema


def equivalent(actual: object, expected: object, tolerance: float) -> bool:
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return math.isclose(float(actual), float(expected), abs_tol=tolerance)
    return str(actual).strip().casefold() == str(expected).strip().casefold()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("traces", nargs="+", type=Path)
    parser.add_argument("--questions", type=Path, default=Path("benchmarks/questions.json"))
    args = parser.parse_args()

    questions_doc = json.loads(args.questions.read_text())
    trace_schema = json.loads(Path("benchmarks/benchmark.schema.json").read_text())
    questions = {item["id"]: item for item in questions_doc["questions"]}
    summaries = []
    records = []

    for trace_path in args.traces:
        trace = json.loads(trace_path.read_text())
        jsonschema.validate(trace, trace_schema)
        trace_ids = [item["question_id"] for item in trace["items"]]
        missing = set(questions) - set(trace_ids)
        extra = set(trace_ids) - set(questions)
        duplicates = {question_id for question_id in trace_ids if trace_ids.count(question_id) > 1}
        if missing or extra or duplicates:
            raise SystemExit(
                f"Trace inválido {trace_path}: missing={sorted(missing)} "
                f"extra={sorted(extra)} duplicates={sorted(duplicates)}"
            )
        answers = {item["question_id"]: item for item in trace["items"]}
        correct = 0
        invalid_joins = 0
        input_tokens = 0
        output_tokens = 0
        tool_calls = 0
        latency_ms = 0

        for question_id, question in questions.items():
            item = answers.get(question_id)
            if item is None:
                continue
            is_correct = equivalent(item["answer"], question["expected"], float(question.get("tolerance", 0)))
            if is_correct:
                correct += 1
            invalid_joins += int(item["invalid_join"])
            input_tokens += item["tokens_input"]
            output_tokens += item["tokens_output"]
            tool_calls += item["tool_calls"]
            latency_ms += item["latency_ms"]
            item_cost = (
                item["tokens_input"] * trace["pricing"]["input_per_million"]
                + item["tokens_output"] * trace["pricing"]["output_per_million"]
            ) / 1_000_000
            records.append(
                {
                    "mode": trace["mode"],
                    "question_id": question_id,
                    "question": question["question"],
                    "expected_answer": question["expected"],
                    "sql": item["sql"],
                    "result": item["answer"],
                    "tokens_input": item["tokens_input"],
                    "tokens_output": item["tokens_output"],
                    "tool_calls": item["tool_calls"],
                    "latency_ms": item["latency_ms"],
                    "normalized_cost": round(item_cost, 8),
                    "invalid_join": item["invalid_join"],
                    "correct": is_correct,
                }
            )

        pricing = trace["pricing"]
        normalized_cost = (
            input_tokens * pricing["input_per_million"]
            + output_tokens * pricing["output_per_million"]
        ) / 1_000_000
        summaries.append(
            {
                "mode": trace["mode"],
                "fixture": trace["fixture"],
                "accuracy": round(correct / len(questions), 4),
                "correct": correct,
                "total": len(questions),
                "invalid_joins": invalid_joins,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "tool_calls": tool_calls,
                "latency_ms": latency_ms,
                "normalized_cost": round(normalized_cost, 6),
            }
        )

    report = {
        "generated_from_fixtures": all(item["fixture"] for item in summaries),
        "records": records,
        "summaries": summaries,
    }
    report_schema = json.loads(Path("benchmarks/benchmark-report.schema.json").read_text())
    jsonschema.validate(report, report_schema)
    target = Path("target")
    target.mkdir(exist_ok=True)
    (target / "agent_benchmark_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if all(item["total"] == len(questions) for item in summaries) else 1


if __name__ == "__main__":
    raise SystemExit(main())
