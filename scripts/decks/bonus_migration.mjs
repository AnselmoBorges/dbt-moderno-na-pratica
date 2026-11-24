import fs from "node:fs/promises";
import path from "node:path";

const migration = "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2";
const releases = "https://docs.getdbt.com/docs/dbt-versions";
const distributions = "https://docs.getdbt.com/blog/comparing-dbt-and-dbt-oss";
const packageSource = "https://pypi.org/project/dbt-oss/2.0.11/";
const contracts = "https://docs.getdbt.com/docs/mesh/govern/model-contracts";
const persist = "https://docs.getdbt.com/reference/resource-configs/persist_docs";

export const bonusStem = "bonus-migracao-v2";

export async function addBonusSlides({ root, presentation, addText, addShape, addChrome, setNotes, colors: C }) {
  const script = "roteiros/bonus-migracao-v2.md";
  const markdown = await fs.readFile(path.join(root, script), "utf8");
  const fullSql = (await fs.readFile(path.join(root, "lab/bonus-v2/receita.sql"), "utf8")).trim();
  const screenshot = new Uint8Array(await fs.readFile(path.join(root, "assets/screenshots/dbt-docs/bonus-v2-gold.jpg")));
  const agenda = new Map([...markdown.matchAll(/^\| (\d{2}) \| (\d{2}:\d{2}) \| ([^|]+) \|$/gm)]
    .map(([, n, time, title]) => [n, { time, title: title.trim() }]));
  const notes = [...markdown.matchAll(/^### (\d{2}) · [^\n]+\n\n([\s\S]+?)(?=\n### |\n## )/gm)];
  const deck = { episode: "AULA BÔNUS", track: "OPEN / DBT OSS V2" };
  const repo = "https://github.com/AnselmoBorges/dbt-moderno-na-pratica";
  const course = `${repo}/blob/main/${script}`;

  function box(slide, x, y, w, h, fill) {
    return addShape(slide, "rect", { left: x, top: y, width: w, height: h }, fill);
  }

  function text(slide, value, x, y, w, h, options = {}) {
    addText(slide, value, { left: x, top: y, width: w, height: h },
      { fontSize: 29, ...options });
  }

  function statement(slide, value, dark = false) {
    text(slide, value, 72, 215, 1060, 108,
      { fontSize: 35, color: dark ? C.white : C.ink });
  }

  function cards(slide, values) {
    const width = (1136 - 20 * (values.length - 1)) / values.length;
    values.forEach(([label, detail], index) => {
      const left = 72 + (width + 20) * index;
      box(slide, left, 360, width, 202, C.white);
      box(slide, left, 360, width, 4, C.blue);
      text(slide, label, left + 20, 386, width - 40, 36, { bold: true, fontSize: 26 });
      text(slide, detail, left + 20, 440, width - 40, 104, { fontSize: 25, color: C.muted });
    });
  }

  function code(slide, value, top = 234, height = 218, fontSize = 26) {
    box(slide, 72, top, 1136, height, C.navy2);
    text(slide, value, 104, top + 22, 1066, height - 38,
      { fontFamily: "Courier New", fontSize, color: C.white });
  }

  function hint(slide, value, top = 580, color = C.muted) {
    text(slide, value, 72, top, 1136, 66, { fontSize: 21, color });
  }

  const slides = [
    { title: "Migração na prática", dark: true, source: migration, body(slide) {
      text(slide, "Do dbt Core 1.12\nao dbt OSS v2", 72, 202, 1136, 208,
        { color: C.white, fontSize: 64, bold: true });
      box(slide, 72, 438, 96, 5, C.cyan);
      hint(slide, "O mesmo laboratório Olist em dois motores", 478, C.pale);
    }},
    { title: "A receita bateu. Você migraria?", source: contracts, body(slide) {
      statement(slide, "No teste do Mac, a Gold respondeu certo e duas versões com contrato falharam.");
      cards(slide, [["Resultado", "O que o consumidor vê"], ["Teste", "O que o pipeline verifica"], ["Contrato", "O que a interface promete"]]);
    }},
    { title: "Roteiro da aula", source: migration, body(slide) {
      const entries = [
        ["04", "A base estável do curso"], ["07", "Instalação e comparação"],
        ["11", "O SQL e o resultado"], ["13", "Catálogo v2 e decisão de migração"],
      ];
      entries.forEach(([number, label], index) => {
        const y = 227 + index * 90;
        text(slide, agenda.get(number).time, 76, y, 150, 50, { color: C.blue, bold: true });
        box(slide, 216, y + 4, 3, 44, C.line);
        text(slide, label, 248, y, 900, 52, { fontSize: 32 });
      });
    }},
    { title: "Por que aprender o Core 1.12", source: releases, body(slide) {
      statement(slide, "Para evoluir um projeto existente, primeiro descubra quais garantias ele já oferece.");
      cards(slide, [["Modelos", "Como o dado é montado"], ["Testes", "Que regras são verificadas"], ["Contratos", "Qual interface chega ao consumidor"]]);
    }},
    { title: "Qual dbt v2 usamos?", source: distributions, body(slide) {
      statement(slide, "O pacote dbt-oss instala o motor v2 da aula em um ambiente próprio.");
      cards(slide, [["Core 1.12.7", "Referência da temporada"], ["dbt OSS 2.0.11", "Motor candidato da aula"], ["Distribuição completa", "Outro pacote e outros recursos"]]);
    }},
    { title: "Dois ambientes, a mesma amostra", source: migration, body(slide) {
      statement(slide, "Cada execução recebe um perfil, um banco DuckDB e uma pasta de resultados.");
      cards(slide, [["Cópia Core", "Seeds Olist → dbt 1.12.7 → core.duckdb"], ["Cópia v2", "Seeds Olist → dbt OSS 2.0.11 → v2.duckdb"]]);
      hint(slide, "As cópias ficam em build/bonus-v2/.");
    }},
    { title: "Comandos da prática", source: packageSource, body(slide) {
      code(slide, "python course.py setup\npython course.py bonus-v2 setup\npython course.py bonus-v2 compare", 223, 224);
      hint(slide, "Execute na raiz. Use o primeiro comando se o ambiente da Aula 0 ainda estiver pendente.", 491);
      hint(slide, "A instalação inicial e a resolução de pacotes usam internet.", 553);
    }},
    { title: "Parse e seeds passaram", source: migration, body(slide) {
      statement(slide, "No teste do Mac, o primeiro build v2 parou antes de chegar à Gold.");
      cards(slide, [["Parse · OK", "Carregou as definições"], ["Seeds · OK", "Carregou os CSVs"], ["Silver · erro", "Consulte 06-v2-original.log"]]);
    }},
    { title: "Altere uma configuração na cópia", source: persist, body(slide) {
      statement(slide, "O teste desativa a gravação de comentários físicos e preserva os contratos.");
      cards(slide, [["Antes · teste no Mac", "persist_docs ativo\nFalha na Silver"], ["Depois · teste no Mac", "persist_docs desativado\nGold disponível; contratos com erro"]]);
    }},
    { title: "Onde o v2 falhou no Mac", source: contracts, body(slide) {
      code(slide, "Cannot prepare multiple statements at once!", 234, 104, 24);
      text(slide, "order_metrics.v1\norder_metrics.v2", 74, 386, 1120, 110, { fontSize: 32, bold: true });
      hint(slide, "Logs em build/bonus-v2/. Veja o nome da execução em resultado.json.");
    }},
    { title: "SQL: receita entregue", source: contracts, body(slide) {
      code(slide, fullSql, 192, 376, 23);
      hint(slide, "Execute em core.duckdb e v2.duckdb. A Gold já tem uma linha por pedido.", 584);
    }},
    { title: "Oito pedidos, as mesmas respostas", source: migration, body(slide) {
      const data = [["Verificação", "Core", "OSS v2"], ["Pedidos", "8", "8"],
        ["Receita bruta", "740", "740"], ["Receita entregue", "630", "630"]];
      data.forEach(([metric, left, right], index) => {
        const top = 208 + index * 73;
        box(slide, 72, top, 1136, 67, index === 0 ? C.navy2 : C.white);
        [metric, left, right].forEach((value, cell) => text(slide, value, [94, 620, 916][cell],
          top + 12, [480, 236, 220][cell], 43,
          { bold: index === 0, color: index === 0 ? C.white : C.ink }));
      });
      hint(slide, "Paridade em cinco campos da Gold. Confira o estado da migração no seu resultado.json.", 554);
    }},
    { title: "Explore o dbt Docs v2", source: distributions, body(slide) {
      code(slide, "python course.py bonus-v2 docs", 190, 86, 25);
      text(slide, "1. Abra a porta privada 8580\n\n2. Abra Assets → Models → order_fulfillment_g\n\n3. Confira descrição e dependências", 72, 325, 1090, 244, { fontSize: 30 });
      hint(slide, "Em uma instalação local, abra http://localhost:8580.", 570);
    }},
    { title: "A ficha da Gold no dbt Docs v2", dark: true, source: distributions, body(slide) {
      slide.images.add({ blob: screenshot, contentType: "image/jpeg",
        alt: "Ficha real de order_fulfillment_g, com a descrição, aba Columns e início da linhagem.",
        fit: "contain", position: { left: 72, top: 176, width: 825, height: 464 } });
      text(slide, "General", 924, 245, 285, 38, { fontSize: 28, bold: true, color: C.cyan });
      text(slide, "Descrição e linhagem", 924, 296, 285, 82, { fontSize: 25, color: C.white });
      text(slide, "Columns", 924, 405, 285, 38, { fontSize: 28, bold: true, color: C.cyan });
      text(slide, "Campos do modelo", 924, 456, 285, 82, { fontSize: 25, color: C.white });
    }},
    { title: "O que você guarda para decidir?", source: migration, body(slide) {
      statement(slide, "Use os artefatos para rastrear a execução e conferir as interfaces.");
      cards(slide, [["Core 1.12", "manifest.json\nrun_results.json"], ["OSS v2", "Information Schema em Parquet\nJSON de compatibilidade"]]);
      hint(slide, "Antes de promover: valide regras, paridade, contratos e consumidores.");
    }},
    { title: "Qual seria seu critério de aprovação?", dark: true, source: migration, body(slide) {
      statement(slide, "Escolha uma Gold. Cite um número, uma regra, um contrato e um consumidor.", true);
      box(slide, 72, 400, 1136, 134, C.navy2);
      text(slide, "Radar para uma série v2", 96, 414, 1080, 38, { bold: true, fontSize: 23, color: C.cyan });
      text(slide, "Compatibilidade por adaptador, artifacts em CI e desempenho medido.", 96, 465, 1080, 46, { color: C.white, fontSize: 24 });
      hint(slide, "Exercício: sustente sua decisão com uma evidência do log e uma do relatório.", 575, C.pale);
    }},
  ];

  if (notes.length !== slides.length || agenda.size !== slides.length) {
    throw new Error("O roteiro da aula bônus precisa de tempo e notas para cada slide.");
  }
  slides.forEach(({ title, body, dark = false, source }, index) => {
    const slide = presentation.slides.add();
    slide.background.fill = dark ? C.navy : C.pale;
    addChrome(slide, deck, index + 1, slides.length, dark);
    text(slide, title, 72, 86, 1136, 94, { color: dark ? C.white : C.ink, fontSize: 47, bold: true });
    body(slide);
    const [, number, raw] = notes[index];
    if (Number(number) !== index + 1 || !agenda.has(number)) throw new Error("Roteiro fora de ordem.");
    const copy = raw.trim().replaceAll("**", "").replaceAll("\x60", "");
    setNotes(slide, `[Roteiro recomendado]\n[Tempo sugerido: ${agenda.get(number).time}]\n\n${copy}`,
      [source, course]);
  });
}
