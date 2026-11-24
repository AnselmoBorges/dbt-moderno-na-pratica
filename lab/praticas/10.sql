select full_refresh.source_candidate_rows as linhas_full,
       incremental.source_candidate_rows as linhas_inc,
       functional_result_equal as mesmo_resultado
from read_json_auto('lab/dabdbt/target/incremental_demo.json');
