# Episódio 16 — MCP gerenciado e agentes: contexto, SQL e custo sob controle

**Duração alvo:** 21–25 minutos
**Temporada:** dbt Platform
**Rótulos na tela:** `PLANO COMPATÍVEL`, `Discovery`, `Semantic Layer`, `SQL desligado por padrão`, `dbt State: PREVIEW`

## Gancho

“No laboratório local o agente conhece cinco ferramentas e nenhuma executa SQL. O que muda quando conectamos Discovery e Semantic Layer gerenciados? Mais contexto — e uma superfície de risco que precisa continuar menor que a conveniência.”

## Objetivo e pré-requisitos

Conectar toolsets gerenciados separadamente, manter mínimo privilégio, repetir o benchmark A/B/C e distinguir o produto dbt State do state/defer aberto.

Pré-requisitos: episódios 11–14; acesso Platform compatível; token temporário; benchmark e ground truth intactos.

## Roteiro falado

### 00:00–04:00 — Quatro famílias de ferramentas

“CLI local lê projeto/manifest. Discovery consulta metadados da Platform. Semantic Layer lista e consulta métricas. SQL executa consultas; Admin controla jobs. Cada família usa variáveis e permissões diferentes. Não habilite tudo com o mesmo token.”

**Visual:** quatro caixas; CLI/Discovery/Semantic verdes para leitura, SQL/Admin fechadas.

### 04:00–08:00 — Política antes da conexão

“A política inicial permite Discovery e Semantic Layer necessárias ao roteiro. SQL, Admin e codegen ficam desabilitados. O warehouse usa identidade read-only e budget. Logs registram tool, argumentos saneados, duração e correlation ID.”

### 08:00–14:00 — Rota A: demonstração com acesso

1. Configurar host/token via ambiente temporário, nunca arquivo versionado.
2. Ativar somente tools necessárias por allowlist.
3. Iniciar o servidor e listar tools efetivas.
4. Consultar detalhes de `commerce_orders`, lineage e métricas.
5. Provar que `execute_sql`, Admin e codegen não aparecem.
6. Responder duas perguntas por métrica e reconciliar ground truth.
7. Revogar token e apagar configuração local temporária.

“Se SQL for tema de uma demonstração posterior, use outra identidade/sessão e teste limites. Não o ative silenciosamente aqui.”

### 14:00–17:00 — Rota B: fallback open

“Sem Platform, execute checkpoint 11. Mostre as cinco tools locais reais e a tabela oficial que diz quais toolsets precisam de conta. Para o benchmark, use somente fixtures rotuladas. Não simule resposta de Discovery.”

### 17:00–21:00 — Benchmark e cases

“Repita as dez perguntas mantendo modelo, prompt e parâmetros. Troque apenas a interface. Grave traces `fixture: false`, SQL/resultados, tokens, tools, latência e custo normalizado. Bilt, impact.com e M1 oferecem relatos de arquitetura; nenhum substitui nossa repetição controlada.”

### 21:00–24:00 — dbt State no lugar correto

“O `state:modified` do episódio 9 é open e compara manifests. O produto dbt State promete reutilização mais avançada e está em preview na data de corte. Ele não entra no benchmark nem na recomendação de produção. Se houver trial separado, avalie em job não bloqueante e meça compute real.”

### 24:00–25:00 — Fechamento

“O agente governado não é aquele que recebeu o prompt mais longo. É aquele cuja identidade, catálogo, métricas, tools, budget e logs limitam o que pode acontecer.”

## Demonstração e resultado esperado

- Tools gerenciadas permitidas aparecem; SQL/Admin/codegen não.
- Duas respostas reconciliam com o ground truth.
- Trace real usa `fixture: false`; sem acesso, nenhuma conclusão é publicada.
- Token é revogado ao final.

## Sugestões visuais

- diff da lista de tools local versus gerenciada;
- diagrama de identidade por toolset;
- relatório `agent_benchmark_report.json` filtrado por modo;
- selo PREVIEW sobre dbt State.

## Cases

- impact.com: Semantic Layer como interface governada para agentes — FORNECEDOR.
- M1 Finance: relato qualitativo sobre MCP/contexto — FORNECEDOR.
- Bilt: camada conversacional/semântica — FORNECEDOR.

## Governança, FinOps e IA

- Governança: token/identidade por ambiente, allowlist e logs.
- FinOps: somar LLM, warehouse, tool calls, retries e operação.
- IA: descoberta progressiva e recusa quando a métrica não existe.

## Limitações e anti-patterns

- OAuth e tools podem mudar por versão; pin e registre.
- Não reutilizar token pessoal de desenvolvimento.
- Não publicar trace com dados ou IDs sensíveis.
- Não chamar fixture de benchmark real.
- Não confundir dbt State pago/preview com state selection aberto.

## Radar — máximo de dois minutos

“Acompanhe dbt State, LSP/Fusion tools e novos clientes MCP. Enquanto preview, execute isoladamente e nunca torne a CI dependente. Atualize a matriz de evidências antes de cada gravação.”

## CTA

“Publique a lista exata de tools habilitadas e as negativas testadas. Segurança demonstrável é uma parte do resultado, não nota de rodapé.”

## Fontes

- [dbt MCP](https://docs.getdbt.com/docs/dbt-ai/about-mcp)
- [Setup self-hosted e requisitos por toolset](https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/docs/docs/dbt-ai/setup-local-mcp.md)
- [Tools disponíveis](https://docs.getdbt.com/docs/dbt-ai/mcp-available-tools)
- [Case impact.com — resultado reportado](https://www.getdbt.com/case-studies/impact.com)
- [M1 Finance — relato do fornecedor](https://www.getdbt.com/blog/dbt-mcp-server-reliable-ai)
- [Checkpoint open de referência](../lab/dabdbt/checkpoints/11-mcp.md)

## Material complementar

- [Ferramentas do dbt MCP](https://docs.getdbt.com/docs/dbt-ai/mcp-available-tools) — dbt Labs, documentação/EN; comparação entre toolsets locais e gerenciados; episódio 16; verificado em 2026-09-01.
