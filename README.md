# dbt Moderno na Prática

## Da Gold aos Agentes de IA

[![Validação do curso](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/workflows/lab-local.yml/badge.svg)](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/workflows/lab-local.yml)
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

## Comece pelo laboratório

Pré-requisitos: Python 3.12 ou 3.13, Git e um terminal. O conjunto fixado ainda não é compatível com Python 3.14. Nenhuma conta dbt, Databricks ou chave de LLM é necessária.

```bash
git clone https://github.com/AnselmoBorges/dbt-moderno-na-pratica.git
cd dbt-moderno-na-pratica/lab/dabdbt
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-local.txt
./scripts/run_local.sh
```

No Windows PowerShell, ative o ambiente com `.venv\Scripts\Activate.ps1` antes da instalação.

Para acompanhar somente uma aula:

```bash
python scripts/run_checkpoint.py --list
python scripts/run_checkpoint.py 03
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
python scripts/verify_editorial.py
```

Essa verificação confirma a estrutura dos roteiros, as evidências obrigatórias, os links locais e a sanitização do laboratório. A automação do GitHub executa também o build completo e os testes determinísticos.

## Segurança e dados

O laboratório usa uma amostra pequena e pública inspirada no Olist. Não contém credenciais, identificadores cloud reais, nomes de clientes privados ou código proprietário. O caminho Databricks é apenas um modelo parametrizado e não é acionado pela automação local.

## Licença

Código e material textual são disponibilizados sob a [Apache License 2.0](LICENSE). Cases, marcas e conteúdos externos continuam pertencendo aos seus respectivos titulares.
