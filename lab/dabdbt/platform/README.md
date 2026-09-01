# Área opcional da segunda temporada

Esta pasta não participa da CI e não contém credenciais. Ela serve como runbook para demos da dbt Platform depois da temporada open.

## Regras

- nunca registrar host, token, account ID, environment ID ou user ID;
- usar apenas dados Olist e um projeto temporário;
- reconciliar métricas com `benchmarks/questions.json`;
- marcar capturas e resultados como execução real, documentação ou fallback;
- revogar tokens e pausar jobs ao final do trial;
- não ativar SQL/Admin tools no MCP sem necessidade explícita.

Consulte `pesquisa/guia-acesso-dbt-platform.md` na raiz do material para o calendário e os textos de contato.
