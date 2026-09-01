# Episódio 11 — dbt MCP: dando contexto governado ao agente

**Duração alvo:** 20–23 minutos
**Nível:** intermediário/avançado
**Rótulos na tela:** `MCP ≠ autorização`, `somente leitura`, `SQL arbitrário desabilitado`

## Gancho

“Dar o schema inteiro para um agente não é contexto governado. É entregar um mapa sem legenda — e, às vezes, a chave da escavadeira. Hoje o agente vai receber somente manifest, linhagem e detalhes aprovados.”

## Objetivo e pré-requisitos

Conectar um cliente MCP neutro ao projeto, aplicar allowlist, iniciar o servidor por stdio e provar que ferramentas mutantes não estão expostas.

Pré-requisito: checkpoint 10; `dbt-mcp` instalado por `requirements-local.txt`.

## Roteiro falado

### 00:00–03:30 — O que MCP resolve

“Model Context Protocol padroniza como um cliente descobre e chama ferramentas. O servidor dbt pode expor metadados do projeto, linhagem, detalhes de nós, métricas e, dependendo da configuração, ferramentas da plataforma ou CLI.

MCP resolve transporte e descoberta. Não decide quem deveria acessar uma coluna, quanto uma query pode gastar nem se uma ação de escrita deve ser aprovada. Essas políticas precisam de configuração, identidade e infraestrutura.”

“Sem conta dbt Platform, as ferramentas CLI e o manifest local continuam disponíveis. Semantic Layer, Discovery, Admin e SQL gerenciados exigem variáveis e acesso à Platform e ficam para a segunda temporada. O servidor auto-desabilitar uma toolset sem credencial é conveniência; a allowlist explícita continua sendo nosso controle.”

**Visual:** cliente neutro -> protocolo MCP -> servidor dbt -> manifest; uma barreira separa banco/ações mutantes.

### 03:30–07:30 — Modelo de ameaça mínimo

“Pense em quatro riscos. Primeiro, exfiltração: contexto ou dados sensíveis entram no prompt. Segundo, mutação: uma ferramenta executa build ou SQL de escrita. Terceiro, custo: loops geram queries e tokens. Quarto, confusão: o agente escolhe tabela privada ou métrica errada.

Mitigações: identidade dedicada, allowlist explícita, acesso somente leitura, timeout e limites de consulta, logs de tool call e exposição apenas de interfaces públicas. Prompt como ‘não faça escrita’ é instrução; ferramenta ausente é controle mais forte.”

### 07:30–11:00 — A allowlist do laboratório

“Nossa configuração habilita somente cinco ferramentas:”

```text
parse
compile
list
get_lineage_dev
get_node_details_dev
```

“`parse`, `compile` e `list` não materializam modelos. As duas últimas leem o manifest local. Não habilitamos `build`, `run`, SQL arbitrário nem ferramentas administrativas.

A documentação do dbt alerta que ferramentas CLI podem modificar dados. Por isso não usamos uma regra ampla como ‘enable all local tools’. A lista precisa ser revisada em cada upgrade.”

### 11:00–16:30 — Demonstração com cliente neutro

