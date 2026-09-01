# Mapa do curso e checkpoints

```mermaid
flowchart TB
    A0[Aula 0: ambiente] --> E1[1. baseline]
    E1 --> E2[2. Gold e semântica] --> E3[3. métricas] --> E4[4. interoperabilidade]
    E4 --> E5[5. contratos] --> E6[6. qualidade] --> E7[7. governança]
    E7 --> E8[8. produtos] --> E9[9. CI] --> E10[10. FinOps]
    E10 --> E11[11. MCP] --> E12[12. agentes]
```

Cada checkpoint é cumulativo e usa o estado final do projeto para isolar a capacidade focal:

```bash
python course.py checkpoint 01
python course.py checkpoint 02
# ...
python course.py checkpoint 12
```

Os episódios 13–16 são uma segunda temporada proprietária. Eles não fazem parte da validação local e não serão apresentados como executados sem acesso legítimo.

## Material complementar

- [dbt Learn](https://www.getdbt.com/dbt-learn) — dbt Labs, cursos/EN, trilhas oficiais complementares; verificado em 2026-09-01.

