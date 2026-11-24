import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
import { addBonusSlides, bonusStem } from "./bonus_migration.mjs";

const execFileAsync = promisify(execFile);

const ROOT = process.env.COURSE_ROOT
  ? path.resolve(process.env.COURSE_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.resolve(process.env.COURSE_DECK_OUTPUT ?? path.join(ROOT, "assets/decks"));
const BUILD = path.resolve(process.env.COURSE_DECK_QA ?? path.join(ROOT, "build/decks"));
const PRACTICES = path.join(ROOT, "lab/praticas");
const LESSONS = JSON.parse(await fs.readFile(path.join(PRACTICES, "aulas.json"), "utf8"));

const C = {
  navy: "#06142E",
  navy2: "#0A2348",
  blue: "#1565C0",
  cyan: "#1EC5FF",
  pale: "#E2F2FF",
  white: "#FFFFFF",
  ink: "#0B1F3A",
  muted: "#5C6F86",
  line: "#BDD7EA",
  green: "#2DBE8C",
  amber: "#F4B942",
  red: "#EA5B5B",
};

const DOCS_COMMIT = "8249c7c904848efa786831381ca1d53b4157e392";
const DBT_DOCS = "https://docs.getdbt.com";
const V2_GA = `${DBT_DOCS}/blog/dbt-v2-is-ga`;
const V2_DISTRIBUTIONS = `${DBT_DOCS}/blog/comparing-dbt-and-dbt-oss`;
const CORE_PATCH = "https://github.com/dbt-labs/dbt/releases/tag/v1.12.7";
const DBT_STATE = `${DBT_DOCS}/docs/deploy/dbt-state-about`;

const diagrams = (name) => path.join(ROOT, "assets/diagrams/rendered", name);
const official = (name) => path.join(ROOT, "assets/official/dbt", name);
const banana = (name) => path.join(ROOT, "assets/illustrations/banana", name);
const screenshot = (name) => path.join(ROOT, "assets/screenshots/codespaces", name);
const practiceCapture = (name) => path.join(ROOT, "assets/screenshots/duckdb", name);
const docsCapture = (name) => path.join(ROOT, "assets/screenshots/dbt-docs", name);
const brandLogo = path.join(ROOT, "assets/brand/rescue-point-logo.png");
const imageContentType = (filePath) => path.extname(filePath).toLowerCase().match(/\.jpe?g$/) ? "image/jpeg" : "image/png";
let brandLogoBytes;

const decks = [
  {
    stem: "aula-00-ambiente",
    episode: "AULA 0",
    title: "Prepare seu laboratório dbt no Codespaces",
    subtitle: "Conheça os dados e prepare o laboratório no navegador",
    slides: 25,
    checkpoint: "01",
    script: "roteiros/aula-00-ambiente.md",
    presenter: {
      name: "Anselmo Borges",
      channel: "Engenharia de dados · Rescue Point",
      experience: ["Infraestrutura e bancos de dados", "Pipelines em Azure e Databricks", "Workshops práticos de dbt Core"],
      sources: ["https://br.linkedin.com/in/anselmoborges", "https://rescuepoint.com.br/"],
    },
    diagram: diagrams("episode-01-lifecycle.png"),
    hook: "Quanto dos pagamentos corresponde a pedidos entregues?",
    objective: ["Reconhecer as fontes do laboratório", "Validar o ambiente", "Consultar os primeiros pedidos"],
    sections: [
      { title: "SQL básico basta para começar", claim: "Terminal, Git, Python e dbt entram passo a passo.", bullets: ["SELECT, JOIN, GROUP BY, SUM e COUNT", "Nenhuma experiência prévia com dbt", "Comandos completos em todas as aulas"], visual: "steps", labels: ["SQL", "Terminal", "Python", "dbt"] },
      { title: "Codespaces é a rota recomendada", claim: "Code → Codespaces → Create codespace on main abre o laboratório no navegador.", bullets: ["Conta pessoal GitHub", "Sem instalar Python ou Git", "Mesmo ambiente para todos"], image: screenshot("01-code-codespaces.png"), imageWide: true, imageAlt: "Menu Code com a guia Codespaces e o botão Create codespace on main", caption: "Captura sanitizada do GitHub.com — 2026-09-01", imageSource: "https://github.com/AnselmoBorges/dbt-moderno-na-pratica" },
      { title: "2-core preserva a franquia gratuita", claim: "GitHub Free inclui 120 core-hours e 15 GB-mês; em 2-core, são cerca de 60 horas ativas.", bullets: ["Branch main", "Dev container do curso", "Máquina 2-core", "Pare o ambiente ao terminar"], image: screenshot("02-configuracao-2-core.png"), imageWide: true, imageAlt: "Configuração de Codespaces com branch main, dev container do curso e máquina 2-core", caption: "Captura sanitizada do GitHub.com — 2026-09-01", imageSource: "https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1354054687" },
      { title: "O repositório restaura o ambiente", claim: "Setup instala uma vez; a reabertura restaura PATH, profile e caminhos detectados.", bullets: ["Python 3.12 fixado", "dbt Core 1.12.7", "DuckDB 1.5.5", "Sem ativação manual"], visual: "flow", labels: ["Create", "setup", "paths", "checkpoint"] },
      { title: "Parar evita consumo de processamento", claim: "Stop codespace interrompe core-hours; armazenamento continua até excluir o ambiente.", bullets: ["Pare ao terminar cada aula", "Reabra o mesmo ambiente", "Exclua quando não precisar dos arquivos"], image: screenshot("03-parar-codespace.png"), imageWide: true, imageAlt: "Menu oficial de gerenciamento do Codespaces com a opção Stop codespace", caption: "GitHub Docs — CC BY 4.0 — commit 484d28e", imageSource: "https://github.com/github/docs/blob/484d28e95db7c592c368da359ff1a9fecb08a08a/assets/images/help/codespaces/stop-codespace-webui.png" },
      { title: "DuckDB UI oficial por túnel", claim: "Bônus com GitHub CLI autenticado e uma cópia do repositório no seu computador.", bullets: ["UI oficial dentro do Codespace", "Túnel no computador local", "Navegador em localhost:4213"], commands: [
        ["No Codespace, na raiz do repositório", "python course.py official-data-ui"],
        ["No computador local, na raiz da cópia do repositório", "gh auth refresh -h github.com -s codespace\npython course.py codespace-ui-tunnel"],
      ], image: practiceCapture("00-oficial.jpg"), imageAlt: "Notebook da DuckDB UI oficial com quatro pedidos e a data de entrega nula de o3.", caption: "DuckDB UI oficial, execução local com DuckDB 1.5.5", imageSource: "https://duckdb.org/docs/1.5/core_extensions/ui" },
    ],
    demo: { groups: [
      ["Configuração manual ou setup interrompido", "python course.py setup"],
      ["Validação do ambiente", "python course.py doctor\npython course.py paths\npython course.py checkpoint 01"],
      ["Opcional após o checkpoint", "python course.py data-ui"],
      ["Se precisar enviar um diagnóstico", "python course.py support-report"],
    ], observe: ["dbt e DuckDB do ambiente isolado", "Seeds e artifacts executados", "Explorador na porta privada 4213"], result: "Checkpoint 01 OK + exploração gráfica opcional" },
    impact: ["Governança: ambiente versionado", "FinOps: 2-core + stop", "IA: nenhuma chave necessária"],
    case: { number: "46 recursos", label: "baseline dbt validado localmente", caveat: "Resultado do laboratório, não benchmark de produção." },
    limitations: ["Codespaces exige internet e conta pessoal GitHub", "Franquias e cobrança podem mudar", "Explorador autoral é propositalmente simples", "UI oficial exige GitHub CLI local e escopo codespace"],
    radar: "O dbt v2 está em disponibilidade geral. Neste curso, o setup instala o Core 1.12.7.",
    cta: "Abra o Codespace em 2-core, execute checkpoint 01 e use a UI oficial por túnel somente como bônus.",
    sources: [CORE_PATCH, V2_GA, "https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository", "https://docs.github.com/en/billing/concepts/product-billing/github-codespaces", "https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage", "https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace", "https://docs.github.com/en/codespaces/reference/security-in-github-codespaces", "https://cli.github.com/manual/gh_codespace_ports_forward", "https://duckdb.org/docs/current/core_extensions/ui", "https://github.com/duckdb/duckdb-ui/issues/22", "https://github.com/duckdb/duckdb-ui/issues/186", "https://docs.getdbt.com/guides/manual-install?step=1", "https://github.com/dbt-labs/jaffle_shop_duckdb"],
  },
  {
    stem: "episodio-01-baseline-core-1-12",
    episode: "EPISÓDIO 1",
    title: "O que a série ensinou — e o que falta provar",
    subtitle: "Baseline aberto e suportado com dbt Core 1.12",
    slides: 20,
    checkpoint: "01",
    script: "roteiros/01-playlist-core-1-12.md",
    diagram: diagrams("episode-01-lifecycle.png"),
    hook: "Título de vídeo não é evidência. Manifest, testes e resultados executáveis são.",
    objective: ["Auditar a série original", "Separar implementado de conceitual", "Reconstruir o baseline suportado"],
    sections: [
      { title: "A base original continua valiosa", claim: "Ambiente, seeds, ref, table, view e primeira Gold foram demonstrados.", bullets: ["Fundamentos bem posicionados", "Materializações básicas", "Primeiro fluxo Silver → Gold"], visual: "compare", labels: ["Implementado", "Conceitual"] },
      { title: "Versões do laboratório", claim: "O Core executa o projeto e se conecta ao DuckDB pelo adaptador.", bullets: ["dbt Core 1.12.7", "Adaptador dbt-duckdb 1.11.1", "Banco DuckDB 1.5.5"], visual: "status", labels: ["Core 1.12.7", "Adaptador 1.11.1", "DuckDB 1.5.5"] },
      { title: "ref transforma SQL em um grafo", claim: "Dependências explícitas habilitam ordem, seleção e linhagem.", bullets: ["source → staging", "staging → Gold", "Gold → consumidor"], visual: "flow", labels: ["source", "staging", "Gold", "consumer"] },
      { title: "O mapa do projeto e o resultado da execução", claim: "O manifest descreve recursos e dependências. Run results registra o comando executado.", bullets: ["manifest.json", "Recursos e dependências", "run_results.json", "Status e duração"], visual: "compare", labels: ["Projeto", "Execução"] },
    ],
    demo: { command: "python course.py checkpoint 01", observe: ["8 pedidos na amostra", "Manifest e catálogo gerados", "Semantic manifest e OSI válidos"], result: "Baseline reproduzido" },
    impact: ["Governança: artifact auditável", "FinOps: versões reproduzíveis", "IA: contexto antes de SQL"],
    case: { number: "8 / 740 / 630", label: "pedidos / receita bruta / entregue", caveat: "Ground truth da amostra Olist do curso." },
    limitations: ["Incremental, testes e deploy não estavam implementados na série original", "Artifacts não substituem monitoramento", "Core 2.0 não entra na aceitação"],
    radar: "dbt OSS 2.0 é Apache 2.0. O pacote dbt, antigo Fusion, usa licença de produto.",
    cta: "No manifest, procure parent_map para ver as dependências.",
    ctaCommand: "code lab/dabdbt/target/manifest.json",
    sources: [CORE_PATCH, V2_GA, V2_DISTRIBUTIONS, "https://docs.getdbt.com/docs/dbt/supported-features", "https://docs.getdbt.com/reference/artifacts/manifest-json", "https://docs.getdbt.com/reference/artifacts/run-results-json", "https://github.com/dbt-labs/jaffle-shop"],
  },
  {
    stem: "episodio-02-gold-nao-e-semantica",
    episode: "EPISÓDIO 2",
    title: "Gold não é camada semântica",
    subtitle: "Dados preparados não garantem significado compartilhado",
    slides: 20,
    checkpoint: "02",
    script: "roteiros/02-gold-nao-e-semantica.md",
    diagram: diagrams("episode-02-grain.png"),
    hook: "Duas tabelas Gold corretas ainda podem responder receita com números diferentes.",
    objective: ["Separar Gold e semântica", "Proteger o grão de pedido", "Nomear métricas sem ambiguidade"],
    sections: [
      { title: "Quatro perguntas revelam a interface ausente", claim: "Grão, filtro, data e chave não podem ficar só na cabeça do autor.", bullets: ["Qual é o grão?", "Receita inclui cancelados?", "Qual data e qual chave?"], visual: "steps", labels: ["Grão", "Filtro", "Tempo", "Chave"] },
      { title: "Cinco conceitos, cinco responsabilidades", claim: "Tabela Gold, dimensional, semantic model, métrica e serviço não são sinônimos.", bullets: ["Gold prepara", "Modelo organiza", "Métrica nomeia", "Serviço opera"], visual: "flow", labels: ["Gold", "Dimensional", "Semântica", "Métrica", "Serviço"] },
      { title: "Join válido pode multiplicar dinheiro", claim: "Dois itens × dois pagamentos produzem quatro combinações.", bullets: ["O SQL compila", "O grão muda", "A soma fica falsa"], visual: "metric", labels: ["1 pedido", "2 itens", "2 pagamentos", "4 linhas"] },
      { title: "O ERD torna cardinalidade visível", claim: "Entidades e relações precisam anteceder a agregação.", bullets: ["Chave primária real", "Relações verificáveis", "Agregação antes do join"], image: official("orders_erd.png"), imageAlt: "ERD oficial da dbt com entidades e relacionamentos", caption: "Figura oficial da documentação dbt — Apache 2.0" },
      { title: "Métricas válidas precisam de nomes distintos", claim: "Receita bruta e receita entregue respondem perguntas diferentes.", bullets: ["orders", "gross_revenue", "delivered_revenue", "average_order_value"], visual: "compare", labels: ["Receita bruta", "Receita entregue"] },
    ],
    demo: { command: "python course.py checkpoint 02", observe: ["Gold no grão pedido", "Fachada commerce_orders", "10 respostas reconciliadas"], result: "Ground truth OK: 10 perguntas" },
    impact: ["Governança: nomes e owners", "FinOps: menos joins exploratórios", "IA: menos decisões probabilísticas"],
    case: { number: "83 métricas", label: "centralizadas pela Inventa", caveat: "90% de redução de manutenção reportada pela empresa/dbt Labs." },
    limitations: ["YAML não resolve desacordo de negócio", "Semântica não corrige fonte atrasada", "Distinct não é cura para cardinalidade"],
    radar: "O dbt v2 está em disponibilidade geral. A aula usa a especificação semântica do Core 1.12.",
    cta: "Documente nome, pergunta, grão, filtro, data e owner de três métricas.",
    sources: [V2_GA, "https://docs.getdbt.com/docs/build/latest-metrics-spec", "https://github.com/dbt-labs/metricflow", "https://www.getdbt.com/case-studies/inventa"],
  },
  {
    stem: "episodio-03-metricflow-local",
    episode: "EPISÓDIO 3",
    title: "MetricFlow local: métricas como código",
    subtitle: "Defina, valide, compile e execute sem conta dbt Platform",
    slides: 22,
    checkpoint: "03",
    script: "roteiros/03-metricflow-local.md",
    diagram: diagrams("episode-03-semantic-anatomy.png"),
    hook: "Uma métrica declarada uma vez pode gerar o mesmo SQL para todos os consumidores.",
    objective: ["Declarar entidades e dimensões", "Criar métricas simples e razão", "Reconciliar SQL com ground truth"],
    sections: [
      { title: "MetricFlow compila; não adivinha", claim: "A força vem de definições explícitas, não de geração probabilística.", bullets: ["Consulta lógica", "Grafo semântico", "SQL executável"], visual: "flow", labels: ["mf query", "grafo", "SQL", "DuckDB"] },
      { title: "Entidade começa pelo grão", claim: "order_id só pode ser primary se o modelo tiver uma linha por pedido.", bullets: ["Primary: order", "Foreign: customer", "Unicidade testada antes da métrica"], visual: "compare", labels: ["Entidade", "Grão físico"] },
      { title: "O exemplo oficial conecta schema e métricas", claim: "Chaves e tipos de coluna sustentam os caminhos do grafo.", bullets: ["PK e FK", "Dimensões", "Medidas"], image: official("MetricFlow-SchemaExample.jpeg"), imageAlt: "Exemplo oficial de schema para MetricFlow", caption: "Exemplo oficial dbt Labs — Apache 2.0" },
      { title: "Tempo também é contrato", claim: "A dimensão padrão precisa refletir a pergunta de negócio.", bullets: ["order_purchase_date", "Granularidade diária", "Time spine para operações temporais"], visual: "steps", labels: ["Evento", "Grão", "Calendário", "Métrica"] },
      { title: "Métricas simples vivem perto do dado", claim: "Contagem, soma e receita entregue reutilizam colunas já testadas.", bullets: ["orders: count_distinct", "gross_revenue: sum", "delivered_revenue: sum"], visual: "metric", labels: ["8 pedidos", "740 bruto", "630 entregue"] },
      { title: "Razões reutilizam métricas nomeadas", claim: "Ticket médio compõe gross_revenue e orders sem copiar a fórmula.", bullets: ["Numerador governado", "Denominador governado", "Precisão e zero documentados"], visual: "flow", labels: ["gross_revenue", "÷", "orders", "AOV"] },
    ],
    demo: { command: "python course.py checkpoint 03", observe: ["mf validate-configs sem erro", "Consulta mensal compilada", "Janeiro a abril reconciliados"], result: "8 pedidos · 740 bruto · 630 entregue · 92,50 AOV" },
    impact: ["Governança: Git e ownership", "FinOps: reuso com cardinalidade", "IA: nomes em vez de joins inventados"],
    case: { number: "2 → 13", label: "contribuidores reportados pela Inventa", caveat: "O laboratório comprova apenas validação, SQL e reconciliação." },
    limitations: ["MetricFlow não decide a definição da métrica", "Alta cardinalidade ainda custa", "Biblioteca aberta não é o serviço hospedado"],
    radar: "MetricFlow 0.214.0 é o motor. A CLI mf vem do pacote dbt-metricflow 0.16.0.",
    cta: "Implemente uma métrica simples e uma razão e reconcilie os valores.",
    sources: ["https://pypi.org/project/dbt-metricflow/0.16.0/", "https://pypi.org/project/metricflow/0.214.0/", "https://github.com/dbt-labs/metricflow", "https://docs.getdbt.com/docs/build/latest-metrics-spec", "https://www.getdbt.com/case-studies/inventa"],
  },
  {
    stem: "episodio-04-semantica-aberta-interoperavel",
    episode: "EPISÓDIO 4",
    title: "Semântica aberta e interoperável",
    subtitle: "Uma definição, múltiplos canais de consumo",
    slides: 20,
    checkpoint: "04",
    script: "roteiros/04-semantica-aberta-interoperavel.md",
    diagram: diagrams("episode-04-osi.png"),
    hook: "Interoperabilidade começa quando o consumidor não precisa copiar a fórmula.",
    objective: ["Consultar MetricFlow", "Publicar SQL governado", "Validar um artifact OSI"],
    sections: [
      { title: "Três interfaces, uma fonte de significado", claim: "MetricFlow, SQL e OSI reutilizam o mesmo contrato semântico.", bullets: ["Consulta local", "Fachada estável", "Artifact versionado"], visual: "flow", labels: ["YAML", "MetricFlow", "SQL", "OSI"] },
      { title: "Consulta lógica reduz acoplamento", claim: "O consumidor pede métrica e dimensão; o compilador resolve o caminho.", bullets: ["Nome estável", "Filtro permitido", "SQL inspecionável"], visual: "steps", labels: ["Pedido", "Plano", "SQL", "Resultado"] },
      { title: "SQL governado continua útil", claim: "BI e APIs podem consumir uma fachada sem reimplementar regra.", bullets: ["Schema e versão", "Owner e SLA", "Freshness e lineage"], visual: "compare", labels: ["Contrato", "Consumidor"] },
      { title: "OSI é um contrato, não um conector mágico", claim: "O artifact descreve semântica; cada consumidor ainda precisa implementar compatibilidade.", bullets: ["Documento validável", "Versão explícita", "Sem promessa de universalidade"], visual: "status", labels: ["Artifact", "Validação", "Compatibilidade"] },
      { title: "Agentes ganham vocabulário compacto", claim: "Nomes de métricas comprimem contexto e reduzem joins inventados.", bullets: ["delivered_revenue", "metric_time", "Dimensões permitidas"], visual: "flow", labels: ["Pergunta", "Métrica", "SQL", "Resposta"] },
    ],
    demo: { command: "python course.py checkpoint 04", observe: ["MetricFlow consultado", "Artifact OSI validado", "10 perguntas executadas em DuckDB"], result: "Mesmo valor via métrica e SQL" },
    impact: ["Governança: fórmula versionada", "FinOps: reuso mensurável", "IA: contexto mais curto"],
    case: { number: "83 métricas", label: "mantidas pela Inventa", caveat: "Resultado reportado; o mecanismo é centralização com ownership." },
    limitations: ["OSI continua evoluindo", "Export exige freshness e lineage", "API local não é a Semantic Layer gerenciada"],
    radar: "O dbt v2 oferece artifacts Parquet. Nesta aula, vamos abrir o JSON OSI gerado pelo Core 1.12.",
    cta: "Prove a mesma métrica via MetricFlow e SQL sem copiar a fórmula.",
    sources: [V2_GA, "https://github.com/open-semantic-interchange/OSI", "https://github.com/dbt-labs/metricflow", "https://www.getdbt.com/blog/how-the-dbt-semantic-layer-works"],
  },
  {
    stem: "episodio-05-contratos-versoes",
    episode: "EPISÓDIO 5",
    title: "Contratos e versões: Gold como API",
    subtitle: "Bloqueie quebra estrutural antes do consumidor",
    slides: 20,
    checkpoint: "05",
    script: "roteiros/05-contratos-versoes.md",
    diagram: diagrams("episode-05-contracts.png"),
    hook: "Se um dashboard ou agente depende da Gold, ela já é uma API.",
    objective: ["Aplicar contract", "Coexistir v1 e v2", "Provar um breaking change bloqueado"],
    sections: [
      { title: "Contrato protege forma, não verdade", claim: "Nomes e tipos podem estar corretos enquanto a regra de negócio está errada.", bullets: ["Schema esperado", "Tipos coerentes", "Comportamento testado separadamente"], visual: "compare", labels: ["Estrutura", "Semântica"] },
      { title: "Contrate o limite público", claim: "Interfaces críticas merecem rigidez; staging ainda precisa evoluir.", bullets: ["Dashboard", "API", "Outro domínio", "Agente"], visual: "flow", labels: ["Privado", "Contrato", "Público"] },
      { title: "Versão é para mudança incompatível", claim: "Remover coluna pede nova versão; adicionar coluna costuma ser compatível.", bullets: ["v1 continua ativa", "v2 vira latest", "Consumidores migram com prazo"], visual: "compare", labels: ["v1", "v2"] },
      { title: "Depreciação precisa de saída", claim: "Versão sem owner, consumidor e data vira dívida permanente.", bullets: ["Publicação", "Aviso", "Fim do suporte", "Remoção"], visual: "steps", labels: ["Publicar", "Avisar", "Migrar", "Remover"] },
      { title: "Mudança semântica exige outro controle", claim: "Manter nome e tipo não impede delivered_revenue de mudar silenciosamente.", bullets: ["Unit test", "Data test", "Ground truth", "Changelog"], visual: "flow", labels: ["Schema", "Teste", "Valor", "Consumidor"] },
    ],
    demo: { command: "python course.py checkpoint 05", observe: ["Cópia temporária do projeto", "customer_id removido da v2", "Build específico retorna falha"], result: "Breaking change bloqueada" },
    impact: ["Governança: migração explícita", "FinOps: falha antecipada", "IA: schema previsível"],
    case: { number: "v1 + v2", label: "coexistem durante a migração", caveat: "Evidência do laboratório; sem porcentagem comercial." },
    limitations: ["Constraints variam por adaptador", "Contrato não detecta toda lógica", "Versões duplicadas têm custo"],
    radar: "O dbt v2 também valida contratos. Antes de migrar, reproduza os testes de quebra no seu adaptador.",
    cta: "Simule a remoção de uma coluna pública e verifique se a CI bloqueia.",
    sources: [V2_GA, "https://docs.getdbt.com/docs/mesh/govern/model-contracts", "https://docs.getdbt.com/docs/mesh/govern/model-versions", "https://docs.getdbt.com/docs/mesh/govern/about-model-governance"],
  },
  {
    stem: "episodio-06-piramide-qualidade",
    episode: "EPISÓDIO 6",
    title: "A pirâmide moderna de qualidade de dados",
    subtitle: "Cada risco pede um mecanismo de detecção diferente",
    slides: 21,
    checkpoint: "06",
    script: "roteiros/06-piramide-qualidade.md",
    diagram: diagrams("episode-06-quality.png"),
    hook: "not_null pode passar enquanto um prazo devolve menos cinco dias.",
    objective: ["Separar cinco mecanismos", "Isolar uma regra funcional", "Testar freshness sem depender da data"],
    sections: [
      { title: "Cinco perguntas, cinco mecanismos", claim: "Unit, contrato, data test, freshness e observabilidade cobrem riscos distintos.", bullets: ["Lógica", "Estrutura", "População", "Atraso", "Comportamento"], visual: "layers", labels: ["Contrato", "Unit", "Data", "Freshness", "SLO"] },
      { title: "Unit test captura o bug conhecido", claim: "Compra em 1º e entrega em 5 de janeiro devem produzir quatro dias positivos.", bullets: ["Entrada mínima", "Saída esperada", "Regressão determinística"], visual: "compare", labels: ["Fixture", "4 dias"] },
      { title: "O exemplo oficial mostra execução isolada", claim: "Unit tests validam lógica SQL antes de materializar toda a população.", bullets: ["Inputs estáticos", "Modelo selecionado", "Falha localizada"], image: official("unit-test-terminal-output.png"), imageAlt: "Saída oficial de unit test do dbt no terminal", caption: "Exemplo oficial dbt Labs — Apache 2.0" },
      { title: "Data tests procuram violações reais", claim: "A população materializada pode falhar mesmo quando o exemplo unitário passa.", bullets: ["unique e not_null", "accepted_values", "Regra delivered_revenue"], visual: "flow", labels: ["Build", "População", "Teste", "Falha"] },
      { title: "Freshness responde se a fonte chegou", claim: "Uma fixture recente passa; a mesma carga envelhecida deve falhar.", bullets: ["loaded_at_field", "SLA explícito", "Teste positivo e negativo"], visual: "status", labels: ["Recente", "Warning", "Error"] },
    ],
    demo: { command: "python course.py checkpoint 06", observe: ["Unit test do intervalo", "25 data tests", "Freshness recente e envelhecida"], result: "45 PASS · 1 NO-OP · 0 erros" },
    impact: ["Governança: risco e owner", "FinOps: controle na etapa barata", "IA: interfaces testadas"],
    case: { number: "+4 dias", label: "resultado esperado do bug de data", caveat: "Mini-case reproduzido no laboratório." },
    limitations: ["Freshness não mede volume", "Teste pesado pode custar", "Alerta sem runbook vira ruído"],
    radar: "Engines novas antecipam parse; não substituem testes, freshness ou SLO.",
    cta: "Escreva o menor unit test que reproduz um bug possível.",
    sources: ["https://docs.getdbt.com/docs/build/unit-tests", "https://docs.getdbt.com/docs/build/data-tests", "https://docs.getdbt.com/docs/build/sources#source-data-freshness"],
  },
  {
    stem: "episodio-07-governanca-como-codigo",
    episode: "EPISÓDIO 7",
    title: "Governança como código",
    subtitle: "Metadado útil produz uma ação verificável",
    slides: 20,
    checkpoint: "07",
    script: "roteiros/07-governanca-como-codigo.md",
    diagram: diagrams("episode-07-governance.png"),
    hook: "Owner sem alerta e tag sem seleção são apenas decoração no YAML.",
    objective: ["Definir responsabilidade", "Controlar acesso lógico", "Expor dashboards e agentes"],
    sections: [
      { title: "Todo metadado precisa produzir uma ação", claim: "Owner roteia alerta; access bloqueia ref; exposure revela impacto.", bullets: ["owner → resposta", "access → compilação", "tag → seleção", "exposure → impacto"], visual: "flow", labels: ["Metadado", "Política", "Ação", "Evidência"] },
      { title: "Group e access criam uma fronteira", claim: "Modelos privados evoluem dentro do domínio; públicos viram interface.", bullets: ["private", "protected", "public"], visual: "layers", labels: ["private", "protected", "public"] },
      { title: "Tags e meta carregam política", claim: "Classificação só é útil quando seleção e validação a consomem.", bullets: ["pii", "critical", "gold", "agent_readable"], visual: "status", labels: ["Classificar", "Selecionar", "Validar"] },
      { title: "Exposure coloca o consumidor no grafo", claim: "Dashboard e agente deixam de ser dependências invisíveis.", bullets: ["Owner", "Maturidade", "URL descritiva", "Modelos dependentes"], image: official("dag-exposures.png"), imageAlt: "DAG oficial da dbt mostrando exposures", caption: "Figura oficial da documentação dbt — Apache 2.0" },
      { title: "Project Evaluator transforma convenção em teste", claim: "Regras de estrutura podem ser avaliadas como parte da CI.", bullets: ["Governance tests", "Padrões compartilhados", "Exceções conscientes"], visual: "flow", labels: ["Projeto", "Evaluator", "Finding", "Ação"] },
    ],
    demo: { command: "python course.py checkpoint 07", observe: ["Groups e owners", "Access público/privado", "Exposure de dashboard e agente"], result: "Metadados governados no manifest" },
    impact: ["Governança: ação e owner", "FinOps: seleção por tag", "IA: escopo de leitura"],
    case: { number: "2 exposures", label: "dashboard e agente no grafo", caveat: "Evidência do laboratório, sem recurso Enterprise." },
    limitations: ["Meta não aplica segurança física", "Tag sem processo não governa", "Owner precisa de canal operacional"],
    radar: "Catálogo avançado amplia experiência, mas o contrato open já é executável.",
    cta: "Escolha um produto Gold e declare owner, group, access e exposure.",
    sources: ["https://docs.getdbt.com/docs/build/exposures", "https://docs.getdbt.com/docs/mesh/govern/about-model-governance", "https://github.com/dbt-labs/dbt-project-evaluator"],
  },
  {
    stem: "episodio-08-data-products-open",
    episode: "EPISÓDIO 8",
    title: "Data products sem depender de Mesh",
    subtitle: "Domínios e interfaces públicas com recursos abertos",
    slides: 18,
    checkpoint: "08",
    script: "roteiros/08-data-products-open.md",
    diagram: diagrams("episode-08-domains.png"),
    hook: "Produto de dados não é uma pasta Gold com nome novo.",
    objective: ["Definir domínio e interface", "Evitar dependência privada", "Escolher quando separar projetos"],
    sections: [
      { title: "Produto combina contrato e responsabilidade", claim: "Interface, owner, SLA e consumidores importam mais que a pasta.", bullets: ["Quem produz", "O que promete", "Quem consome"], visual: "flow", labels: ["Domínio", "Interface", "Consumidor"] },
      { title: "Separações horizontal e vertical resolvem problemas diferentes", claim: "A topologia deve seguir ownership e ciclo de mudança.", bullets: ["Por domínio", "Por camada", "Por plataforma"], image: official("combined_splits.png"), imageAlt: "Diagramas oficiais de separação horizontal e vertical de projetos dbt", caption: "Figura oficial dbt Labs — Apache 2.0" },
      { title: "Core aberto já oferece limites úteis", claim: "Groups, access, packages e refs organizam dependências dentro do projeto.", bullets: ["Interfaces públicas", "Modelos privados", "Packages versionados"], visual: "layers", labels: ["Domínio A", "Contrato", "Domínio B"] },
      { title: "Separe fisicamente quando o custo se paga", claim: "Autonomia, segurança e ciclos independentes precisam superar a complexidade.", bullets: ["Ownership real", "Release independente", "Governança de dependência"], visual: "compare", labels: ["Monorepo", "Multi-project"] },
    ],
    demo: { command: "python course.py checkpoint 08", observe: ["Domínios declarados", "Dependências públicas", "Refs privadas bloqueadas"], result: "Data products sem cross-project pago" },
    impact: ["Governança: limites claros", "FinOps: evite duplicação", "IA: contexto por domínio"],
    case: { number: "10 domínios", label: "padrão anonimizado do projeto privado", caveat: "Estrutura reproduzida com Olist; nenhum código proprietário." },
    limitations: ["Multi-project aumenta coordenação", "Package não substitui ownership", "Cross-project gerenciado fica fora"],
    radar: "Mesh Enterprise entra somente quando dependência organizacional justificar o custo.",
    cta: "Defina um domínio, sua interface pública e duas dependências proibidas.",
    sources: ["https://docs.getdbt.com/docs/build/groups", "https://docs.getdbt.com/docs/build/packages", "https://docs.getdbt.com/docs/mesh/govern/model-access"],
  },
  {
    stem: "episodio-09-ci-state-defer",
    episode: "EPISÓDIO 9",
    title: "CI inteligente com artifacts, state e defer",
    subtitle: "Teste o impacto necessário sem reconstruir o mundo",
    slides: 20,
    checkpoint: "09",
    script: "roteiros/09-ci-state-defer.md",
    diagram: diagrams("episode-09-state.png"),
    hook: "CI rápida não significa selecionar menos; significa selecionar o impacto correto.",
    objective: ["Comparar manifests", "Selecionar modified+", "Usar defer com clareza"],
    sections: [
      { title: "Artifact não é lixo de build", claim: "O manifest anterior é a referência que permite calcular mudança.", bullets: ["Estado anterior", "Estado atual", "Diff de recursos"], visual: "compare", labels: ["manifest anterior", "manifest atual"] },
      { title: "state:modified encontra a mudança", claim: "O sufixo + inclui descendentes que podem ser afetados.", bullets: ["Modelo editado", "Testes associados", "Consumidores descendentes"], visual: "flow", labels: ["Mudou", "Filhos", "Testes", "Exposures"] },
      { title: "Seleção mínima ingênua perde risco", claim: "Testar apenas o arquivo alterado pode ignorar contratos e consumidores.", bullets: ["Impacto no DAG", "Testes indiretos", "Dependências públicas"], visual: "compare", labels: ["Arquivo", "Impacto"] },
      { title: "Defer reutiliza relações de outro estado", claim: "Modelos não construídos localmente podem apontar para produção ou staging.", bullets: ["Resolve refs", "Evita recomputação", "Exige estado confiável"], image: official("defer-diagram.png"), imageAlt: "Diagrama oficial da dbt explicando defer entre ambientes", caption: "Figura oficial da documentação dbt — Apache 2.0" },
      { title: "CI madura tem três níveis", claim: "Parse barato, seleção por impacto e validação completa cumprem papéis diferentes.", bullets: ["PR rápido", "Gate de integração", "Build completo programado"], visual: "layers", labels: ["Parse", "Modified+", "Full build"] },
    ],
    demo: { command: "python course.py checkpoint 09", observe: ["Manifest baseline preservado", "Mudança sintética isolada", "Seleção e defer comparados"], result: "Somente o ramo afetado é selecionado" },
    impact: ["Governança: impacto visível", "FinOps: menos recomputação", "IA: artifacts atualizados"],
    case: { number: "modified+", label: "mudança e descendentes", caveat: "A economia depende do tamanho e da topologia do projeto." },
    limitations: ["Estado velho seleciona errado", "Defer pode esconder divergência", "Full build continua necessário"],
    radar: "O serviço dbt State está em GA e exige conta. A seleção state:modified usa um manifest local.",
    cta: "Salve um manifest e compare a seleção antes e depois de uma mudança.",
    sources: [DBT_STATE, CORE_PATCH, "https://docs.getdbt.com/reference/node-selection/defer", "https://docs.getdbt.com/reference/node-selection/methods#the-state-method"],
  },
  {
    stem: "episodio-10-finops-pipeline",
    episode: "EPISÓDIO 10",
    title: "FinOps do pipeline",
    subtitle: "Menos recomputação sem mudar o resultado funcional",
    slides: 22,
    checkpoint: "10",
    script: "roteiros/10-finops-pipeline.md",
    diagram: diagrams("episode-10-finops.png"),
    hook: "Otimização só é válida quando o resultado continua igual ao full build.",
    objective: ["Corrigir incremental", "Medir linhas e duração", "Usar microbatch somente quando fizer sentido"],
    sections: [
      { title: "Custo precisa de uma equação", claim: "Compute × tempo não é o único componente.", bullets: ["Compute e duração", "Storage e orquestração", "Retries e retrabalho"], visual: "metric", labels: ["compute", "tempo", "storage", "retries"] },
      { title: "Incremental exige filtro e chave", claim: "merge sem is_incremental() ainda lê todo o histórico.", bullets: ["unique_key", "Filtro de candidatos", "Equivalência com full refresh"], visual: "flow", labels: ["Fonte", "Filtro", "Merge", "Tabela"] },
      { title: "O diagrama oficial mostra a redução de leitura", claim: "Registros existentes permanecem; somente novos candidatos entram.", bullets: ["Estado existente", "Novos registros", "Resultado acumulado"], image: official("incremental-diagram.jpg"), imageAlt: "Diagrama oficial da dbt sobre modelo incremental", caption: "Figura oficial da documentação dbt — Apache 2.0" },
      { title: "Microbatch precisa de event_time", claim: "Lotes temporais só ajudam quando evento, janela e backfill são mensuráveis.", bullets: ["event_time", "batch_size", "lookback"], image: official("event_time.png"), imageAlt: "Diagrama oficial de event_time para microbatch no dbt", caption: "Figura oficial da documentação dbt — Apache 2.0" },
      { title: "Materialização muda o perfil de custo", claim: "View, table e incremental trocam compute, storage e latência.", bullets: ["View: compute na leitura", "Table: compute na construção", "Incremental: estado e complexidade"], visual: "compare", labels: ["View", "Table", "Incremental"] },
      { title: "Benchmark precisa de correção funcional", claim: "Linhas e segundos só importam depois de reconciliar o ground truth.", bullets: ["Mesmo resultado", "Menos linhas processadas", "Duração normalizada"], visual: "status", labels: ["Correção", "Volume", "Tempo"] },
    ],
    demo: { command: "python course.py checkpoint 10", observe: ["Full build registrado", "Incremental com lote novo", "Resultados reconciliados"], result: "Equivalência funcional + redução mensurável" },
    impact: ["Governança: regra testada", "FinOps: custo observado", "IA: tabela previsível"],
    case: { number: "70%", label: "redução de consumo reportada pela Symend", caveat: "Resultado da empresa/dbt Labs; não é expectativa universal." },
    limitations: ["DuckDB não estima custo cloud", "Microbatch adiciona complexidade", "Benchmark varia por máquina"],
    radar: "Materialization v2 e engines novas só entram depois de evidência estável.",
    cta: "Compare full e incremental e prove igualdade antes de falar em economia.",
    sources: ["https://docs.getdbt.com/docs/build/incremental-models-overview", "https://docs.getdbt.com/docs/build/incremental-microbatch", "https://www.getdbt.com/case-studies/symend"],
  },
  {
    stem: "episodio-11-dbt-mcp",
    episode: "EPISÓDIO 11",
    title: "dbt MCP: contexto governado para o agente",
    subtitle: "Manifest, documentação e linhagem com mínimo privilégio",
    slides: 20,
    checkpoint: "11",
    script: "roteiros/11-dbt-mcp.md",
    diagram: diagrams("episode-11-mcp.png"),
    hook: "MCP não torna o agente confiável; torna a fronteira de contexto explícita.",
    objective: ["Conectar um cliente neutro", "Aplicar allowlist", "Rejeitar SQL e codegen"],
    sections: [
      { title: "MCP separa cliente e contexto", claim: "O protocolo descreve ferramentas; o servidor decide o que expor.", bullets: ["Cliente neutro", "Servidor dbt", "Artifacts locais"], visual: "flow", labels: ["Cliente", "MCP", "dbt", "Manifest"] },
      { title: "A arquitetura oficial mostra múltiplos consumidores", claim: "O servidor conecta ativos dbt a diferentes fluxos de agente.", bullets: ["Discovery", "Semantic context", "Execução controlada"], image: official("mcp_architecture_overview.png"), imageAlt: "Arquitetura oficial do servidor MCP da dbt", caption: "Figura oficial dbt Labs — Apache 2.0" },
      { title: "Modelo de ameaça vem antes da conexão", claim: "Leitura de metadata não deve abrir escrita ou SQL arbitrário.", bullets: ["Dados sensíveis", "Ferramentas mutantes", "Prompt injection", "Credenciais"], visual: "layers", labels: ["Cliente", "Allowlist", "Servidor", "Dados"] },
      { title: "Allowlist é uma política executável", claim: "Manifest, docs e linhagem entram; SQL e codegen ficam fora.", bullets: ["5 tools de leitura", "Sem credencial cloud", "Negação testada"], visual: "compare", labels: ["Permitido", "Bloqueado"] },
      { title: "Contexto melhora antes da resposta", claim: "O agente encontra owner, dependência e métrica sem inferir o schema bruto.", bullets: ["Manifest", "Documentação", "Linhagem", "Métricas"], visual: "flow", labels: ["Pergunta", "Contexto", "Plano", "Resposta"] },
    ],
    demo: { command: "python course.py checkpoint 11", observe: ["Servidor local inicia", "Cinco tools permitidas", "SQL e codegen rejeitados"], result: "MCP somente leitura validado" },
    impact: ["Governança: mínimo privilégio", "FinOps: menos tentativa", "IA: contexto verificável"],
    case: { number: "interface governada", label: "padrão reportado pela impact.com", caveat: "Case publicado pela empresa/dbt Labs; o laboratório testa apenas a fronteira local." },
    limitations: ["MCP não corrige metadata ruim", "Cliente ainda pode raciocinar errado", "Acesso ao banco permanece separado"],
    radar: "Tools gerenciadas e SQL entram somente na temporada de plataforma.",
    cta: "Liste as ferramentas permitidas e prove que uma proibida é rejeitada.",
    sources: ["https://docs.getdbt.com/docs/dbt-ai/about-mcp", "https://github.com/dbt-labs/dbt-mcp", "https://www.getdbt.com/case-studies/impact.com"],
  },
  {
    stem: "episodio-12-gold-governada-agente-solto",
    episode: "EPISÓDIO 12",
    title: "Gold governada versus agente solto",
    subtitle: "Compare raw, manifest e métricas contra o mesmo ground truth",
    slides: 24,
    checkpoint: "12",
    script: "roteiros/12-gold-governada-agente-solto.md",
    diagram: diagrams("episode-12-benchmark.png"),
    hook: "O agente não deve inventar as regras que o pipeline pode executar e testar.",
    objective: ["Fixar ground truth", "Comparar três tratamentos", "Medir qualidade e custo normalizado"],
    sections: [
      { title: "Três tratamentos, uma pergunta", claim: "Tudo permanece igual, exceto a interface oferecida ao agente.", bullets: ["A: schema bruto", "B: manifest e docs", "C: métricas governadas"], visual: "compare", labels: ["Raw", "Manifest", "Métricas"] },
      { title: "Ground truth vem antes do LLM", claim: "O pipeline calcula as respostas esperadas sem depender do modelo.", bullets: ["Pergunta fixa", "SQL conhecido", "Resultado versionado"], visual: "flow", labels: ["Pipeline", "Ground truth", "Avaliador"] },
      { title: "Trace transforma opinião em evidência", claim: "Resposta, SQL, resultado, tokens, tools e latência ficam no mesmo JSON.", bullets: ["input/output tokens", "tool calls", "joins inválidos", "custo normalizado"], visual: "steps", labels: ["Pergunta", "Trace", "Score", "Comparação"] },
      { title: "Fixture não é execução real", claim: "Traces gravados testam o avaliador; não provam desempenho de um LLM.", bullets: ["CI sem chave", "Dados sintéticos", "Execução real posterior"], visual: "status", labels: ["Fixture", "Validação", "LLM real"] },
      { title: "A recomendação oficial favorece contexto semântico", claim: "Mais modelagem tende a ampliar precisão e segurança das respostas.", bullets: ["Cobertura", "Precisão", "Confiabilidade"], image: official("recommendation-diagram.png"), imageAlt: "Diagrama oficial comparando Semantic Layer e text-to-SQL para agentes", caption: "Figura oficial dbt Labs — Apache 2.0" },
      { title: "A arquitetura recomendada termina no agente", claim: "Regras ficam na Gold e nas métricas; o agente consome e explica.", bullets: ["Silver prepara", "Gold aplica regra", "Métrica nomeia", "MCP entrega contexto"], visual: "flow", labels: ["Silver", "Gold", "Métricas", "MCP", "Agente"] },
    ],
    demo: { command: "python course.py checkpoint 12", observe: ["Perguntas fixas", "Traces gravados", "Avaliador e ground truth"], result: "Benchmark determinístico sem chave de LLM" },
    impact: ["Governança: consenso em código", "FinOps: custo normalizado", "IA: consumidor, não inventor"],
    case: { number: "80%", label: "redução de analytics reportada pela Bilt", caveat: "Resultado reportado; o laboratório não generaliza o percentual." },
    limitations: ["Fixtures não medem qualidade real do modelo", "Tokens variam por cliente", "Semântica não elimina toda ambiguidade"],
    radar: "dbt State e MCP gerenciado continuam fora da aceitação open.",
    cta: "Mova uma regra determinística do prompt para o pipeline e teste-a.",
    sources: ["https://docs.getdbt.com/docs/dbt-ai/about-mcp", "https://www.getdbt.com/case-studies/bilt-rewards", "https://www.getdbt.com/case-studies/impact.com"],
  },
];

for (const deck of decks) deck.illustration = banana(`${deck.stem}.jpg`);

function addShape(slide, geometry, position, fill, line = { style: "solid", fill: "none", width: 0 }, name) {
  return slide.shapes.add({ geometry, position, fill, line, name });
}

function addText(slide, value, position, style = {}, name) {
  const shape = addShape(slide, "textbox", position, "none", { style: "solid", fill: "none", width: 0 }, name);
  shape.text = value;
  shape.text.style = { fontFamily: "Arial", fontSize: 24, color: C.ink, ...style };
  return shape;
}

function dark(slide) {
  slide.background.fill = `linear(135deg, ${C.navy} 0%, ${C.navy2} 100%)`;
}

function light(slide) {
  slide.background.fill = C.pale;
}

function addGlow(slide, left = 980, top = 80, size = 220) {
  addShape(slide, "ellipse", { left, top, width: size, height: size }, "#1EC5FF18", { style: "solid", fill: "#1EC5FF30", width: 2 }, "ambient-glow");
  addShape(slide, "ellipse", { left: left + 48, top: top + 48, width: size - 96, height: size - 96 }, "#1565C025", { style: "solid", fill: "#1EC5FF55", width: 2 }, "ambient-core");
}

function addBrandLogo(slide) {
  addShape(slide, "roundRect", { left: 1026, top: 14, width: 182, height: 48 }, C.navy, { style: "solid", fill: "#1EC5FF55", width: 1 }, "rescue-point-logo-background");
  slide.images.add({
    blob: brandLogoBytes,
    contentType: "image/png",
    alt: "Logotipo oficial da Rescue Point.",
    fit: "contain",
    position: { left: 1038, top: 22, width: 158, height: 34 },
  });
}

function addChrome(slide, deck, index, total, isDark = true) {
  addText(slide, `${deck.episode}  •  ${deck.track ?? "OPEN / CORE 1.12"}`, { left: 72, top: 28, width: 540, height: 28 }, { fontSize: 14, bold: true, color: isDark ? C.cyan : C.blue }, "eyebrow");
  addBrandLogo(slide);
  addShape(slide, "line", { left: 72, top: 675, width: 1136, height: 0 }, "none", { style: "solid", fill: isDark ? "#FFFFFF30" : "#1565C035", width: 1 }, "footer-rule");
  addText(slide, "dbt Moderno na Prática • Rescue Point • curso independente", { left: 72, top: 682, width: 880, height: 22 }, { fontSize: 11, color: isDark ? "#FFFFFF88" : "#0B1F3A88" }, "footer");
  addText(slide, `${index}/${total}`, { left: 1120, top: 682, width: 88, height: 22 }, { fontSize: 11, bold: true, color: isDark ? "#FFFFFF88" : "#0B1F3A88", alignment: "right" }, "page-number");
}

function setNotes(slide, text, sources) {
  const unique = [...new Set(sources.filter(Boolean))];
  slide.speakerNotes.textFrame.setText(`${text}\n\n[Sources]\n${unique.map((s) => `- ${s}`).join("\n")}`);
  slide.speakerNotes.setVisible(true);
}

function addTitle(slide, title, isDark = true, subtitle = null) {
  addText(slide, title, { left: 72, top: 82, width: 1040, height: 112 }, { fontSize: 39, bold: true, color: isDark ? C.white : C.ink }, "slide-title");
  if (subtitle) addText(slide, subtitle, { left: 72, top: 188, width: 940, height: 58 }, { fontSize: 22, color: isDark ? C.pale : C.muted }, "slide-subtitle");
}

function addBullets(slide, bullets, position, isDark = true, fontSize = 24) {
  const text = bullets.map((b) => `• ${b}`).join("\n");
  return addText(slide, text, position, { fontSize, color: isDark ? C.white : C.ink }, "bullets");
}

function addImagePanel(slide, imagePath, imageBytes, alt, caption, isDark = true) {
  addShape(slide, "roundRect", { left: 540, top: 168, width: 668, height: 430 }, C.white, { style: "solid", fill: isDark ? "#1EC5FF55" : C.line, width: 2 }, "image-surface");
  slide.images.add({ blob: imageBytes, contentType: imageContentType(imagePath), alt, fit: "contain", position: { left: 570, top: 190, width: 608, height: 350 } });
  addText(slide, caption, { left: 570, top: 548, width: 608, height: 34 }, { fontSize: 12, color: C.muted, italic: true }, "image-caption");
}

function addFlow(slide, labels, y = 360, isDark = true) {
  const count = labels.length;
  const gap = 28;
  const totalW = 1110;
  const boxW = (totalW - gap * (count - 1)) / count;
  const boxes = labels.map((label, i) => {
    const left = 85 + i * (boxW + gap);
    const b = addShape(slide, "roundRect", { left, top: y, width: boxW, height: 112 }, isDark ? "#0D3260" : C.white, { style: "solid", fill: isDark ? C.cyan : C.blue, width: 2 }, `flow-${i + 1}`);
    b.text = label;
    b.text.style = { fontFamily: "Arial", fontSize: count > 4 ? 18 : 21, bold: true, color: isDark ? C.white : C.ink, alignment: "center", verticalAlignment: "middle" };
    return b;
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    slide.shapes.connect(boxes[i], boxes[i + 1], { kind: "straight", fromSide: "right", toSide: "left", line: { style: "solid", fill: isDark ? C.cyan : C.blue, width: 3 }, head: { type: "arrow", width: "med", length: "med" } });
  }
}

function addCompare(slide, labels, bullets, isDark = true) {
  const leftLabel = labels[0] ?? "Antes";
  const rightLabel = labels[1] ?? "Depois";
  addText(slide, leftLabel, { left: 92, top: 300, width: 480, height: 52 }, { fontSize: 28, bold: true, color: isDark ? C.cyan : C.blue }, "compare-left-title");
  addText(slide, rightLabel, { left: 708, top: 300, width: 480, height: 52 }, { fontSize: 28, bold: true, color: isDark ? C.green : C.blue }, "compare-right-title");
  addShape(slide, "line", { left: 640, top: 286, width: 0, height: 270 }, "none", { style: "solid", fill: isDark ? "#FFFFFF40" : C.line, width: 2 }, "compare-divider");
  const mid = Math.ceil(bullets.length / 2);
  addBullets(slide, bullets.slice(0, mid), { left: 92, top: 370, width: 480, height: 190 }, isDark, 22);
  addBullets(slide, bullets.slice(mid), { left: 708, top: 370, width: 480, height: 190 }, isDark, 22);
}

function addLayers(slide, labels, isDark = true) {
  const width = 900;
  const left = 190;
  const h = 60;
  labels.forEach((label, i) => {
    const w = width - i * 105;
    const x = left + i * 52.5;
    const y = 505 - i * 68;
    const shape = addShape(slide, "roundRect", { left: x, top: y, width: w, height: h }, isDark ? `#1565C0${55 + i * 15}` : i % 2 ? "#C9E8FA" : C.white, { style: "solid", fill: isDark ? C.cyan : C.blue, width: 1 }, `layer-${i + 1}`);
    shape.text = label;
    shape.text.style = { fontFamily: "Arial", fontSize: 20, bold: true, color: isDark ? C.white : C.ink, alignment: "center", verticalAlignment: "middle" };
  });
}

function addStatus(slide, labels, isDark = true) {
  const fills = [C.green, C.amber, C.red, C.blue];
  const boxW = Math.min(320, (1080 - (labels.length - 1) * 30) / labels.length);
  labels.forEach((label, i) => {
    const left = 90 + i * (boxW + 30);
    addShape(slide, "ellipse", { left: left + boxW / 2 - 24, top: 326, width: 48, height: 48 }, fills[i % fills.length], { style: "solid", fill: C.white, width: 2 }, `status-dot-${i + 1}`);
    addText(slide, label, { left, top: 400, width: boxW, height: 90 }, { fontSize: 21, bold: true, color: isDark ? C.white : C.ink, alignment: "center" }, `status-label-${i + 1}`);
  });
}

function addSteps(slide, labels, isDark = true) {
  labels.forEach((label, i) => {
    const left = 94 + i * 280;
    addText(slide, String(i + 1).padStart(2, "0"), { left, top: 300, width: 92, height: 78 }, { fontSize: 46, bold: true, color: isDark ? C.cyan : C.blue }, `step-num-${i + 1}`);
    addText(slide, label, { left, top: 392, width: 230, height: 90 }, { fontSize: 21, bold: true, color: isDark ? C.white : C.ink }, `step-label-${i + 1}`);
    if (i < labels.length - 1) addShape(slide, "line", { left: left + 186, top: 345, width: 74, height: 0 }, "none", { style: "solid", fill: isDark ? C.cyan : C.blue, width: 3 }, `step-line-${i + 1}`);
  });
}

function addMetric(slide, labels, isDark = true) {
  const primary = labels[labels.length - 1] ?? "Resultado";
  addText(slide, primary, { left: 730, top: 300, width: 420, height: 120 }, { fontSize: 48, bold: true, color: isDark ? C.cyan : C.blue, alignment: "center" }, "metric-primary");
  addText(slide, labels.slice(0, -1).join("  ×  "), { left: 100, top: 330, width: 550, height: 80 }, { fontSize: 30, bold: true, color: isDark ? C.white : C.ink, alignment: "center" }, "metric-inputs");
  addShape(slide, "rightArrow", { left: 610, top: 324, width: 110, height: 70 }, isDark ? C.cyan : C.blue, { style: "solid", fill: "none", width: 0 }, "metric-arrow");
}

function addVisual(slide, section, isDark) {
  if (section.image) {
    addText(slide, section.claim, { left: 72, top: 250, width: 410, height: 160 }, { fontSize: 26, bold: true, color: isDark ? C.white : C.ink }, "visual-claim");
    addImagePanel(slide, section.image, section.imageBytes, section.imageAlt, section.caption, isDark);
    return;
  }
  const labels = section.labels ?? section.bullets;
  if (section.visual === "compare") addCompare(slide, labels, section.bullets, isDark);
  else if (section.visual === "layers") addLayers(slide, labels, isDark);
  else if (section.visual === "status") addStatus(slide, labels, isDark);
  else if (section.visual === "steps") addSteps(slide, labels, isDark);
  else if (section.visual === "metric") addMetric(slide, labels, isDark);
  else addFlow(slide, labels, 360, isDark);
}

function addCover(p, layouts, deck, sources) {
  const slide = p.slides.add();
  slide.setLayout(layouts.dark);
  dark(slide);
  if (deck.illustrationBytes) {
    slide.images.add({ blob: deck.illustrationBytes, contentType: "image/jpeg", alt: deck.illustrationAlt, fit: "cover", position: { left: 500, top: 0, width: 780, height: 720 } });
    addShape(slide, "rect", { left: 0, top: 0, width: 665, height: 720 }, C.navy, { style: "solid", fill: C.navy, width: 0 }, "cover-text-surface");
    addShape(slide, "line", { left: 664, top: 78, width: 0, height: 564 }, "none", { style: "solid", fill: C.cyan, width: 3 }, "cover-divider");
  } else {
    addGlow(slide, 960, 92, 250);
  }
  addText(slide, deck.episode, { left: 72, top: 86, width: 300, height: 38 }, { fontSize: 18, bold: true, color: C.cyan }, "cover-episode");
  addBrandLogo(slide);
  addText(slide, deck.title, { left: 72, top: 160, width: deck.illustrationBytes ? 520 : 760, height: 210 }, { fontSize: deck.illustrationBytes ? 43 : 50, bold: true, color: C.white }, "cover-title");
  addText(slide, deck.subtitle, { left: 72, top: 400, width: deck.illustrationBytes ? 510 : 720, height: 90 }, { fontSize: 24, color: C.pale }, "cover-subtitle");
  addShape(slide, "line", { left: 72, top: 530, width: 240, height: 0 }, "none", { style: "solid", fill: C.cyan, width: 4 }, "cover-accent");
  addText(slide, `Checkpoint ${deck.checkpoint} • DuckDB local • sem cloud`, { left: 72, top: 555, width: deck.illustrationBytes ? 510 : 600, height: 36 }, { fontSize: 16, bold: true, color: "#FFFFFFAA" }, "cover-meta");
  setNotes(slide, `Apresente o objetivo do ${deck.episode} e conecte-o ao checkpoint executável. ${deck.hook}`, sources);
}

async function addPresenter(p, layouts, deck, sources) {
  const markdown = await fs.readFile(path.join(ROOT, deck.script), "utf8");
  const bio = markdown.split(" — Quem apresenta\n\n")[1]?.split(/^### /m)[0].trim();
  if (!bio) throw new Error(`${deck.script}: roteiro do instrutor ausente.`);
  const { name, channel, experience } = deck.presenter;
  const slide = p.slides.add();
  slide.setLayout(layouts.dark);
  dark(slide);
  addChrome(slide, deck, p.slides.items.length, deck.slides, true);
  addText(slide, "Quem apresenta", { left: 72, top: 110, width: 420, height: 44 },
    { fontSize: 24, bold: true, color: C.cyan }, "presenter-label");
  addText(slide, name, { left: 72, top: 174, width: 1128, height: 101 },
    { fontSize: 62, bold: true, color: C.white }, "presenter-name");
  addText(slide, channel, { left: 76, top: 273, width: 980, height: 55 },
    { fontSize: 28, color: C.pale }, "presenter-channel");
  addShape(slide, "rect", { left: 78, top: 375, width: 4, height: 179 }, C.cyan);
  experience.forEach((item, index) => {
    addText(slide, item, { left: 105, top: 375 + 63 * index, width: 1050, height: 53 },
      { fontSize: 29, color: C.white }, `presenter-experience-${index + 1}`);
  });
  setNotes(slide, bio, [...deck.presenter.sources, ...sources]);
}

function addHook(p, layouts, deck, sources) {
  const slide = p.slides.add();
  slide.setLayout(layouts.light);
  light(slide);
  if (deck.diagramAspect > 2.4) {
    addText(slide, deck.hook, { left: 72, top: 92, width: 1080, height: 150 }, { fontSize: 38, bold: true, color: C.ink }, "hook");
    addShape(slide, "line", { left: 72, top: 270, width: 220, height: 0 }, "none", { style: "solid", fill: C.blue, width: 4 }, "hook-rule");
    addText(slide, "A pergunta que guia a aula", { left: 72, top: 292, width: 420, height: 42 }, { fontSize: 19, bold: true, color: C.blue }, "hook-label");
    addShape(slide, "roundRect", { left: 72, top: 370, width: 1136, height: 220 }, C.white, { style: "solid", fill: C.line, width: 1 }, "diagram-surface");
    slide.images.add({ blob: deck.diagramBytes, contentType: imageContentType(deck.diagram), alt: `Diagrama conceitual do ${deck.episode}`, fit: "contain", position: { left: 104, top: 398, width: 1072, height: 164 } });
  } else {
    addText(slide, deck.hook, { left: 72, top: 100, width: 560, height: 230 }, { fontSize: 38, bold: true, color: C.ink }, "hook");
    addShape(slide, "line", { left: 72, top: 360, width: 220, height: 0 }, "none", { style: "solid", fill: C.blue, width: 4 }, "hook-rule");
    addText(slide, "A pergunta que guia a aula", { left: 72, top: 382, width: 420, height: 42 }, { fontSize: 19, bold: true, color: C.blue }, "hook-label");
    addShape(slide, "roundRect", { left: 690, top: 100, width: 500, height: 490 }, C.white, { style: "solid", fill: C.line, width: 1 }, "diagram-surface");
    slide.images.add({ blob: deck.diagramBytes, contentType: imageContentType(deck.diagram), alt: `Diagrama conceitual do ${deck.episode}`, fit: "contain", position: { left: 720, top: 132, width: 440, height: 410 } });
  }
  addChrome(slide, deck, p.slides.items.length, deck.slides, false);
  setNotes(slide, `${deck.hook} Use o diagrama para antecipar o problema que será comprovado no laboratório.`, sources);
}

const aulaZeroAgenda = [
  ["00:20", "Quem apresenta"],
  ["01:00", "A pergunta da temporada e os dados"],
  ["03:30", "Criação do Codespace e franquia"],
  ["09:00", "Setup e diagnóstico do ambiente"],
  ["13:30", "Checkpoint 01 e explorador de dados"],
  ["17:00", "Bônus com a DuckDB UI oficial"],
  ["19:00", "Recuperação do setup e pedido de suporte"],
  ["21:00", "Encerramento do Codespace e instalação local"],
];

async function loadAgenda(deck) {
  if (deck.episode === "AULA 0") return aulaZeroAgenda;
  const markdown = await fs.readFile(path.join(ROOT, deck.script), "utf8");
  const spoken = markdown.split(/^## Roteiro falado\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  const agenda = [...spoken.matchAll(/^### (\d\d:\d\d)[–-]\d\d:\d\d — (.+)$/gm)]
    .map(([, time, title]) => [time, title.replaceAll("`", "")]);
  if (agenda.length < 1 || agenda.length > 9) {
    throw new Error(`${deck.script}: quantidade inválida de etapas do roteiro (${agenda.length}).`);
  }
  return agenda;
}

function addAgenda(p, layouts, deck, sources, agenda) {
  const slide = p.slides.add();
  slide.setLayout(layouts.dark);
  dark(slide);
  addTitle(slide, "Roteiro da aula", true, "Tempos aproximados para acompanhar a gravação");
  const rowHeight = agenda.length > 7 ? 42 : 50;
  for (const [index, [time, title]] of agenda.entries()) {
    const top = 269 + index * rowHeight;
    addText(slide, time, { left: 78, top, width: 140, height: 37 }, { fontSize: 24, bold: true, color: C.cyan }, `agenda-time-${index + 1}`);
    addText(slide, title, { left: 228, top, width: 945, height: 37 }, { fontSize: 24, color: C.white }, `agenda-topic-${index + 1}`);
  }
  addChrome(slide, deck, p.slides.items.length, deck.slides, true);
  setNotes(slide, `Objetivos da aula: ${deck.objective.join(", ")}.`, sources);
}

function addDataIntro(p, layouts, deck, sources, startIndex) {
  const dataSources = [...sources, "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce",
    "repo://lab/dabdbt/src/seeds", "repo://docs/praticas-duckdb.md"];
  let slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "Da origem ao indicador de receita", false,
    "Um pedido pode ter vários itens e pagamentos. A resposta depende de juntar os dados no nível certo.");
  const stages = [
    ["Fontes e Silver", "Reconhecer cada linha e padronizar chaves, status e datas."],
    ["Gold e métricas", "Somar pagamentos por pedido e aplicar a regra de entrega."],
    ["Dashboard e agente", "Usar a mesma definição publicada, com testes, contrato e linhagem."],
  ];
  stages.forEach(([label, detail], i) => {
    const top = 283 + i * 95;
    addText(slide, label, { left: 76, top, width: 335, height: 44 }, { fontSize: 28, bold: true, color: C.blue }, `stage-label-${i}`);
    addText(slide, detail, { left: 416, top, width: 790, height: 66 }, { fontSize: 25, color: C.ink }, `stage-detail-${i}`);
  });
  addChrome(slide, deck, startIndex, deck.slides, false);
  setNotes(slide, "Pergunte quanto dos pagamentos corresponde a pedidos entregues. Mostre por que precisamos saber o nível de detalhe de cada fonte. Volte à pergunta no episódio final, ao comparar as duas séries no gráfico.", dataSources);

  slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "As fontes do laboratório", false,
    "CSVs versionados no repositório. A amostra de comércio é didática e inspirada no esquema da Olist.");
  const rows = [
    ["b.orders", "Pedido", "order_id, status e datas de compra e entrega"],
    ["b.order_items", "Item do pedido", "order_id, order_item_id, preço e frete"],
    ["b.order_payments", "Pagamento do pedido", "order_id, sequência, parcelas e valor"],
    ["b.customers", "Cadastro de cliente", "customer_id, cidade e UF"],
    ["b.ibge_municipios", "Município", "código, nome, UF e coordenadas"],
  ];
  addText(slide, "TABELA", { left: 76, top: 267, width: 260, height: 32 }, { fontSize: 17, bold: true, color: C.blue }, "sources-table-label");
  addText(slide, "UMA LINHA POR", { left: 345, top: 267, width: 260, height: 32 }, { fontSize: 17, bold: true, color: C.blue }, "sources-grain-label");
  addText(slide, "COLUNAS EM DESTAQUE", { left: 610, top: 267, width: 590, height: 32 }, { fontSize: 17, bold: true, color: C.blue }, "sources-columns-label");
  rows.forEach(([resource, grain, columns], i) => {
    const top = 317 + i * 61;
    addText(slide, resource, { left: 76, top, width: 260, height: 37 }, { fontFamily: "Courier New", fontSize: 22, bold: true }, `source-table-${i}`);
    addText(slide, grain, { left: 345, top, width: 260, height: 39 }, { fontSize: 22 }, `source-grain-${i}`);
    addText(slide, columns, { left: 610, top, width: 598, height: 41 }, { fontSize: 22 }, `source-columns-${i}`);
  });
  addChrome(slide, deck, startIndex + 1, deck.slides, false);
  setNotes(slide, "Abra lab/dabdbt/src/seeds para mostrar os CSVs. Identificadores e status são texto. Datas e valores são usados nos cálculos. Pedido, item e pagamento têm grãos diferentes. A referência municipal apoia as análises geográficas.", dataSources);
  return startIndex + 2;
}

function addCommandGroups(slide, groups, { top, labelColor, codeColor, help, helpColor }) {
  let y = top;
  for (const [index, [label, command]] of groups.entries()) {
    const codeHeight = 32 * command.split("\n").length + 8;
    addText(slide, label, { left: 80, top: y, width: 1120, height: 28 }, { fontSize: 20, bold: true, color: labelColor }, `command-context-${index + 1}`);
    addText(slide, command, { left: 80, top: y + 27, width: 1120, height: codeHeight }, { fontFamily: "Courier New", fontSize: 25, bold: true, color: codeColor }, index ? `command-${index + 1}` : "command");
    y += 27 + codeHeight + 14;
  }
  addText(slide, help, { left: 80, top: y + 5, width: 1120, height: 34 }, { fontSize: 19, color: helpColor }, "command-help");
}

function addSectionConcept(p, layouts, deck, section, index, total, sources, isDark) {
  const slide = p.slides.add();
  slide.setLayout(isDark ? layouts.dark : layouts.light);
  isDark ? dark(slide) : light(slide);
  addTitle(slide, section.title, isDark, section.claim);
  if (section.commands) {
    addCommandGroups(slide, section.commands, { top: 266, labelColor: C.ink, codeColor: C.blue, helpColor: C.muted, help: "Abra http://localhost:4213 no seu navegador. Deixe os dois terminais abertos." });
  } else {
    addBullets(slide, section.bullets, { left: 72, top: 300, width: 620, height: 230 }, isDark, 24);
    addGlow(slide, 900, 270, 230);
    addText(slide, String(index + 1).padStart(2, "0"), { left: 1020, top: 330, width: 150, height: 100 }, { fontSize: 62, bold: true, color: isDark ? C.cyan : C.blue, alignment: "center" }, "section-number");
  }
  addChrome(slide, deck, total, deck.slides, isDark);
  setNotes(slide, `${section.claim} Desenvolva os pontos: ${section.bullets.join("; ")}.`, sources);
}

function addSectionVisual(p, layouts, deck, section, total, sources, isDark) {
  const slide = p.slides.add();
  slide.setLayout(isDark ? layouts.dark : layouts.light);
  isDark ? dark(slide) : light(slide);
  addTitle(slide, section.title, isDark);
  addVisual(slide, section, isDark);
  addChrome(slide, deck, total, deck.slides, isDark);
  const imageSources = section.image ? [section.imageSource ?? `https://github.com/dbt-labs/docs.getdbt.com/blob/${DOCS_COMMIT}/website/static/img/`] : [];
  setNotes(slide, `Use a composição para explicar visualmente: ${section.claim} ${section.bullets.join(" ")}`, sources.concat(imageSources));
}

function addDemoSlides(p, layouts, deck, sources, startIndex, practice) {
  let index = startIndex;
  let slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  const isSetup = deck.episode === "AULA 0";
  const prior = deck.checkpoint === "01"
    ? "Pré-requisito: ambiente preparado na Aula 0."
    : "Antes da prática, prepare o ambiente e conclua o checkpoint 01.";
  const groups = deck.demo.groups ?? [["Comando do checkpoint", deck.demo.command]];
  addTitle(slide, "Comandos da prática", true, "Use o terminal na raiz do repositório");
  addCommandGroups(slide, groups, {
    top: isSetup ? 235 : 308, labelColor: C.white, codeColor: C.cyan, helpColor: C.pale,
    help: isSetup ? "Use Ctrl+C para encerrar o explorador de dados." : prior,
  });
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `No terminal da raiz, execute os blocos aplicáveis: ${groups.map(([, command]) => command.replace(/\n/g, ", depois ")).join(" | ")}.`, sources);
  return addPracticeSlides(p, layouts, deck, sources, index, practice);
}

function addPracticeSlides(p, layouts, deck, sources, index, practice) {
  const isInsight = practice.number === "12-insight";
  let slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, isInsight ? "SQL do gráfico final" : "SQL da prática", false, isInsight
    ? "No menu Consulta da aula, selecione 12-insight. Execute a consulta para ver a tabela e o gráfico."
    : "No Explorador, selecione a aula ou cole o SQL. Clique em Executar consulta.");
  addText(slide, practice.sql, { left: 77, top: 240, width: 1125, height: 256 }, { fontFamily: "Courier New", fontSize: 23, color: C.ink }, "practice-sql");
  addText(slide, "Explorador após o checkpoint", { left: 77, top: 517, width: 500, height: 30 }, { fontSize: 20, bold: true }, "practice-ui-label");
  addText(slide, "Mesma consulta pelo terminal", { left: 610, top: 517, width: 560, height: 30 }, { fontSize: 20, bold: true }, "practice-cli-label");
  addText(slide, "python course.py data-ui", { left: 77, top: 555, width: 520, height: 36 }, { fontFamily: "Courier New", fontSize: 23, color: C.blue }, "practice-ui");
  addText(slide, `python course.py sql ${practice.number}`, { left: 610, top: 555, width: 530, height: 36 }, { fontFamily: "Courier New", fontSize: 23, color: C.blue }, "practice-cli");
  addText(slide, "Abra a porta privada 4213 no Codespaces ou localhost:4213 no seu computador.", { left: 77, top: 607, width: 1125, height: 36 }, { fontSize: 19, color: C.muted }, "practice-port");
  addChrome(slide, deck, index++, deck.slides, false);
  const practiceSources = [...sources, `repo://lab/praticas/${practice.number}.sql`,
    "https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/praticas-duckdb.md"];
  setNotes(slide, `Depois de ${deck.demo.result}, execute o SQL no Explorador DuckDB. ${practice.highlight}`, practiceSources);

  slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  addTitle(slide, practice.topic, true);
  addText(slide, practice.evidence, { left: 76, top: 265, width: 315, height: 220 }, { fontSize: 29, bold: true, color: C.white }, "practice-evidence");
  slide.images.add({
    blob: practice.imageBytes, contentType: "image/jpeg", alt: `Resultado no Explorador DuckDB. ${practice.evidence}`, fit: "contain",
    position: { left: 396, top: 157, width: 812, height: 455 },
  });
  addText(slide, "Captura real do Explorador DuckDB do curso", { left: 396, top: 621, width: 812, height: 32 }, { fontSize: 17, color: C.pale, alignment: "center" }, "image-caption");
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `${practice.evidence} ${practice.highlight}`, [...practiceSources, `repo://assets/screenshots/duckdb/${practice.number}.jpg`]);
  return index;
}

