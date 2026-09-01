# Episódio 15 — Mesh e governança Enterprise: quando o cross-project vale o custo

**Duração alvo:** 20–24 minutos
**Temporada:** dbt Platform
**Rótulos na tela:** `ENTERPRISE`, `cross-project`, `case arquitetural`, `fallback disponível`

## Gancho

“Nós já temos um cenário real com dez projetos dbt. Essa é a hora de comprar Mesh? Só se cross-project resolver um problema que contratos, packages e artifacts não resolvem com custo menor.”

## Objetivo e pré-requisitos

Comparar o produto aberto do episódio 8 com dependências cross-project, catálogo e governança gerenciados; definir critérios objetivos de adoção.

Pré-requisitos: episódios 8 e 13; acesso Enterprise/demonstração concedido ou uso da rota documental.

## Roteiro falado

### 00:00–04:00 — O problema organizacional

“Vários repositórios criam autonomia, mas fragmentam versão, artifact, ownership e deploy. Mesh é valioso quando conecta produtos públicos sem devolver acesso às implementações privadas. Ele não transforma uma pasta sem owner em produto.”

### 04:00–08:00 — Baseline aberto

“No episódio 8, `group`, `access`, contrato, versão, exposure e packages já definiram a borda. Esse baseline é obrigatório: sem ele, cross-project apenas formaliza acoplamento.”

### 08:00–14:00 — Rota A: demonstração com acesso

1. Criar dois projetos Olist mínimos: comércio produtor e logística consumidora.
2. Publicar somente a interface de fulfillment.
3. Configurar a dependência cross-project pelo fluxo oficial da conta.
4. Provar que logística referencia o modelo público.
5. Tentar referenciar um modelo privado e registrar a rejeição.
6. Abrir lineage/catálogo entre projetos e localizar owner/exposure.

“O resultado importante é o teste negativo: dependência privada não deve virar atalho.”

### 14:00–17:00 — Rota B: fallback documental

“Sem Enterprise, use dois diagramas e os manifests do projeto open. Mostre o comando/package que seria necessário sem Mesh e a experiência descrita oficialmente com Mesh. Rotule tudo como arquitetura não executada. Não fabrique erro de autorização.”

### 17:00–21:00 — Aplicação ao cenário privado

“A auditoria encontrou dez projetos e versões divergentes de adapter. Antes de adotar Mesh: padronize runtime, publique artifacts, catalogue owners, defina interfaces e meça conflitos/redeploy. Depois faça piloto com dois domínios que realmente possuam cadências e permissões diferentes.

Critério de sucesso: menos dependências privadas, menos coordenação manual e impacto cross-project visível. Critério de saída: se o overhead/contrato supera os conflitos atuais, mantenha packages e um catálogo mais simples.”

### 21:00–23:30 — Fechamento

“Mesh é uma resposta a escala organizacional, não uma medalha de maturidade. O laboratório open continua válido mesmo que a empresa nunca contrate o produto.”

## Demonstração e resultado esperado

- Rota A: ref público funciona, ref privado falha e lineage cruza projetos.
- Rota B: capacidades e limitações vêm de fontes oficiais, marcadas não executadas.
- Nenhum código/nome do projeto privado aparece.

## Sugestões visuais

- dois domínios com bordas públicas/privadas;
- score de adoção: owner, permissão, release, conflito e tamanho;
- comparação `package/artifact / Mesh` sem coluna “vencedor universal”.

## Case

Usar o cenário privado apenas como motivação anonimizada. Se houver case oficial adicional, marcar FORNECEDOR e não inferir ganho percentual sem baseline equivalente.

## Governança, FinOps e IA

- Governança: contrato e ownership atravessam projetos.
- FinOps: rateio melhora, mas jobs/artifacts podem multiplicar operação.
- IA: catálogo unificado reduz descoberta, desde que respeite access e IAM.

## Limitações e anti-patterns

- Não usar Enterprise para compensar falta de owner.
- Não comparar preço sem incluir operação alternativa.
- Não abrir interfaces internas para facilitar a demo.
- Não apresentar diagrama como execução.

## Radar — máximo de dois minutos

“Dependências semânticas cross-project e recursos de catálogo evoluem. Revalide suporte, planos e adapters. Qualquer capacidade preview fica fora do critério de sucesso.”

## CTA

“Meça quantas dependências privadas cruzam seus projetos e quantos conflitos de release ocorrem por mês. Sem esses números, a decisão de Mesh ainda é opinião.”

## Fontes

- [Sobre dbt Mesh](https://docs.getdbt.com/docs/mesh/about-mesh)
- [Model access](https://docs.getdbt.com/docs/mesh/govern/model-access)
- [Model versions](https://docs.getdbt.com/docs/mesh/govern/model-versions)
- [Auditoria anonimizada](../pesquisa/auditoria-projeto-privado.md)
- [Checkpoint open de referência](../lab/dabdbt/checkpoints/08-data-products-open.md)

## Material complementar

- [Visão geral do dbt Mesh](https://docs.getdbt.com/docs/mesh/about-mesh) — dbt Labs, documentação/EN; critérios oficiais e fronteira do produto; episódio 15; verificado em 2026-09-01.
