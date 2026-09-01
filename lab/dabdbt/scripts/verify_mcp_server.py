#!/usr/bin/env python3
"""Start dbt-mcp over stdio and prove that mutating tools are not exposed."""

from __future__ import annotations

import asyncio
import os
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


from runtime import PROJECT, tool

SERVER = str(tool("dbt-mcp", "DBT_MCP_BIN"))
DBT = str(tool("dbt", "DBT_BIN"))
ALLOWED = {"compile", "list", "parse", "get_lineage_dev", "get_node_details_dev"}
FORBIDDEN = {
    "build", "run", "show", "test", "clone", "execute_sql", "text_to_sql",
    "generate_model_yaml", "generate_source", "generate_staging_model",
}


async def verify() -> None:
    if not SERVER or not DBT:
        raise SystemExit("dbt-mcp ou dbt não encontrado no ambiente.")
    env = dict(os.environ)
    env.update(
        {
            "DBT_PROJECT_DIR": str(PROJECT),
            "DBT_PATH": DBT,
            "DBT_PROFILES_DIR": str(PROJECT / "dbt_profiles"),
            "DBT_MCP_ENABLE_TOOLS": ",".join(sorted(ALLOWED)),
            "DBT_MCP_LOG_LEVEL": "ERROR",
        }
    )
    params = StdioServerParameters(command=SERVER, env=env)
    async with stdio_client(params) as streams:
        async with ClientSession(*streams) as session:
            await session.initialize()
            response = await session.list_tools()
            names = {tool.name for tool in response.tools}
            rejected = False
            try:
                denied = await session.call_tool("build", {})
                rejected = bool(denied.isError)
            except Exception:
                rejected = True

    leaked = names & FORBIDDEN
    missing = ALLOWED - names
    unexpected = names - ALLOWED
    if leaked or missing or unexpected or not rejected:
        raise SystemExit(
            f"MCP inválido: leaked={sorted(leaked)} missing={sorted(missing)} "
            f"unexpected={sorted(unexpected)} rejected_build={rejected} tools={sorted(names)}"
        )
    print(f"dbt-mcp OK: {len(names)} ferramentas expostas e chamada build rejeitada.")


if __name__ == "__main__":
    asyncio.run(verify())
