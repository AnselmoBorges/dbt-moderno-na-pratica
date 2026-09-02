# dbt Moderno na Prática

## Da Gold aos Agentes de IA

[![Validação do curso](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/workflows/course.yml/badge.svg)](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/workflows/course.yml)
[![Licença Apache-2.0](https://img.shields.io/badge/licen%C3%A7a-Apache--2.0-blue.svg)](LICENSE)

Material oficial da série hands-on do canal [Rescue Point](https://www.youtube.com/@RescuePoint) sobre engenharia analítica com dbt: camada Gold, métricas como código, qualidade, governança, FinOps e agentes de IA.

A proposta é simples: regras funcionais determinísticas pertencem ao pipeline e à camada semântica governada. Agentes devem consumir essas regras, não reinventá-las a cada pergunta.

## O que você encontra aqui

| Área | Conteúdo |
|---|---|
| [Pesquisa](pesquisa/dossie-tendencias.md) | Dossiê de tendências, auditoria da playlist, auditoria anonimizada de projeto real e matriz de evidências |
| [Roteiros](roteiros/README.md) | 12 episódios open source/estáveis e 4 episódios posteriores sobre dbt Platform |
| [Laboratório](lab/dabdbt/README.md) | Projeto cumulativo com dbt Core, DuckDB, MetricFlow, contratos, testes, governança, CI, FinOps e MCP |
| [Checkpoints](lab/dabdbt/checkpoints/README.md) | Uma validação executável para cada episódio da primeira temporada |
| [Acesso à Platform](pesquisa/guia-acesso-dbt-platform.md) | Trial, comunidade, preparação editorial e mensagens de contato em português e inglês |
| [Guia do aluno](docs/README.md) | Instalação multiplataforma, Aula 0, glossário, comandos e suporte |
| [Apresentações](assets/decks/README.md) | Pilotos em PPTX/PDF e padrão visual da série |

## Temporadas

### Temporada 1 — open source e estável

1. Baseline suportado do dbt Core e revisão da série original
2. Gold não é camada semântica
3. Semantic models e métricas como código
4. Semântica aberta e interoperável
5. Contratos e versões: Gold como API
6. Pirâmide moderna de qualidade
7. Governança como código
8. Data products sem depender de Mesh
9. CI inteligente com artifacts, state e defer
10. FinOps do pipeline
11. dbt MCP local e somente leitura
12. Gold governada versus agente solto

### Temporada 2 — dbt Platform

Quatro episódios adicionais cobrem Developer/Starter, Semantic Layer gerenciada, Mesh Enterprise e MCP gerenciado. Todo recurso proprietário, pago, beta ou preview é identificado explicitamente e possui uma alternativa documental quando não houver acesso ao produto.

## Comece pelo ambiente recomendado

Para padronizar o curso entre Windows, macOS e Linux, use o **GitHub Codespaces**. Uma conta pessoal GitHub Free possui franquia mensal; o curso seleciona uma máquina de 2 núcleos para reduzir o consumo.

**[Abrir o dbt Moderno na Prática no Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1354054687)**

O ambiente instala as dependências automaticamente. Quando o terminal estiver pronto:

```bash
python course.py doctor
python course.py checkpoint 01
```

Não execute assistentes de instalação de extensões dbt: o curso fixa e usa o dbt Core 1.12.3 pelo próprio launcher. O dbt Power User é opcional e não faz parte do ambiente recomendado.

Depois do checkpoint 01, `python course.py data-ui` abre o explorador gráfico autoral do curso em uma porta privada do Codespaces. O comando usa uma cópia somente leitura do DuckDB para não interferir no pipeline. A DuckDB UI oficial não é usada porque seu servidor local ainda possui uma limitação conhecida com túneis e containers.

Como alternativa avançada, a Aula 0 também documenta a DuckDB UI oficial por túnel: `python course.py official-data-ui` roda no Codespaces e `python course.py codespace-ui-tunnel` roda no computador local com GitHub CLI. Essa rota mantém o navegador em `localhost` e evita o proxy incompatível `app.github.dev`.

Veja o [passo a passo ilustrado, limites e como parar o ambiente](docs/codespaces.md).

## Alternativa: instalação local sem ativação manual

Pré-requisitos: Python 3.12 ou 3.13, Git e 2 GB livres. Nenhuma conta dbt, Databricks ou chave de LLM é necessária. Terminal, Git, Python e dbt são introduzidos na [Aula 0](docs/aula-00.md).

```bash
git clone https://github.com/AnselmoBorges/dbt-moderno-na-pratica.git
cd dbt-moderno-na-pratica
python course.py doctor
python course.py setup
python course.py paths
python course.py checkpoint 01
```

No Windows, se `python` abrir a Microsoft Store ou não for encontrado, use `py -3.12 course.py doctor` e mantenha `py -3.12` nos demais comandos. Em macOS/Linux, use `python3.12` quando `python` não estiver disponível.

O fluxo funcional é o mesmo no Codespaces e localmente.

Para acompanhar somente uma aula:

```bash
python course.py checkpoint 03
python course.py validate
```

O resultado funcional esperado da amostra Olist é documentado e testado: 8 pedidos, receita bruta de 740, receita entregue de 630, ticket médio de 92,50 e prazo médio de entrega de 5 dias.

## Princípios editoriais

- **OPEN:** software e caminho executável abertos.
- **GRATUITO:** serviço sem cobrança dentro dos limites; não significa open source.
- **PAGO/ENTERPRISE:** depende de plano ou contrato.
- **BETA/PREVIEW:** aparece apenas no quadro Radar e não participa da trilha obrigatória.
- **LAB:** resultado reproduzido neste laboratório.
- **FORNECEDOR:** número declarado em case ou material comercial.
- **FIXTURE:** dado sintético para CI; não é benchmark real de LLM.

As versões, preços e condições comerciais mudam. As fontes oficiais devem ser verificadas novamente antes de cada gravação.

## Validação editorial

```bash
python course.py validate
```

Essa verificação confirma a estrutura dos roteiros, as evidências obrigatórias, os links locais e a sanitização do laboratório. A automação do GitHub executa também o build completo e os testes determinísticos.

## Segurança e dados

O laboratório usa uma amostra pequena e pública inspirada no Olist. Não contém credenciais, identificadores cloud reais, nomes de clientes privados ou código proprietário. O caminho Databricks é apenas um modelo parametrizado e não é acionado pela automação local.

## Licença

Código, textos e diagramas autorais são disponibilizados sob a [Apache License 2.0](LICENSE). Cases, marcas e conteúdos externos continuam pertencendo aos seus respectivos titulares; consulte [atribuições](assets/ATTRIBUTION.md) e [avisos de terceiros](THIRD_PARTY_NOTICES.md).

## Material complementar

| Material | Organização | Tipo/idioma | Por que consultar | Verificado |
|---|---|---|---|---|
| [dbt Developer Hub](https://docs.getdbt.com/) | dbt Labs | documentação, EN | referência primária para comandos e recursos | 2026-09-01 |
| [dbt Learn](https://www.getdbt.com/dbt-learn) | dbt Labs | curso, EN | trilhas oficiais para comparar a progressão didática | 2026-09-01 |
| [Processamento local com dbt e DuckDB](https://duckdb.org/2025/04/04/dbt-duckdb) | DuckDB | artigo, EN | explica o caminho local usado no laboratório | 2026-09-01 |
| [Playlist DBT](https://www.youtube.com/watch?v=ZAgoqhlR95g&list=PLeblJhqzZe1rvFehI3MsGXmrNch4zQqg8) | Rescue Point | vídeo, PT-BR | série original que este curso aprofunda | 2026-09-01 |