async function addDocsSlides(p, layouts, deck, sources, startIndex) {
  const docsSources = [...sources, "https://docs.getdbt.com/reference/commands/cmd-docs",
    "https://docs.getdbt.com/docs/build/documentation", "repo://lab/dabdbt/src/docs/overview.md"];
  let slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "A ficha de um modelo no dbt Docs", false);
  addText(slide, "Depois do checkpoint 01, abra a documentação local.", { left: 76, top: 225, width: 397, height: 82 }, { fontSize: 25, bold: true }, "docs-instructions");
  addText(slide, "python course.py docs", { left: 76, top: 324, width: 400, height: 44 }, { fontFamily: "Courier New", fontSize: 24, color: C.blue }, "docs-command");
  addText(slide, "Abra a porta privada 8080 no Codespaces ou localhost:8080 no computador.", { left: 76, top: 384, width: 397, height: 135 }, { fontSize: 24, color: C.ink }, "docs-port");
  slide.images.add({ blob: await fs.readFile(docsCapture("01-colunas.jpg")), contentType: "image/jpeg", alt: "Ficha real do dbt Docs com tipo VARCHAR, constraint not_null e testes Not Null e Unique em order_id.", fit: "contain", position: { left: 483, top: 176, width: 720, height: 437 } });
  addText(slide, "order_metrics_v2 · coluna order_id", { left: 483, top: 622, width: 720, height: 30 }, { fontSize: 17, color: C.muted, alignment: "center" }, "image-caption");
  addChrome(slide, deck, startIndex, deck.slides, false);
  setNotes(slide, "No menu Database ou Project, abra order_metrics_v2. Em Columns, expanda order_id. Mostre tipo, descrição, constraint e os testes associados. Em Code, compare o SQL do modelo com o SQL compilado quando disponível.", [...docsSources, "repo://assets/screenshots/dbt-docs/01-colunas.jpg"]);

  slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "A linhagem do pedido à entrega", false);
  addText(slide, "Abra View Lineage Graph. Use o filtro do grafo para ver pais e dependentes.", { left: 76, top: 176, width: 1070, height: 40 }, { fontSize: 24 }, "lineage-instructions");
  addText(slide, "+order_metrics+", { left: 76, top: 222, width: 760, height: 46 }, { fontFamily: "Courier New", fontSize: 25, color: C.blue }, "lineage-selector");
  slide.images.add({ blob: await fs.readFile(docsCapture("01-linhagem.jpg")), contentType: "image/jpeg", alt: "Grafo real ligando as fontes de itens, pagamentos e pedidos à Silver, às versões de order_metrics, à interface commerce_orders, às métricas e ao exposure do agente.", fit: "contain", position: { left: 72, top: 288, width: 1136, height: 225 } });
  addText(slide, "Fontes, Silver, versões de pedidos, interface de consumo, métricas e exposure do agente.", { left: 76, top: 546, width: 1120, height: 74 }, { fontSize: 25, bold: true }, "lineage-evidence");
  addChrome(slide, deck, startIndex + 1, deck.slides, false);
  setNotes(slide, "Da esquerda para a direita, siga itens, pagamentos e pedidos pelas relações Silver. Chegue a order_metrics_v2, que alimenta commerce_orders. As métricas e o exposure mostram consumidores declarados. A seta documenta uma dependência do projeto. Para entender chaves e agregações, abra o SQL dos modelos.", [...docsSources, "repo://assets/screenshots/dbt-docs/01-linhagem.jpg"]);
  return startIndex + 2;
}

