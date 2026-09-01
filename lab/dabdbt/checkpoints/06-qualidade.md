# 06 — Pirâmide de qualidade

Execute `python scripts/run_checkpoint.py 06`. O full build combina unit test, data tests, testes SQL, relacionamentos e contratos. Em seguida, uma fixture criada com o relógio do teste prova dois cenários: carga atual aprovada e carga com 24 horas rejeitada. O teste restaura a fonte recente ao terminar.
