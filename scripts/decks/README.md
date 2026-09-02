# Autoria das apresentações

Estes scripts são ferramentas editoriais da Rescue Point; não fazem parte dos pré-requisitos do aluno.

Ordem de produção:

1. `build_course_decks.mjs` monta os PPTX canônicos e os renders de QA.
2. `apply_speaker_notes.mjs` importa os decks, preserva todo o conteúdo visível e aplica o roteiro recomendado por slide.
3. `add_pptx_alt_text.py` garante texto alternativo nos elementos visuais quando o exportador não o preservar.
4. `scripts/verify_editorial.py` bloqueia a publicação se faltar deck, página, nota, fonte, texto alternativo, procedência ou hash.

As notas de cada slide contêm:

- tempo sugerido;
- fala recomendada em PT-BR;
- indicação do que destacar;
- transição para o próximo slide;
- bloco `[Sources]` preservado.

O fluxo de edição das notas não altera o conteúdo visível nem exige que o aluno tenha acesso ao Hermes, Banana Slides ou Gemini.