function addClosingSlides(p, layouts, deck, sources, startIndex) {
  let index = startIndex;
  let slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "O mesmo recurso afeta três decisões", false);
  addSteps(slide, deck.impact, false);
  addChrome(slide, deck, index++, deck.slides, false);
  setNotes(slide, `Conecte a técnica aos efeitos: ${deck.impact.join("; ")}. Não prometa economia sem medição.`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  addText(slide, deck.case.number, { left: 72, top: 170, width: 560, height: 150 }, { fontSize: 74, bold: true, color: C.cyan }, "case-number");
  addText(slide, deck.case.label, { left: 72, top: 330, width: 660, height: 90 }, { fontSize: 30, bold: true, color: C.white }, "case-label");
  addShape(slide, "line", { left: 760, top: 160, width: 0, height: 330 }, "none", { style: "solid", fill: "#FFFFFF45", width: 2 }, "case-divider");
  addText(slide, deck.case.caveat, { left: 820, top: 230, width: 350, height: 180 }, { fontSize: 24, color: C.pale }, "case-caveat");
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `${deck.case.number}: ${deck.case.label}. ${deck.case.caveat}`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "Limitações que precisam permanecer visíveis", false);
  addBullets(slide, deck.limitations, { left: 110, top: 280, width: 1040, height: 250 }, false, 26);
  addChrome(slide, deck, index++, deck.slides, false);
  setNotes(slide, `Apresente os limites sem minimizá-los: ${deck.limitations.join("; ")}.`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  addText(slide, "RADAR", { left: 72, top: 132, width: 260, height: 50 }, { fontSize: 20, bold: true, color: C.cyan }, "radar-label");
  addText(slide, deck.radar, { left: 72, top: 220, width: 980, height: 190 }, { fontSize: 38, bold: true, color: C.white }, "radar-text");
  addText(slide, "Novidade observada ≠ recomendação de produção", { left: 72, top: 470, width: 760, height: 48 }, { fontSize: 20, color: C.pale }, "radar-rule");
  addGlow(slide, 980, 290, 190);
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `${deck.radar} Reforce que beta e preview não fazem parte da aceitação.`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addText(slide, "PRÓXIMO PASSO", { left: 72, top: 140, width: 400, height: 44 }, { fontSize: 18, bold: true, color: C.blue }, "cta-label");
  addText(slide, deck.cta, { left: 72, top: 220, width: 1020, height: deck.ctaCommand ? 145 : 190 }, { fontSize: 44, bold: true, color: C.ink }, "cta");
  if (deck.ctaCommand) {
    addCommandGroups(slide, [["Atalho no Codespaces, na raiz do repositório", deck.ctaCommand]], {
      top: 395, labelColor: C.ink, codeColor: C.blue, helpColor: C.muted,
      help: "Você também pode abrir o caminho acima pelo explorador de arquivos.",
    });
  } else {
    addText(slide, `Checkpoint ${deck.checkpoint} • roteiro completo no repositório`, { left: 72, top: 500, width: 800, height: 42 }, { fontSize: 20, color: C.muted }, "cta-meta");
  }
  addChrome(slide, deck, index++, deck.slides, false);
  setNotes(slide, `${deck.cta} Encerre conectando a aula ao próximo checkpoint.`, sources);
  return index;
}

