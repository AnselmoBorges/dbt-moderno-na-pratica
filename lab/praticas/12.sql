select s.mode as modo, s.correct as corretas,
       s.invalid_joins as joins_invalidos,
       generated_from_fixtures as fixtures
from read_json_auto(
    'lab/dabdbt/target/agent_benchmark_report.json'),
    unnest(summaries) as itens(s)
order by s.correct;
