# Guia de acesso à dbt Platform para a segunda temporada

**Data de corte:** 1º de setembro de 2026. Confirme preços, limites e disponibilidade imediatamente antes do cadastro e da gravação.

## O que pode ser usado sem contrato Enterprise

Segundo a [página oficial de preços](https://www.getdbt.com/pricing):

- **Developer:** gratuito, uma pessoa, um projeto e 3.000 modelos construídos com sucesso por mês.
- **Trial Starter:** 14 dias; atualmente inclui até cinco seats, um projeto, 15.000 modelos construídos com sucesso, 5.000 métricas consultadas, Semantic Layer básica e API.
- **Starter após trial:** preço público atual de US$ 100 por usuário/mês.
- **Enterprise:** preço sob consulta e recursos/limites adicionais, incluindo cenários avançados de múltiplos projetos.

Esses números são fotografia da data de corte. Não devem ser gravados sem reconferência.

## Calendário recomendado para o trial de 14 dias

### Antes de ativar

- concluir e gravar os 12 episódios open;
- deixar o projeto Olist, repositório Git e branch de demonstração prontos;
- listar exatamente as telas, APIs e integrações que exigem a Platform;
- preparar dados não sensíveis e credenciais temporárias;
- reservar datas de gravação e edição.

### Dias 1–2 — base

- cadastrar a conta pelo fluxo oficial;
- confirmar plano, região, limites e data/hora de expiração;
- importar o projeto e validar conexão de demonstração;
- registrar configuração sem expor token ou identificadores.

### Dias 3–5 — experiência de desenvolvimento

- gravar IDE, jobs, ambientes, catálogo básico e artifacts;
- comparar cada capacidade com o fluxo Core local;
- evitar transformar conveniência de interface em claim de performance.

### Dias 6–9 — Semantic Layer

- implantar as mesmas métricas Olist;
- testar API, consulta, cache/export e um consumidor compatível;
- reconciliar todos os valores com o ground truth local.

### Dias 10–11 — MCP gerenciado

- testar autenticação e tools de Discovery/Semantic Layer;
- começar com leitura e allowlist;
- gravar testes negativos para SQL/Admin quando não necessários.

### Dias 12–13 — evidências e contingência

- repetir as demos críticas;
- exportar logs e capturas permitidas;
- verificar se alguma função usada era preview ou dependia de Enterprise.

### Dia 14 — encerramento

- revogar tokens temporários;
- exportar artifacts necessários;
- decidir conscientemente entre Developer gratuito, contratação ou encerramento;
- não deixar jobs agendados ou warehouses ativos.

## Canais oficiais

- [Criar conta e consultar preços](https://www.getdbt.com/pricing)
- [Solicitar demonstração/contato](https://www.getdbt.com/contact)
- [Entrar na dbt Community](https://www.getdbt.com/community/join-the-community)
- [Programa dbt Community Champions](https://www.getdbt.com/dbt-champions)
- [Repositório dbt MCP](https://github.com/dbt-labs/dbt-mcp) e canal comunitário `#tools-dbt-mcp`

Na data de corte, inscrições para Champions estavam fechadas, com reabertura indicada após o dbt Summit. O programa destaca conteúdo comunitário, acesso antecipado e contato com equipes de produto; é o canal mais alinhado a uma série educacional contínua. Não há garantia de trial estendido ou acesso Enterprise.

## Checklist para o pedido de acesso

- URL do canal e playlist existente;
- audiência principal e idioma português;
- proposta das duas temporadas;
- compromisso de separar open, gratuito, pago, beta e preview;
- exemplos do laboratório reproduzível;
- lista curta das funções que precisam de acesso;
- datas desejadas e duração do acesso;
- política de divulgação: resultados reportados versus medidos;
- disponibilidade para compartilhar feedback técnico e links dos vídeos.

## Mensagem em português

**Assunto:** Solicitação de acesso educacional para série técnica sobre dbt

Olá, equipe dbt,

Meu nome é Anselmo Borges e mantenho o canal Rescue Point, com conteúdo em português sobre engenharia de dados e uma playlist prática de dbt Core.

Estou preparando uma nova série em duas etapas. A primeira terá 12 episódios totalmente reproduzíveis com dbt Core 1.12, DuckDB, MetricFlow e dbt MCP local. Depois dela, pretendo produzir uma minissérie mostrando, com fronteiras comerciais claras, a dbt Platform, Semantic Layer gerenciada, Mesh e integrações MCP.

Gostaria de saber se existe acesso de creator, ambiente de demonstração ou trial estendido que permita gravar essas capacidades com segurança. O laboratório usa apenas dados públicos do Olist, não requer acesso a dados de clientes e todos os resultados serão identificados como medição própria ou resultado reportado por case.

Posso compartilhar o roteiro editorial, os links da playlist existente e a lista exata de recursos necessários. Também tenho interesse em participar da dbt Community e acompanhar a próxima abertura do programa Community Champions.

Obrigado pela orientação sobre o canal mais adequado.

Anselmo Borges
Rescue Point

## Message in English

**Subject:** Educational access request for a Portuguese dbt technical series

Hello dbt team,

My name is Anselmo Borges, and I run Rescue Point, a Portuguese-language data engineering channel with an existing hands-on dbt Core playlist.

I am preparing a new two-part series. The first season will contain 12 fully reproducible episodes using dbt Core 1.12, DuckDB, MetricFlow, and local dbt MCP. After completing the open-source season, I plan to publish a short series covering dbt Platform, the managed Semantic Layer, Mesh, and managed MCP integrations, with clear labels for free, paid, beta, and preview functionality.

Could you advise whether a creator environment, demo access, or an extended trial is available for recording these capabilities safely? The lab uses only the public Olist dataset, requires no customer data, and will clearly distinguish my own measurements from vendor-reported case-study results.

I can share the editorial outline, links to the existing playlist, and the exact feature list needed. I am also interested in contributing to the dbt Community and following the next Community Champions application window.

Thank you for pointing me to the appropriate program or contact.

Anselmo Borges
Rescue Point

## Regra operacional

Este arquivo prepara o contato; não o autoriza. Cadastro, envio de mensagem, compartilhamento de material privado ou ativação de trial exigem confirmação explícita do proprietário do canal.