async function loadPractice(number) {
  return {
    ...LESSONS[number],
    number,
    sql: (await fs.readFile(path.join(PRACTICES, `${number}.sql`), "utf8")).trim(),
    imageBytes: new Uint8Array(await fs.readFile(practiceCapture(`${number}.jpg`))),
  };
}

async function buildDeck(deck) {
  const number = deck.stem.split("-")[1];
  const practice = await loadPractice(number);
  deck.diagramBytes = new Uint8Array(await fs.readFile(deck.diagram));
  try {
    deck.illustrationBytes = new Uint8Array(await fs.readFile(deck.illustration));
    deck.illustrationAlt = `Ilustração conceitual autoral, sem texto, para ${deck.episode}`;
  } catch {
    deck.illustrationBytes = null;
  }
  if (imageContentType(deck.diagram) === "image/png") {
    const view = new DataView(deck.diagramBytes.buffer, deck.diagramBytes.byteOffset, deck.diagramBytes.byteLength);
    deck.diagramAspect = view.getUint32(16) / view.getUint32(20);
  } else {
    deck.diagramAspect = 1.6;
  }
  for (const section of deck.sections) {
    if (section.image) section.imageBytes = new Uint8Array(await fs.readFile(section.image));
  }
  const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const master = p.masters.add("Rescue Point Master");
  const darkLayout = p.layouts.add("Rescue Point Dark");
  const lightLayout = p.layouts.add("Rescue Point Light");
  darkLayout.setParentLayoutId(master.id);
  lightLayout.setParentLayoutId(master.id);
  const layouts = { dark: darkLayout, light: lightLayout };
  const sources = [
    ...deck.sources,
    "https://rescuepoint.com.br/assets/img/logo.png",
    `https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/${deck.script}`,
    `repo://laboratorio/checkpoints/ep${deck.checkpoint}`,
    "repo://assets/catalog.yml",
    "repo://assets/decks/provenance.yml",
  ];

  addCover(p, layouts, deck, sources);
  if (deck.presenter) await addPresenter(p, layouts, deck, sources);
  addHook(p, layouts, deck, sources);
  addAgenda(p, layouts, deck, sources, await loadAgenda(deck));

  let current = p.slides.items.length + 1;
  if (number === "00") current = addDataIntro(p, layouts, deck, sources, current);
  const allPaired = (deck.slides - Number(Boolean(deck.presenter))) % 2 === 1;
  for (let i = 0; i < deck.sections.length; i++) {
    const section = deck.sections[i];
    const isDark = (i % 2) === 0;
    addSectionConcept(p, layouts, deck, section, i, current++, sources, isDark);
    if (allPaired || i > 0) addSectionVisual(p, layouts, deck, section, current++, sources, !isDark);
  }
  current = addDemoSlides(p, layouts, deck, sources, current, practice);
  if (number === "01") current = await addDocsSlides(p, layouts, deck, sources, current);
  if (number === "12") current = addPracticeSlides(p, layouts, deck, sources, current, await loadPractice("12-insight"));
  current = addClosingSlides(p, layouts, deck, sources, current);

  if (p.slides.items.length !== deck.slides) {
    throw new Error(`${deck.stem}: esperado ${deck.slides} slides, criado ${p.slides.items.length}`);
  }

  return exportDeck(p, deck.stem);
}

