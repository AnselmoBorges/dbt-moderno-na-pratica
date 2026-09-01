# Episódio 7 — Governança como código

**Duração alvo:** 19–22 minutos
**Nível:** intermediário
**Rótulos na tela:** `metadado dbt`, `política no catálogo`, `owner ≠ tag decorativa`

## Gancho

“Se uma tabela Gold quebra, quem recebe a ligação? Se um agente encontra a tabela, ele pode usá-la? Se ninguém consegue responder pelo manifest, as tags são decoração, não governança.”

## Objetivo e pré-requisitos

Implementar owner, group, access, tags, `meta`, exposure e classificação; alinhar metadados do dbt com Unity Catalog sem confundir documentação com autorização.

Pré-requisito: checkpoint 06 e compreensão de interface pública.

## Roteiro falado

### 00:00–03:30 — Governança que produz uma ação

“Governança como código significa que decisões sobre responsabilidade, exposição e classificação são versionadas e consultáveis. Mas cada campo precisa disparar uma ação.

`owner` orienta alerta e aprovação. `group` cria fronteira de responsabilidade. `access` controla quais modelos podem receber `ref` de outros grupos no dbt. `tags` ajudam seleção. `meta` carrega atributos da organização. `exposure` registra um consumidor. Se o campo não muda seleção, revisão, alerta ou autorização, ele tende a ficar desatualizado.”

**Visual:** tabela `metadado -> ação`: owner/alerta, access/compilação, tag/seleção, meta/política, exposure/impacto.

### 03:30–07:00 — Owner, group e access

“Criamos o grupo `commerce` com owner de dados. `order_metrics` e `commerce_orders` pertencem a esse grupo. A interface é `public`; modelos internos poderiam ser `protected` ou `private`.

Access no dbt governa referências no grafo, não permissões SQL no warehouse. Um usuário ainda pode consultar uma tabela se o catálogo permitir. Por isso precisamos de duas camadas: dbt evita dependências arquiteturais indevidas; Unity Catalog aplica grants, mascaramento e auditoria.”

```yaml
groups:
  - name: commerce
    owner:
      name: Rescue Point Data
      email: data-owner@example.invalid

config:
  group: commerce
  access: public
```

“O domínio `.invalid` é intencional no material público. Num projeto real, use um grupo durável, não o e-mail pessoal de quem talvez mude de função.”

### 07:00–11:30 — Tags, meta e classificação

“Tags dbt como `gold`, `semantic` e `agent_readable` permitem seleção. Em `meta`, registramos `data_classification`, consumidores aprovados e ausência de PII direta. A coluna `customer_id` recebe classificação mais restritiva como identificador confidencial.

No caminho Databricks, uma macro pós-build converte a taxonomia em tags do Unity Catalog. Fora do Databricks, a macro não faz nada. Essa separação preserva portabilidade.

Não copie automaticamente toda tag para todo sistema. Mantenha um mapeamento controlado:”

| dbt | Unity Catalog | Ação |
|---|---|---|
| `data_classification: internal` | tag de classificação | política de acesso padrão |
| `confidential_identifier` | tag de coluna | mascaramento/revisão |
| `data_owner: commerce` | owner/tag | roteamento de incidente |
| `agent_readable` | allowlist de produto | elegibilidade, não concessão automática |

“`agent_readable` nunca deve conceder acesso sozinho; apenas indica que a interface foi preparada. O IAM continua decidindo.”

### 11:30–15:00 — Exposure do agente

“Exposure coloca dashboard ou aplicação no DAG. Criamos `governed_commerce_agent`, dependente da fachada e de duas métricas. Agora uma alteração upstream aparece como impacto potencial nesse consumidor.

Isso permite perguntas operacionais: quais fontes alimentam o agente? Quem é o owner? Qual métrica ele usa? Uma exposure não monitora a aplicação, mas conecta o inventário técnico ao consumidor.”

```yaml
exposures:
  - name: governed_commerce_agent
    type: application
    depends_on:
      - ref('commerce_orders')
      - metric('delivered_revenue')
```