“O teste não depende de Claude, ChatGPT ou outro cliente visual. Um pequeno cliente MCP em Python inicia `dbt-mcp` via stdio, negocia a sessão e chama `list_tools`.”

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 11
```

“Primeiro, `verify_mcp_policy.py` lê `mcp/read-only.example.json` e rejeita qualquer ferramenta fora da lista. Depois `verify_mcp_server.py` inicia o servidor real, recebe as ferramentas expostas e procura nomes mutantes.

O resultado esperado é `dbt-mcp OK: 5 ferramentas expostas e chamada build rejeitada.` Essa é uma prova de capacidade negativa: não basta uma chamada de leitura funcionar; precisamos provar que a escrita não está disponível.”

**Sugestão visual:** terminal mostra cinco tools; nomes proibidos aparecem cinza e riscados.

### 16:30–19:30 — Do manifest à resposta

“Um fluxo seguro de pergunta seria: listar recursos públicos, pedir detalhes de `commerce_orders`, consultar linhagem e escolher uma métrica. A execução da consulta pode ocorrer por outro serviço que aplique política e orçamento.

Se liberarmos SQL no futuro, use uma identidade read-only, limite linhas e tempo, bloqueie múltiplas statements e registre o SQL. Para dados confidenciais, aplique row/column security no catálogo; o MCP não substitui isso.

Exposure e tags do episódio sete ajudam descoberta. Contratos do cinco estabilizam a ferramenta. Métricas do três reduzem SQL inventado. MCP é o encaixe, não a fundação inteira.”

### 19:30–22:00 — Cases impact.com e M1

“A impact.com descreve a Semantic Layer como interface governada para agentes. A M1 Finance relata que o servidor MCP reduz o trabalho de levar contexto dbt a experiências de IA. São materiais publicados pela dbt Labs: úteis como arquitetura e relato, não como benchmark independente.

Nosso resultado é menor, mas reproduzível: o servidor sobe localmente e a allowlist é verificada. No próximo episódio vamos comparar três níveis de contexto e definir como um benchmark real deve ser executado.”

### Inserção obrigatória — Testes negativos e operação

“Depois de listar as ferramentas permitidas, tentamos três negativas conceituais. Pedir `build` deve falhar porque a tool não existe. Pedir SQL arbitrário deve falhar pelo mesmo motivo. Pedir uma coluna confidencial não pode depender só da ausência de tool: se no futuro houver consulta, o catálogo deve negar ou mascarar pela identidade.

Na operação, cada tool call recebe correlation ID, usuário, servidor, nome da ferramenta, argumentos saneados, duração e status. Não registre dado sensível bruto no log. Defina orçamento por sessão e circuit breaker para repetição. Se o agente chama `get_node_details_dev` vinte vezes para o mesmo nó, cache no cliente pode reduzir tokens e latência.

Também diferencio servidor local por stdio e servidor remoto. Stdio herda o ambiente do processo e é ótimo para laboratório. Remoto exige autenticação, TLS, segregação de tenants e revisão de exposição de rede. O fato de ambos falarem MCP não torna seus riscos iguais.

Por fim, o agente deve saber recusar: se a pergunta exige uma métrica não publicada, ele informa a lacuna e aponta o owner, em vez de cair para schema bruto automaticamente. Essa recusa é sinal de governança funcionando, não limitação a esconder.”

## Governança, FinOps e IA

- Governança: mínimo privilégio, identidade dedicada, interfaces públicas e logs.
- FinOps: allowlist e limites reduzem loops/queries; monitorar tool calls e tempo.
- IA: contexto descoberto sob demanda e semanticamente nomeado reduz ambiguidade.

## Limitações e anti-patterns

- Lista de ferramentas muda; pin e valide a versão.
- Stdio local não representa autenticação de um servidor remoto.
- `compile` pode ler configurações do projeto; mantenha secrets fora do repositório.
- Não habilitar SQL de escrita para “facilitar a demo”.

## Radar — máximo de dois minutos

“O MCP evolui rapidamente e já possui toolsets de LSP/Fusion e recursos gerenciados. Eles não entram na allowlist open. Na segunda temporada, autenticaremos Discovery e Semantic Layer separadamente e continuaremos deixando SQL/Admin desligados por padrão.”

## CTA

“Liste as ferramentas que seu agente realmente precisa e remova todas as outras. Depois escreva um teste que falha se uma tool mutante aparecer após upgrade.”

## Fontes

- [Sobre dbt MCP](https://docs.getdbt.com/docs/dbt-ai/about-mcp)
- [Variáveis e allowlist do MCP](https://docs.getdbt.com/docs/dbt-ai/mcp-environment-variables)
- [Ferramentas disponíveis e alerta sobre mutação](https://docs.getdbt.com/docs/dbt-ai/mcp-available-tools)
- [Setup self-hosted e fronteira de toolsets](https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/docs/docs/dbt-ai/setup-local-mcp.md)
- [Case impact.com — resultado reportado pelo fornecedor](https://www.getdbt.com/case-studies/impact.com)
- [M1 Finance e dbt MCP — relato do fornecedor](https://www.getdbt.com/blog/dbt-mcp-server-reliable-ai)
- [Checkpoint executável](../lab/dabdbt/checkpoints/11-mcp.md)
