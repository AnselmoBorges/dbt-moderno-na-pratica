import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const ROOT = process.env.COURSE_ROOT
  ? path.resolve(process.env.COURSE_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DECK_DIR = path.resolve(process.env.COURSE_DECK_OUTPUT ?? path.join(ROOT, "assets/decks"));
const LESSONS = JSON.parse(await fs.readFile(path.join(ROOT, "lab/praticas/aulas.json"), "utf8"));
const OUTPUT_DIR = process.env.SPEAKER_NOTES_OUTPUT
  ? path.resolve(process.env.SPEAKER_NOTES_OUTPUT)
  : path.join(ROOT, "build/notes-runtime/output");

const DECKS = [
  "aula-00-ambiente",
  "episodio-01-baseline-core-1-12",
  "episodio-02-gold-nao-e-semantica",
  "episodio-03-metricflow-local",
  "episodio-04-semantica-aberta-interoperavel",
  "episodio-05-contratos-versoes",
  "episodio-06-piramide-qualidade",
  "episodio-07-governanca-como-codigo",
  "episodio-08-data-products-open",
  "episodio-09-ci-state-defer",
  "episodio-10-finops-pipeline",
  "episodio-11-dbt-mcp",
  "episodio-12-gold-governada-agente-solto",
];

const unique = (values) => [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))];
const stripBullet = (value) => value.replace(/^\s*[•\-]\s*/, "").trim();
const sentence = (value) => {
  const text = stripBullet(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
};
const lowerFirst = (value) => {
  if (!value || /^[A-ZÁÉÍÓÚÃÕÇ]{2}/.test(value)) return value;
  return value.charAt(0).toLocaleLowerCase("pt-BR") + value.slice(1);
};

function naturalList(values) {
  const items = unique(values.map(stripBullet));
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} e ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} e ${items.at(-1)}`;
}

function sourcesFrom(existingNotes) {
  const marker = existingNotes.indexOf("[Sources]");
  if (marker < 0) return [];
  return unique(existingNotes.slice(marker + "[Sources]".length).split("\n").map((line) => line.replace(/^\s*-\s*/, "")));
}

function getText(records, name) {
  return records.find((record) => record.name === name)?.text?.trim() || "";
}

function getTexts(records, predicate) {
  return unique(records.filter(predicate).flatMap((record) => (record.text || "").split("\n")).map(stripBullet));
}

function classify(records) {
  const names = new Set(records.map((record) => record.name));
  if (names.has("cover-title")) return "cover";
  if (names.has("presenter-name")) return "presenter";
  if (names.has("hook")) return "hook";
  if (names.has("practice-sql")) return "practice-sql";
  if (names.has("practice-evidence")) return "practice-evidence";
  if (names.has("stage-label-0") || names.has("sources-table-label")) return "data-intro";
  if (names.has("docs-command") || names.has("lineage-selector")) return "dbt-docs";
  if (names.has("cta")) return "cta";
  if (names.has("command")) return "demo-command";
  if (names.has("result")) return "demo-result";
  if (names.has("case-number")) return "case";
  if (names.has("radar-text")) return "radar";
  const title = getText(records, "slide-title");
  if (title === "Roteiro da aula" || title === "Ao final, você consegue...") return "objectives";
  if (title === "Demonstração — observe") return "demo-observe";
  if (title === "O mesmo recurso afeta três decisões") return "impact";
  if (title === "Limitações que precisam permanecer visíveis") return "limitations";
  if (names.has("section-number")) return "concept";
  return "visual";
}

function slideContent(records, slideRecord, previous) {
  const title = getText(records, "cover-title")
    || getText(records, "presenter-name")
    || getText(records, "slide-title")
    || getText(records, "hook")
    || getText(records, "result-label")
    || getText(records, "radar-label")
    || getText(records, "cta-label")
    || getText(records, "case-number")
    || slideRecord?.title
    || "este ponto";
  const subtitle = getText(records, "cover-subtitle")
    || getText(records, "slide-subtitle")
    || getText(records, "result")
    || getText(records, "radar-text")
    || getText(records, "cta")
    || getText(records, "case-label")
    || (previous?.title === title ? previous.subtitle : "");
  const items = getTexts(records, (record) => /^(bullets|agenda-topic-|step-label-|flow-|status-label-|compare-(left|right)-title)/.test(record.name || ""));
  return { title, subtitle, items };
}

function recommendedScript({ role, content, records, deckTitle, episode, checkpoint, nextTitle, isLast, practice, authoredNote }) {
  const { title, subtitle, items } = content;
  const itemSpeech = naturalList(items);
  const commands = getTexts(records, (record) => /^command(?:-\d+)?$/.test(record.name || ""));
  const result = getText(records, "result");
  const caveat = getText(records, "case-caveat");
  const caseLabel = getText(records, "case-label");
  const caseNumber = getText(records, "case-number");
  const radar = getText(records, "radar-text");
  const cta = getText(records, "cta");
  const imageCaption = getText(records, "image-caption");
  const isLesson = /^AULA\b/i.test(episode);
  const episodeWelcome = `${isLesson ? "à" : "ao"} ${episode.toLocaleLowerCase("pt-BR")}`;
  const episodeAfter = `${isLesson ? "da" : "do"} ${episode.toLocaleLowerCase("pt-BR")}`;

  const timings = {
    cover: episode === "AULA 0" ? "00:20" : "00:45", presenter: "00:40", hook: "01:00", objectives: "01:00", concept: "01:10", visual: "00:55",
    "demo-command": "01:20", "demo-observe": "01:10", "demo-result": "00:45", impact: "01:00",
    "practice-sql": "01:10", "practice-evidence": "00:45", "data-intro": "00:40", "dbt-docs": "01:00",
    case: "00:55", limitations: "01:00", radar: "00:55", cta: "00:40",
  };

  let talk;
  let highlight;
  let authoredTransition;
  switch (role) {
    case "cover":
      talk = `Bem-vindo ${episodeWelcome} do dbt Moderno na Prática. Hoje vamos trabalhar o tema “${title}”. ${sentence(subtitle)} O objetivo não é apenas conhecer o conceito: vamos conectá-lo ao laboratório e terminar com uma evidência que você consegue reproduzir no seu próprio ambiente. Ao longo da aula, separe sempre o que é recurso aberto e estável daquilo que aparecerá apenas no Radar.`;
      highlight = `Apresente o título, situe o checkpoint ${checkpoint} e deixe claro que a aula faz parte da trilha open/stable.`;
      if (episode === "AULA 0") {
        talk = "Bem-vindos ao dbt Moderno na Prática. Hoje vamos conhecer os dados do curso e preparar o ambiente para consultar os primeiros pedidos.";
        highlight = "Mostre o nome da série e o objetivo prático da Aula 0.";
        authoredTransition = "Antes de abrir o laboratório, deixa eu me apresentar.";
      }
      break;
    case "presenter": {
      const match = authoredNote.match(/^“([^”]+)”\s+\*\*O que destacar:\*\* ([\s\S]+?)\s+\*\*Transição:\*\* “([^”]+)”$/);
      if (!match) throw new Error("As notas do instrutor precisam de fala, destaque e transição.");
      [, talk, highlight, authoredTransition] = match;
      break;
    }
    case "hook":
      talk = `Quero começar com uma provocação: ${sentence(title)} Essa pergunta orienta toda a aula. Em vez de aceitar uma afirmação porque ela parece correta, vamos procurar uma definição verificável e uma demonstração executável. Guarde essa tensão, porque voltaremos a ela quando compararmos o conceito com o resultado do laboratório.`;
      highlight = "Dê uma pausa depois da provocação e use o diagrama como mapa do problema, sem explicar todas as etapas ainda.";
      break;
    case "objectives":
      talk = `O roteiro de hoje passa por ${lowerFirst(itemSpeech)}. Os tempos ajudam a encontrar cada parte na gravação. Na demonstração, deixe o terminal do projeto aberto para executar a prática junto comigo.`;
      highlight = "Percorra as etapas e aponte o momento em que começa a demonstração.";
      break;
    case "concept":
      talk = `A mensagem principal deste slide é: ${sentence(subtitle || title)} Para tornar isso concreto, observe ${lowerFirst(itemSpeech)}. Esses pontos devem ser entendidos em conjunto; não são funcionalidades isoladas. No projeto, essa combinação transforma uma convenção informal em algo que pode ser revisado, testado ou consumido de maneira consistente.`;
      highlight = `Comece pelo título, leia a afirmação abaixo dele e depois desenvolva os itens sem repetir o texto palavra por palavra.`;
      break;
    case "visual":
      talk = `Agora vamos ler a ideia visualmente. ${sentence(subtitle || `O slide representa ${lowerFirst(title)}`)} Siga a composição na ordem mostrada e conecte ${lowerFirst(itemSpeech || "os elementos principais")}. A imagem ou o fluxo não cria uma regra nova; ele torna visível a relação que acabamos de explicar. ${imageCaption ? `A figura é identificada como ${lowerFirst(imageCaption)}` : "Use a disposição dos elementos para reforçar causa, dependência ou comparação."}`;
      highlight = imageCaption
        ? "Aponte a legenda e deixe explícito quando a figura é oficial; as anotações do curso ficam fora da imagem."
        : "Acompanhe o fluxo ou a comparação com o cursor e preserve a ordem de leitura do slide.";
      break;
    case "demo-command":
      if (title === "DuckDB UI oficial por túnel") {
        talk = "Este bônus usa dois terminais. No Codespace, inicie a DuckDB UI oficial. No seu computador, confira se o GitHub CLI está autenticado, autorize o escopo de Codespaces e abra o túnel. Use localhost na porta 4213 no navegador do seu computador. Deixe os dois processos ativos durante a demonstração.";
        highlight = "Aponte os dois blocos e mostre em qual máquina cada um é executado.";
      } else if (isLesson) {
        talk = "Na raiz do repositório, rode o setup se a configuração for manual ou se o setup automático tiver sido interrompido. Depois confira o diagnóstico e os caminhos e execute o checkpoint. O explorador é opcional e fica rodando até você pressionar Ctrl+C. Use o relatório de suporte se precisar anexar um diagnóstico.";
        highlight = "Mostre a diferença entre os comandos de validação e os blocos opcionais.";
      } else {
        talk = `Abra o terminal na raiz do repositório. Copie e execute ${sentence(commands.join(", depois "))} O course.py usa as dependências do laboratório. Acompanhe as etapas no terminal até aparecer a confirmação do checkpoint.`;
        highlight = "Mostre a pasta atual no terminal e deixe o aluno copiar a linha inteira.";
      }
      break;
    case "demo-observe":
      talk = `Enquanto a execução acontece, não olhe apenas para a mensagem final. Observe ${lowerFirst(itemSpeech)}. Cada sinal responde a uma pergunta diferente sobre o pipeline. Se um deles divergir, interrompa a demonstração e investigue; o objetivo do hands-on é produzir evidência, não apenas chegar rapidamente a uma tela verde.`;
      highlight = "Marque cada observação quando ela aparecer no terminal ou no artifact correspondente.";
      break;
    case "practice-sql":
      talk = title === "SQL do gráfico final"
        ? "No Explorador DuckDB, selecione 12-insight e clique em Executar consulta. Leia a tabela e role até o gráfico. A consulta agrupa por mês da compra e usa os valores já definidos na interface semântica."
        : "Conclua o checkpoint e abra o explorador em um terminal. No Codespaces, abra a porta privada 4213 na guia Portas. Selecione a aula ou cole o SQL no editor e clique em Executar consulta. Se já estava com o explorador aberto antes do checkpoint, reinicie-o para atualizar a cópia do banco.";
      highlight = `Mostre o botão Executar consulta e o comando ${getText(records, "practice-cli")}, que roda a mesma consulta no terminal.`;
      break;
    case "practice-evidence":
      talk = `${practice.evidence} ${practice.highlight}`;
      highlight = "Aponte as colunas da grade que sustentam o resultado e compare com a execução do aluno.";
      break;
    case "data-intro":
      talk = authoredNote;
      highlight = "Aponte a diferença entre uma linha por pedido e várias linhas de itens ou pagamentos.";
      break;
    case "dbt-docs":
      talk = authoredNote;
      highlight = "Navegue no HTML local. Aponte onde o aluno encontra o campo ou a dependência mostrada no slide.";
      break;
    case "demo-result":
      talk = `Este é o ponto de parada da demonstração: ${sentence(result)} Esse resultado confirma que a etapa executada produziu a evidência esperada para o checkpoint ${checkpoint}. Se o valor, o status ou o artifact estiver diferente, não trate a divergência como detalhe de ambiente. Use o diagnóstico do curso e só avance quando a causa estiver compreendida.`;
      highlight = "Compare o resultado do terminal com a frase central do slide e registre a evidência antes de continuar.";
      break;
    case "impact":
      talk = `Antes de seguir, conecte a técnica às decisões que ela afeta: ${sentence(itemSpeech)} Governança define responsabilidade e consistência; FinOps pergunta quanto trabalho estamos repetindo; e IA depende do contexto que decidimos expor. A mesma implementação pode melhorar os três eixos, mas os ganhos devem ser medidos separadamente.`;
      highlight = "Percorra os três eixos e evite apresentar economia ou acurácia como consequência automática.";
      break;
    case "case":
      talk = `Aqui temos ${caseNumber}: ${sentence(lowerFirst(caseLabel))} O número ajuda a dimensionar o exemplo, mas precisa ser lido com a ressalva correta. ${sentence(caveat)} Use o case como evidência contextual e não como promessa de que outro projeto repetirá o mesmo resultado sem as mesmas condições.`;
      highlight = "Apresente primeiro o número, depois a definição e termine obrigatoriamente com a ressalva.";
      break;
    case "limitations":
      talk = `Também precisamos declarar os limites da recomendação. Neste cenário, considere ${lowerFirst(itemSpeech)}. Esses pontos não anulam a técnica; eles delimitam onde a demonstração é válida e quais condições precisam ser verificadas antes de levar o padrão para produção. Tratar limites como parte do design evita transformar uma boa prática em regra universal.`;
      highlight = "Leia os limites com o mesmo peso dado aos benefícios e diferencie restrição do laboratório de restrição do produto.";
      break;
    case "radar":
      talk = `Este é o nosso Radar: ${sentence(radar)} A intenção é mostrar a direção da ferramenta sem misturar preview com o caminho suportado da aula. Novidade observada não é recomendação de produção. Para adotar qualquer recurso futuro, confirme maturidade, adaptador, documentação e impacto sobre o projeto antes de alterar o baseline estável.`;
      highlight = "Reforce visualmente a regra do rodapé e não execute comandos beta ou preview como parte obrigatória da aula.";
      break;
    case "cta":
      talk = `${sentence(cta)} Faça essa etapa antes de seguir para o próximo episódio, porque o curso é cumulativo e o checkpoint atual se torna a base da aula seguinte. Se houver divergência, use o relatório de suporte e registre o que foi observado. O objetivo é avançar com um estado conhecido e reproduzível, não apenas assistir ao conteúdo.`;
      highlight = "Mostre o checkpoint e indique no repositório onde ficam o roteiro, os comandos e as referências da aula.";
      break;
    default:
      talk = `${sentence(subtitle || title)} Desenvolva a ideia usando ${lowerFirst(itemSpeech)} e conecte-a ao checkpoint ${checkpoint}.`;
      highlight = "Destaque a afirmação principal e os elementos que sustentam a conclusão.";
  }

  const transition = authoredTransition ?? (isLast
    ? `Encerre retomando a pergunta inicial e confirme que o aluno sabe qual ação executar depois ${episodeAfter}.`
    : `Com esse ponto estabelecido, avance para “${nextTitle}”.`);

  if (episode === "EPISÓDIO 1" && role === "cta") {
    talk = "Execute python course.py checkpoint 01 na raiz. No explorador, abra lab/dabdbt/target/manifest.json. No Codespaces, também dá para abrir pelo comando code seguido do caminho. Busque parent_map para ver as dependências e semantic_model.dabdbt.commerce_orders para encontrar a definição que descreve as dimensões e entidades dos pedidos.";
    highlight = "Mostre o caminho na árvore de arquivos e abra a entrada de commerce_orders. Explique que o JSON descreve o projeto e que as linhas estão no DuckDB.";
  }
  if (episode === "EPISÓDIO 1" && title.startsWith("O mapa do projeto")) {
    talk = "O manifest descreve modelos, testes e dependências. O run_results registra o resultado do último comando que escreveu o arquivo. Neste checkpoint, docs generate roda depois do build e grava o resultado da geração de documentação. Para acompanhar o resultado do build, observe o resumo no terminal.";
    highlight = "Abra os dois JSON e mostre args.which em run_results.json.";
  }

  return {
    timing: timings[role] || "01:00",
    talk,
    highlight,
    transition,
    deckTitle,
  };
}

function renderNotes(script, sources) {
  return [
    "[Roteiro recomendado]",
    `[Tempo sugerido: ${script.timing}]`,
    "",
    "Fala sugerida:",
    script.talk,
    "",
    "O que destacar:",
    `- ${script.highlight}`,
    "",
    "Transição:",
    script.transition,
    "",
    "[Sources]",
    ...sources.map((source) => `- ${source}`),
  ].join("\n");
}

async function processDeck(stem) {
  const practice = LESSONS[stem.split("-")[1]];
  const sourcePath = path.join(DECK_DIR, `${stem}.pptx`);
  const outputPath = path.join(OUTPUT_DIR, `${stem}.pptx`);
  const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));
  const snapshot = await presentation.inspect({
    kind: "slide,textbox,notes",
    include: "id,slide,name,title,text",
    maxChars: 5_000_000,
  });
  const records = snapshot.ndjson.split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const slideNumber = (record) => Number.isInteger(record.slideIndex) ? record.slideIndex + 1 : record.slide;
  const slideRecords = new Map(records.filter((record) => record.kind === "slide").map((record) => [slideNumber(record), record]));
  const noteRecords = new Map(records.filter((record) => record.kind === "notes").map((record) => [slideNumber(record), record]));
  const textBySlide = new Map();
  for (const record of records.filter((item) => item.kind === "textbox")) {
    const number = slideNumber(record);
    if (!textBySlide.has(number)) textBySlide.set(number, []);
    textBySlide.get(number).push(record);
  }

  const firstRecords = textBySlide.get(1) || [];
  const deckTitle = getText(firstRecords, "cover-title") || stem;
  const episode = getText(firstRecords, "cover-episode") || "aula";
  const checkpointMatch = getText(firstRecords, "cover-meta").match(/Checkpoint\s+(\d+)/i);
  const checkpoint = checkpointMatch?.[1] || "correspondente";
  const contents = [];
  let previous = null;
  for (let index = 1; index <= presentation.slides.items.length; index += 1) {
    const content = slideContent(textBySlide.get(index) || [], slideRecords.get(index), previous);
    contents.push(content);
    previous = content;
  }

  const notesReport = [];
  for (let index = 1; index <= presentation.slides.items.length; index += 1) {
    const recordsForSlide = textBySlide.get(index) || [];
    const role = classify(recordsForSlide);
    const rawNotes = noteRecords.get(index)?.text || "";
    const script = recommendedScript({
      role,
      content: contents[index - 1],
      records: recordsForSlide,
      deckTitle,
      episode,
      checkpoint,
      nextTitle: contents[index]?.title || "encerramento",
      isLast: index === presentation.slides.items.length,
      practice: Object.values(LESSONS).find((item) => item.topic === contents[index - 1].title) ?? practice,
      authoredNote: rawNotes.split("[Sources]")[0].trim(),
    });
    const sources = sourcesFrom(rawNotes);
    const notes = renderNotes(script, sources);
    const slide = presentation.slides.items[index - 1];
    slide.speakerNotes.textFrame.setText(notes);
    slide.speakerNotes.setVisible(true);
    const imageAlt = role === "cover"
      ? `Ilustração conceitual autoral da capa: ${contents[index - 1].title}.`
      : role === "hook"
        ? `Diagrama didático autoral que apresenta: ${contents[index - 1].title}.`
        : `Imagem de apoio usada para explicar: ${contents[index - 1].title}.`;
    for (const image of slide.images.items) {
      if (!image.alt) image.alt = imageAlt;
    }
    notesReport.push({ slide: index, role, title: contents[index - 1].title, chars: notes.length, sources: sources.length });
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const output = await PresentationFile.exportPptx(presentation);
  await output.save(outputPath);
  return { stem, slides: notesReport.length, notes: notesReport };
}

async function main() {
  const requested = process.argv.slice(2);
  const selected = requested.length ? DECKS.filter((stem) => requested.includes(stem)) : DECKS;
  if (!selected.length) throw new Error("Nenhum deck selecionado.");
  const report = [];
  for (const stem of selected) {
    const result = await processDeck(stem);
    report.push(result);
    console.log(`${stem}: ${result.slides} roteiros aplicados`);
  }
  await fs.writeFile(path.join(OUTPUT_DIR, "speaker-notes-report.json"), `${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