### 15:00–18:00 — Demonstração

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 07
```

“O script gera o manifest e verifica programaticamente: grupo e owner, acesso público, contrato e duas versões, tags, classificação, consumidores aprovados, métricas e exposure. O esperado é `Governança OK`.

Também podemos selecionar interfaces públicas:”

```bash
dbt ls --profiles-dir dbt_profiles --target local --select access:public
dbt ls --profiles-dir dbt_profiles --target local --select +exposure:governed_commerce_agent
```

“Esses comandos transformam metadado em ação de CI e análise de impacto.”

### 18:00–21:00 — Case e fechamento

“O projeto privado mostra que essa evolução já começou: há groups, access, owners, contratos e exposures em partes do portfólio. A oportunidade é uniformizar a taxonomia e fazer CI verificar o que hoje varia por domínio. No laboratório público, tags do Unity Catalog foram ligadas a owner, access e consumidor.

O anti-pattern é declarar tudo público porque é Gold. Gold pode conter detalhe sensível. Público no dbt significa interface arquitetural, não público na internet.

No próximo episódio vamos usar essa fronteira para discutir data products e quando separar projetos com Mesh.”

### Inserção obrigatória — Fluxo de mudança governada

“Vamos acompanhar uma solicitação: permitir que um agente leia `customer_id`. A tag diz que é identificador confidencial. O owner de comércio confirma a finalidade; segurança avalia minimização; o catálogo decide se deve mascarar ou negar; a exposure documenta o consumidor; e a configuração MCP continua sem ferramenta de dados brutos.

Talvez a melhor solução seja não liberar `customer_id`, mas criar uma métrica agregada por estado. Esse é um princípio de governança econômica: reduzir a superfície de dados também reduz contexto, risco e consultas detalhadas.

Agora outro exemplo: o owner muda de equipe. Como o e-mail é de um grupo durável, nenhuma tabela precisa ser editada. O catálogo e o sistema de chamados atualizam membros do grupo. Código deve referenciar papéis estáveis; identidade pessoal fica no provedor de acesso.

Para verificar drift, uma rotina pode comparar manifest dbt e tags do Unity Catalog: classificação ausente, owner divergente, modelo público sem grant correspondente ou coluna confidencial sem política. O laboratório não acessa o workspace e por isso valida apenas o lado dbt. Em produção, essa comparação seria um controle separado, com credencial read-only e relatório — nunca uma correção silenciosa de permissões.”

## Resultado esperado

- `Governança OK` após gerar e inspecionar o manifest.
- Grupo `commerce`, interface pública, contrato, versões, tags, `meta` e exposure presentes.
- Nenhum grant cloud é executado no laboratório; a macro de Unity Catalog é neutra no DuckDB.

## Governança, FinOps e IA

- Governança: ownership e classificação verificáveis; catálogo continua aplicando segurança.
- FinOps: tags/groups permitem rateio e seleção por domínio, desde que integrados ao billing.
- IA: exposure e `agent_readable` orientam descoberta; IAM e allowlist dão a autorização real.

## Limitações e anti-patterns

- `access` do dbt não é grant do warehouse.
- E-mail pessoal é owner frágil.
- Tag sem taxonomia e automação fica obsoleta.
- Classificação declarada precisa de varredura/validação fora do dbt.

## Radar — máximo de dois minutos

“Catálogo avançado, column-level lineage e políticas gerenciadas variam por plano e maturidade. O episódio executa apenas metadados do Core e tags condicionais do adapter; o restante fica para a segunda temporada.”

## CTA

“Adicione uma exposure ao dashboard ou aplicação mais crítica e execute `+exposure:nome`. Se a linhagem não chegar às fontes certas, corrija o grafo antes de automatizar o alerta.”

## Fontes

- [Exposures](https://docs.getdbt.com/docs/build/exposures)
- [Métodos de seleção: access, group, exposure e meta/config](https://docs.getdbt.com/reference/node-selection/methods)
- [Model governance](https://docs.getdbt.com/docs/mesh/govern/about-model-governance)
- [Auditoria anonimizada do projeto](../pesquisa/auditoria-projeto-privado.md)
- [Checkpoint executável](../lab/dabdbt/checkpoints/07-governanca.md)
