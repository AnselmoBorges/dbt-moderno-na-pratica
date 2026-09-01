# Episódio 13 — Developer e Starter trial sem desperdiçar os 14 dias

**Duração alvo:** 18–22 minutos
**Temporada:** dbt Platform
**Rótulos na tela:** `PROPRIETÁRIO`, `Developer: gratuito`, `Starter: trial/pago`, `limites em 01/09/2026`

## Gancho

“A pior hora para descobrir o que você quer testar é depois de ativar um trial de 14 dias. Hoje vamos entrar na dbt Platform com o laboratório pronto, separar gratuito de open source e transformar cada dia de acesso em evidência para os próximos vídeos.”

## Objetivo e pré-requisitos

Comparar Core local, Developer e Starter; preparar um trial seguro; gravar IDE, jobs e catálogo sem misturar conveniência de produto com resultado técnico.

Pré-requisitos: temporada open concluída, projeto Olist verde, agenda de gravação reservada e autorização explícita para criar a conta. Use [`guia-acesso-dbt-platform.md`](../pesquisa/guia-acesso-dbt-platform.md).

## Roteiro falado

### 00:00–04:00 — Open, gratuito e pago

“dbt Core é software Apache 2.0 que executamos localmente. Developer é um serviço proprietário gratuito com limites. Starter é um serviço pago e, na data desta gravação, novos usuários recebem 14 dias de trial. Gratuito não significa open source; pago não significa automaticamente melhor para todo caso.

A página oficial informava uma seat e um projeto no Developer, com 3.000 modelos bem-sucedidos por mês. Starter informava cinco seats, 15.000 modelos, 5.000 métricas consultadas e API. Coloque a data ao lado de cada número e confira a página no dia da gravação.”

### 04:00–08:00 — Preparação antes do clique

“O repositório já está pronto, os dados são públicos, o ground truth possui dez perguntas e nenhuma credencial está no Git. A lista de capturas também está pronta: importação, ambiente, job, catálogo básico, Semantic Layer, API e MCP.

Ativar trial antes disso troca tempo técnico por tempo administrativo.”

**Visual:** calendário: pré-trial, dias 1–5, 6–9, 10–11, 12–14.

### 08:00–14:00 — Rota A: demonstração com acesso

1. Criar a conta pelo fluxo oficial e registrar o horário de expiração.
2. Conectar uma cópia pública do laboratório, nunca o repositório privado.
3. Criar ambiente e credencial temporários com mínimo privilégio.
4. Executar `dbt parse` e um job de build sobre Olist.
5. Abrir catálogo/lineage e localizar `commerce_orders`.
6. Capturar limites exibidos na conta e conferir o plano ativo.

“O resultado esperado é o mesmo ground truth do Core. A Platform muda desenvolvimento e operação; não deveria mudar receita de 740 para outro número.”

### 14:00–17:00 — Rota B: fallback sem acesso

“Se o trial não estiver disponível, mostre a documentação oficial e o laboratório lado a lado. Não recrie uma tela falsa. Use uma tabela com capacidade, plano declarado, evidência oficial e equivalente local. Marque cada screenshot como documentação, não execução.”

### 17:00–20:00 — Segurança e encerramento

“Ao terminar, revogue tokens, pause jobs, encerre warehouses e exporte apenas artifacts não sensíveis. Não deixe uma automação rodando após a gravação. A decisão final pode ser voltar ao Developer gratuito; trial não cria obrigação de compra.”

## Demonstração e resultado esperado

- Rota A: job Platform aprovado e valores reconciliados com Olist local.
- Rota B: comparação documental, sem alegar uso da função.
- Nenhum host, token, ID ou tela sensível no vídeo/repositório.
- Limites e preço exibem data de consulta.

## Sugestões visuais

- faixa superior permanente com o plano ativo;
- contador dos dias restantes;
- split screen `Core local / Platform`;
- checklist de limpeza no fim.

## Case

O case é o próprio processo de avaliação. O ganho medido será tempo de configuração, duração do job e número de passos operacionais; não haverá porcentagem de fornecedor neste episódio.

## Governança, FinOps e IA

- Governança: ambiente temporário, projeto público e artifacts identificados.
- FinOps: limites do plano e recursos cloud entram no orçamento do experimento.
- IA: ainda não habilitar SQL ou agentes; primeiro estabilizar projeto e identidade.

## Limitações e anti-patterns

- Preço e limites mudam; não reutilizar captura antiga sem nota.
- Não conectar o repositório privado apenas para “ganhar realismo”.
- Não confundir job hospedado com melhora automática do SQL.
- Não ativar trial sem agenda de gravação.

## Radar — máximo de dois minutos

“O programa Community Champions informava inscrições fechadas e reabertura após o Summit. Ele pode oferecer reconhecimento e acesso antecipado, mas não garante Enterprise. O roteiro inclui mensagens PT/EN para perguntar pelo canal adequado; nenhum contato é enviado automaticamente.”

## CTA

“Antes de ativar seu trial, publique uma lista fechada de hipóteses e evidências. Trial bom termina com decisão, não só com screenshots.”

## Fontes

- [Preços e trial](https://www.getdbt.com/pricing)
- [dbt Community](https://www.getdbt.com/community/join-the-community)
- [dbt Community Champions](https://www.getdbt.com/dbt-champions)
- [Guia de acesso e mensagens](../pesquisa/guia-acesso-dbt-platform.md)
- [Runbook opcional](../lab/dabdbt/platform/README.md)