async function exportDeck(p, deckStem) {
  const qaDir = path.join(BUILD, deckStem);
  await fs.mkdir(qaDir, { recursive: true });
  for (const [i, slide] of p.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    const png = await p.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(qaDir, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(qaDir, `${stem}.layout.json`), await layout.text());
  }
  const montage = await p.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(qaDir, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));
  const inspect = await p.inspect({ kind: "slide,textbox,shape,image,notes,layout", maxChars: 1000000 });
  await fs.writeFile(path.join(OUT, `${deckStem}.pptx.inspect.ndjson`), inspect.ndjson);
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(path.join(OUT, `${deckStem}.pptx`));
  return { stem: deckStem, slides: p.slides.items.length };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(BUILD, { recursive: true });
  brandLogoBytes = new Uint8Array(await fs.readFile(brandLogo));
  const requested = process.argv.slice(2);
  const selected = requested.length ? decks.filter((d) => requested.includes(d.stem)) : decks;
  const includeBonus = !requested.length || requested.includes(bonusStem);
  if (!selected.length && !includeBonus) throw new Error("Nenhum deck selecionado.");
  for (const deck of selected) {
    const result = await buildDeck(deck);
    console.log(`${result.stem}: ${result.slides} slides`);
  }
  if (includeBonus) {
    const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
    await addBonusSlides({ root: ROOT, presentation, addText, addShape, addChrome, setNotes, colors: C });
    const result = await exportDeck(presentation, bonusStem);
    console.log(`${result.stem}: ${result.slides} slides`);
  }
  await execFileAsync(process.env.PYTHON || "python3", [path.join(ROOT, "scripts/decks/add_pptx_alt_text.py")], {
    env: { ...process.env, PPTX_DIR: OUT },
  });
  console.log("Textos alternativos gravados nos PPTX canônicos.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
