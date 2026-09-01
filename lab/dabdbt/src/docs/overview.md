{% docs __overview__ %}
# Visão Geral

Bem-vindo à documentação da prova de conceito **dabdbt**, criada para a equipe de engenharia de dados da **Rescue Point**. O objetivo é demonstrar um fluxo completo que combina **dbt**, **Databricks Asset Bundles** e publicação automatizada de artefatos em um static website da Azure.

## Objetivos do pipeline
- Ler tabelas operacionais hospedadas no Azure SQL (`sqlolistdev`) por meio de um *foreign catalog* do Unity Catalog.
- Organizar os dados em camadas:
  - **Bronze (`rescue_dev.b`)**: seed `ibge_municipios` com metadados oficiais do IBGE.
  - **Silver (`rescue_dev.s`)**: normaliza clientes, pedidos, itens e pagamentos, aplicando tags `source:Azure SQL`, `process:dbt`, `layer:silver`, `data_owner:rescue`.
  - **Gold (`rescue_dev.g`)**: seis modelos analíticos que suportam dashboards e estudos exploratórios, com tags `process:dbt`, `layer:gold`, `data_owner:rescue`.
- Publicar a documentação (`dbt docs`) e o portal estático no endpoint de documentação do ambiente, usando identificadores fornecidos fora do repositório.

## Como o job está orquestrado?
1. **dbt_seed** – executa `dbt seed --select ibge_municipios`, abastecendo a camada bronze (`rescue_dev.b.ibge_municipios`).
2. **dbt_silver** – roda `dbt run --select tag:silver`, materializando as tabelas padronizadas em `rescue_dev.s`.
3. **dbt_gold** – roda `dbt run --select tag:gold`, produzindo os modelos analíticos em `rescue_dev.g`.
4. **dbt_docs** – gera a documentação e grava os artefatos em `/Volumes/rescue_<target>/rescue_b/vol_docs/<bundle>`.
5. **publish_docs** – notebook `notebooks/publish_docs.py` que envia portal + artefatos para o container `$web` da conta `sarescuedev` usando o secret `pocdocdbt/sasdocsdbt` (ou as variáveis de ambiente equivalentes).

## Checklist para novos integrantes
1. **Entenda as fontes**: revise `src/models/silver/schema.yml` para conhecer tabelas e colunas expostas pelo catálogo federado.
2. **Explore as transformações**: leia os modelos SQL em `src/models/silver` e `src/models/gold`, mapeando junções e agregações.
3. **Rode localmente**: utilize `dbt build --select tag:silver` e `dbt build --select tag:gold` para experimentar com datasets menores.
4. **Publique a documentação**: execute `dbt docs generate` seguido do job `publish_docs` para validar a publicação no portal.
5. **Avalie metadados**: confira as tags no Unity Catalog após a execução para garantir que `apply_uc_tags` aplicou os metadados corretos.

## Próximos passos sugeridos
- Criar dashboards em Databricks SQL ou Power BI consumindo `rescue_dev.g`.
- Expandir os testes (`dbt test`, macros customizadas) para garantir qualidade antes de levar o modelo para produção.
- Versionar configurações de agendamento e alertas conforme o pipeline evoluir.

Consulte o README principal da documentação para o passo a passo completo de treinamento, incluindo setup de ambiente, execução do bundle e guia de troubleshooting.
{% enddocs %}
