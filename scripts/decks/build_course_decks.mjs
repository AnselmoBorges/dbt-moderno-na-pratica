import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const execFileAsync = promisify(execFile);

const ROOT = process.env.COURSE_ROOT
  ? path.resolve(process.env.COURSE_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "assets/decks");
const BUILD = path.join(ROOT, "build/decks");

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

const diagrams = (name) => path.join(ROOT, "assets/diagrams/rendered", name);
const official = (name) => path.join(ROOT, "assets/official/dbt", name);
const banana = (name) => path.join(ROOT, "assets/illustrations/banana", name);
const screenshot = (name) => path.join(ROOT, "assets/screenshots/codespaces", name);
const imageContentType = (filePath) => path.extname(filePath).toLowerCase().match(/\.jpe?g$/) ? "image/jpeg" : "image/png";

const decks = [
  {
    stem: "aula-00-ambiente",
    episode: "AULA 0",
    title: "Prepare seu laboratório dbt no Codespaces",
    subtitle: "Rota recomendada no navegador; instalação local continua disponível",
    slides: 22,
    checkpoint: "01",
    script: "roteiros/aula-00-ambiente.md",
    diagram: diagrams("episode-01-lifecycle.png"),
    hook: "Um ambiente padronizado reduz o suporte e deixa a aula começar pelo dbt — não pela instalação.",
    objective: ["Criar um Codespace 2-core", "Validar o setup automático", "Fechar o checkpoint 01"],
    sections: [
      { title: "SQL básico basta para começar", claim: "Terminal, Git, Python e dbt entram passo a passo.", bullets: ["SELECT, JOIN, GROUP BY, SUM e COUNT", "Nenhuma experiência prévia com dbt", "Comandos completos em todas as aulas"], visual: "steps", labels: ["SQL", "Terminal", "Python", "dbt"] },
      { title: "Codespaces é a rota recomendada", claim: "Code → Codespaces → Create codespace on main abre o laboratório no navegador.", bullets: ["Conta pessoal GitHub", "Sem instalar Python ou Git", "Mesmo ambiente para todos"], image: screenshot("01-code-codespaces.png"), imageWide: true, imageAlt: "Menu Code com a guia Codespaces e o botão Create codespace on main", caption: "Captura sanitizada do GitHub.com — 2026-09-01", imageSource: "https://github.com/AnselmoBorges/dbt-moderno-na-pratica" },
      { title: "2-core preserva a franquia gratuita", claim: "GitHub Free inclui 120 core-hours e 15 GB-mês; em 2-core, são cerca de 60 horas ativas.", bullets: ["Branch main", "Dev container do curso", "Máquina 2-core", "Pare o ambiente ao terminar"], image: screenshot("02-configuracao-2-core.png"), imageWide: true, imageAlt: "Configuração de Codespaces com branch main, dev container do curso e máquina 2-core", caption: "Captura sanitizada do GitHub.com — 2026-09-01", imageSource: "https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1354054687" },
      { title: "O repositório prepara o ambiente", claim: "O dev container executa setup na criação e doctor a cada abertura.", bullets: ["Python 3.12 fixado", "dbt + DuckDB instalados", "Nenhuma ativação manual", "Checkpoint reproduzível"], visual: "flow", labels: ["Create", "setup", "doctor", "checkpoint"] },
      { title: "Parar evita consumo de processamento", claim: "Stop codespace interrompe core-hours; armazenamento continua até excluir o ambiente.", bullets: ["Pare ao terminar cada aula", "Reabra o mesmo ambiente", "Exclua quando não precisar dos arquivos"], image: screenshot("03-parar-codespace.png"), imageWide: true, imageAlt: "Menu oficial de gerenciamento do Codespaces com a opção Stop codespace", caption: "GitHub Docs — CC BY 4.0 — commit 484d28e", imageSource: "https://github.com/github/docs/blob/484d28e95db7c592c368da359ff1a9fecb08a08a/assets/images/help/codespaces/stop-codespace-webui.png" },
      { title: "Local continua sendo a rota alternativa", claim: "O launcher mantém o mesmo resultado quando Codespaces ou internet não estão disponíveis.", bullets: ["Windows, macOS e Linux documentados", "doctor encontra bloqueios", "support-report sanitiza a ajuda"], visual: "status", labels: ["Codespaces: recomendado", "Local: alternativa", "Suporte: diagnóstico"] },
    ],
    demo: { command: "python course.py doctor\npython course.py checkpoint 01", observe: ["Python 3.12 e Git OK", "dbt build concluído", "Seeds e artifacts executados"], result: "Checkpoint 01 OK" },
    impact: ["Governança: ambiente versionado", "FinOps: 2-core + stop", "IA: nenhuma chave necessária"],
    case: { number: "46 recursos", label: "baseline dbt validado localmente", caveat: "Resultado do laboratório, não benchmark de produção." },
    limitations: ["Codespaces exige internet e conta pessoal GitHub", "Franquias e cobrança podem mudar", "Ambiente parado ainda consome armazenamento", "Instalação local permanece disponível"],
    radar: "Core 2.0 e Fusion ficam apenas no Radar; a aula executa Core 1.12 estável.",
    cta: "Abra o Codespace em 2-core, execute doctor e checkpoint 01 e pare ao terminar.",
    sources: ["https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository", "https://docs.github.com/en/billing/concepts/product-billing/github-codespaces", "https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage", "https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace", "https://docs.getdbt.com/guides/manual-install?step=1", "https://github.com/dbt-labs/jaffle_shop_duckdb"],
  },
  {
    stem: "episodio-01-baseline-core-1-12",
    episode: "EPISÓDIO 1",
    title: "O que a série ensinou — e o que falta provar",
    subtitle: "Baseline aberto e suportado com dbt Core 1.12",
    slides: 18,
    checkpoint: "01",
    script: "roteiros/01-playlist-core-1-12.md",
    diagram: diagrams("episode-01-lifecycle.png"),
    hook: "Título de vídeo não é evidência. Manifest, testes e resultados executáveis são.",
    objective: ["Auditar a série original", "Separar implementado de conceitual", "Reconstruir o baseline suportado"],
    sections: [
      { title: "A base original continua valiosa", claim: "Ambiente, seeds, ref, table, view e primeira Gold foram demonstrados.", bullets: ["Fundamentos bem posicionados", "Materializações básicas", "Primeiro fluxo Silver → Gold"], visual: "compare", labels: ["Implementado", "Conceitual"] },
      { title: "Produção começa no suportado", claim: "Core 1.12 e DuckDB estável formam a trilha executável.", bullets: ["Dependências fixadas", "CI determinística", "Preview sem comando obrigatório"], visual: "status", labels: ["OPEN", "STABLE", "LOCAL"] },
      { title: "ref transforma SQL em um grafo", claim: "Dependências explícitas habilitam ordem, seleção e linhagem.", bullets: ["source → staging", "staging → Gold", "Gold → consumidor"], visual: "flow", labels: ["source", "staging", "Gold", "consumer"] },
      { title: "Artifacts respondem perguntas diferentes", claim: "Manifest descreve o projeto; run_results registra a execução.", bullets: ["O que existe", "O que depende do quê", "O que passou ou falhou"], visual: "compare", labels: ["Build", "Artifacts"] },
    ],
    demo: { command: "python course.py checkpoint 01", observe: ["8 pedidos na amostra", "Manifest e catálogo gerados", "Semantic manifest e OSI válidos"], result: "Baseline reproduzido" },
    impact: ["Governança: artifact auditável", "FinOps: versões reproduzíveis", "IA: contexto antes de SQL"],
    case: { number: "8 / 740 / 630", label: "pedidos / receita bruta / entregue", caveat: "Ground truth da amostra Olist do curso." },
    limitations: ["Incremental, testes e deploy não estavam implementados na série original", "Artifacts não substituem monitoramento", "Core 2.0 não entra na aceitação"],
    radar: "Novidade não substitui maturidade: Core 2.0 e Fusion aparecem sem recomendação de produção.",
    cta: "Reproduza o checkpoint e abra manifest.json antes do episódio 2.",
    sources: ["https://docs.getdbt.com/docs/dbt/supported-features", "https://github.com/dbt-labs/dbt-core/releases/tag/v1.12.0", "https://github.com/dbt-labs/jaffle-shop"],
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
    radar: "A sintaxe executada é a spec suportada no Core 1.12; cross-project futuro fica no Radar.",
    cta: "Documente nome, pergunta, grão, filtro, data e owner de três métricas.",
    sources: ["https://docs.getdbt.com/docs/build/latest-metrics-spec", "https://github.com/dbt-labs/metricflow", "https://www.getdbt.com/case-studies/inventa"],
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
    radar: "A matriz de suporte do Core 2.0/Fusion não é assumida igual ao Core 1.12.",
    cta: "Implemente uma métrica simples e uma razão e reconcilie os valores.",
    sources: ["https://github.com/dbt-labs/metricflow", "https://docs.getdbt.com/docs/build/latest-metrics-spec", "https://www.getdbt.com/case-studies/inventa"],
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
    radar: "APIs, cache e integrações hospedadas ficam para a temporada de plataforma.",
    cta: "Prove a mesma métrica via MetricFlow e SQL sem copiar a fórmula.",
    sources: ["https://github.com/open-semantic-interchange/OSI", "https://github.com/dbt-labs/metricflow", "https://www.getdbt.com/blog/how-the-dbt-semantic-layer-works"],
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
    radar: "Melhorias futuras não justificam migrar um contrato estável para runtime beta.",
    cta: "Simule a remoção de uma coluna pública e verifique se a CI bloqueia.",
    sources: ["https://docs.getdbt.com/docs/mesh/govern/model-contracts", "https://docs.getdbt.com/docs/mesh/govern/model-versions", "https://docs.getdbt.com/docs/mesh/govern/about-model-governance"],
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
    radar: "dbt State gerenciado permanece fora; artifacts abertos sustentam a aula.",
    cta: "Salve um manifest e compare a seleção antes e depois de uma mudança.",
    sources: ["https://docs.getdbt.com/reference/node-selection/defer", "https://docs.getdbt.com/reference/node-selection/methods#the-state-method"],
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
    slides: 22,
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

function addChrome(slide, deck, index, total, isDark = true) {
  addText(slide, `${deck.episode}  •  OPEN / CORE 1.12`, { left: 72, top: 28, width: 540, height: 28 }, { fontSize: 14, bold: true, color: isDark ? C.cyan : C.blue }, "eyebrow");
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
  addText(slide, deck.title, { left: 72, top: 160, width: deck.illustrationBytes ? 520 : 760, height: 210 }, { fontSize: deck.illustrationBytes ? 43 : 50, bold: true, color: C.white }, "cover-title");
  addText(slide, deck.subtitle, { left: 72, top: 400, width: deck.illustrationBytes ? 510 : 720, height: 90 }, { fontSize: 24, color: C.pale }, "cover-subtitle");
  addShape(slide, "line", { left: 72, top: 530, width: 240, height: 0 }, "none", { style: "solid", fill: C.cyan, width: 4 }, "cover-accent");
  addText(slide, `Checkpoint ${deck.checkpoint} • DuckDB local • sem cloud`, { left: 72, top: 555, width: deck.illustrationBytes ? 510 : 600, height: 36 }, { fontSize: 16, bold: true, color: "#FFFFFFAA" }, "cover-meta");
  setNotes(slide, `Apresente o objetivo do ${deck.episode} e conecte-o ao checkpoint executável. ${deck.hook}`, sources);
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
  addChrome(slide, deck, 2, deck.slides, false);
  setNotes(slide, `${deck.hook} Use o diagrama para antecipar o problema que será comprovado no laboratório.`, sources);
}

function addObjective(p, layouts, deck, sources) {
  const slide = p.slides.add();
  slide.setLayout(layouts.dark);
  dark(slide);
  addTitle(slide, "Ao final, você consegue...", true);
  addSteps(slide, deck.objective, true);
  addChrome(slide, deck, 3, deck.slides, true);
  setNotes(slide, `Explique os três resultados observáveis da aula: ${deck.objective.join("; ")}.`, sources);
}

function addSectionConcept(p, layouts, deck, section, index, total, sources, isDark) {
  const slide = p.slides.add();
  slide.setLayout(isDark ? layouts.dark : layouts.light);
  isDark ? dark(slide) : light(slide);
  addTitle(slide, section.title, isDark, section.claim);
  addBullets(slide, section.bullets, { left: 72, top: 300, width: 620, height: 230 }, isDark, 24);
  addGlow(slide, 900, 270, 230);
  addText(slide, String(index + 1).padStart(2, "0"), { left: 1020, top: 330, width: 150, height: 100 }, { fontSize: 62, bold: true, color: isDark ? C.cyan : C.blue, alignment: "center" }, "section-number");
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

function addDemoSlides(p, layouts, deck, sources, startIndex) {
  let index = startIndex;
  let slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  addTitle(slide, "Demonstração — execute", true);
  addShape(slide, "roundRect", { left: 130, top: 270, width: 1020, height: 190 }, "#031021", { style: "solid", fill: C.cyan, width: 2 }, "code-surface");
  addText(slide, deck.demo.command, { left: 175, top: 315, width: 930, height: 110 }, { fontFamily: "Courier New", fontSize: 25, bold: true, color: C.cyan }, "command");
  addText(slide, "Copie exatamente como aparece. O launcher escolhe o ambiente correto.", { left: 175, top: 485, width: 930, height: 48 }, { fontSize: 19, color: C.pale }, "command-help");
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `Execute ${deck.demo.command.replace(/\n/g, " e depois ")}. Pause para o aluno acompanhar o terminal.`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.light); light(slide);
  addTitle(slide, "Demonstração — observe", false);
  addSteps(slide, deck.demo.observe, false);
  addChrome(slide, deck, index++, deck.slides, false);
  setNotes(slide, `Durante a execução, destaque: ${deck.demo.observe.join("; ")}.`, sources);

  slide = p.slides.add();
  slide.setLayout(layouts.dark); dark(slide);
  addText(slide, "RESULTADO ESPERADO", { left: 72, top: 138, width: 500, height: 40 }, { fontSize: 18, bold: true, color: C.cyan }, "result-label");
  addText(slide, deck.demo.result, { left: 72, top: 220, width: 1050, height: 190 }, { fontSize: 46, bold: true, color: C.white }, "result");
  addText(slide, `Checkpoint ${deck.checkpoint} • evidência reproduzível`, { left: 72, top: 470, width: 760, height: 48 }, { fontSize: 22, color: C.pale }, "result-meta");
  addGlow(slide, 940, 260, 230);
  addChrome(slide, deck, index++, deck.slides, true);
  setNotes(slide, `Confirme o resultado esperado: ${deck.demo.result}. Se o valor divergir, não avance sem investigar.`, sources);
  return index;
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
  addText(slide, deck.cta, { left: 72, top: 220, width: 1020, height: 190 }, { fontSize: 44, bold: true, color: C.ink }, "cta");
  addText(slide, `Checkpoint ${deck.checkpoint} • roteiro completo no repositório`, { left: 72, top: 500, width: 800, height: 42 }, { fontSize: 20, color: C.muted }, "cta-meta");
  addChrome(slide, deck, index++, deck.slides, false);
  setNotes(slide, `${deck.cta} Encerre conectando a aula ao próximo checkpoint.`, sources);
  return index;
}

async function buildDeck(deck) {
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
    `https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/${deck.script}`,
    `repo://laboratorio/checkpoints/ep${deck.checkpoint}`,
    "repo://assets/catalog.yml",
    "repo://assets/decks/provenance.yml",
  ];

  addCover(p, layouts, deck, sources);
  addHook(p, layouts, deck, sources);
  addObjective(p, layouts, deck, sources);

  let current = 4;
  const allPaired = deck.slides % 2 === 1;
  for (let i = 0; i < deck.sections.length; i++) {
    const section = deck.sections[i];
    const isDark = (i % 2) === 0;
    addSectionConcept(p, layouts, deck, section, i, current++, sources, isDark);
    if (allPaired || i > 0) addSectionVisual(p, layouts, deck, section, current++, sources, !isDark);
  }
  current = addDemoSlides(p, layouts, deck, sources, current);
  current = addClosingSlides(p, layouts, deck, sources, current);

  if (p.slides.items.length !== deck.slides) {
    throw new Error(`${deck.stem}: esperado ${deck.slides} slides, criado ${p.slides.items.length}`);
  }

  const qaDir = path.join(BUILD, deck.stem);
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
  await fs.writeFile(path.join(OUT, `${deck.stem}.pptx.inspect.ndjson`), inspect.ndjson);
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(path.join(OUT, `${deck.stem}.pptx`));
  return { stem: deck.stem, slides: p.slides.items.length };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(BUILD, { recursive: true });
  const requested = process.argv.slice(2);
  const selected = requested.length ? decks.filter((d) => requested.includes(d.stem)) : decks;
  if (!selected.length) throw new Error("Nenhum deck selecionado.");
  for (const deck of selected) {
    const result = await buildDeck(deck);
    console.log(`${result.stem}: ${result.slides} slides`);
  }
  await execFileAsync(process.env.PYTHON || "python3", [path.join(ROOT, "scripts/decks/add_pptx_alt_text.py")]);
  console.log("Textos alternativos gravados nos PPTX canônicos.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
