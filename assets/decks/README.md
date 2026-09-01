# Apresentações da série

Piloto aprovado tecnicamente para avaliação editorial:

| Aula | Versão visual | PDF visual | Base editável |
|---|---|---|---|
| Aula 0 — ambiente | [PPTX Banana](aula-00-ambiente-banana.pptx) | [PDF Banana](aula-00-ambiente-banana.pdf) | [PPTX nativo](aula-00-ambiente.pptx) |
| Episódio 1 — baseline Core 1.12 | [PPTX Banana](episodio-01-baseline-core-1-12-banana.pptx) | [PDF Banana](episodio-01-baseline-core-1-12-banana.pdf) | [PPTX nativo](episodio-01-baseline-core-1-12.pptx) |

As versões Banana são as recomendadas para apresentação e gravação. Elas usam uma imagem integral por slide para preservar a fidelidade visual; o texto visível não é editável no PowerPoint. As bases nativas permanecem no repositório para ajustes de conteúdo e possuem texto e formas editáveis.

Todos os PPTX possuem notas do apresentador e um bloco `[Sources]` para afirmações externas. Os arquivos usam proporção 16:9 e a paleta Rescue Point.

As apresentações não usam logos de terceiros e deixam explícito que o curso é independente. A produção dos outros 11 decks open começa somente depois da aprovação didática deste piloto.

## Verificação realizada

- 12 slides na Aula 0 e 14 no episódio 1, nas versões nativa e Banana.
- Renderização individual de todos os slides.
- Ausência de conteúdo fora do canvas.
- Inspeção de quebras, contraste, setas, hierarquia e legibilidade.
- Conversão dos dois PPTX Banana para PDF.
- Notas e fontes preservadas depois do redesenho.
- Arquivos otimizados para Git sem depender do Drive ou de credenciais privadas.

## Procedência do redesenho

As versões visuais foram criadas no Hermes com o perfil `rescue`, usando Banana Slides, Nano Banana Pro (`gemini-3-pro-image-preview`) para imagens e Gemini 3 Flash (`gemini-3-flash-preview`) para apoio textual. O conteúdo visível foi fixado a partir dos roteiros do curso e revisado slide a slide; não foram usados logos de terceiros, capturas fictícias de produto nem resultados inventados.

Os identificadores de projeto, modelos, datas e decisões de revisão estão em [provenance.yml](provenance.yml). Nenhuma chave, configuração privada ou credencial foi incorporada aos arquivos.

## Material complementar

- [Diretrizes de marca da dbt Labs](https://www.getdbt.com/trademark-guidelines) — dbt Labs, política/EN; uso descritivo de marcas; verificado em 2026-09-01.
- [Roteiro da Aula 0](../../roteiros/aula-00-ambiente.md) — Rescue Point, roteiro/PT-BR; fonte editorial do deck.
- [Roteiro do episódio 1](../../roteiros/01-playlist-core-1-12.md) — Rescue Point, roteiro/PT-BR; fonte editorial do deck.
