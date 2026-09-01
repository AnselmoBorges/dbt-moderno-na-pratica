# 09 — CI inteligente

Execute `python course.py checkpoint 09`. Uma alteração temporária em `orders_s` deve incluir o modelo, seus descendentes, testes, métricas e exposure, sem selecionar ramos independentes. O mesmo script constrói `commerce_orders` no target `ci` e resolve o pai não selecionado pela relation do manifest baseline usando `--defer --favor-state`.
