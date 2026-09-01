{% macro create_freshness_fixture(age_hours=0) %}
  {% if target.type != 'duckdb' %}
    {{ exceptions.raise_compiler_error('A fixture de freshness é exclusiva do target local DuckDB.') }}
  {% endif %}

  {% set fixture_sql %}
    create schema if not exists lab_quality;
    create or replace table lab_quality.load_audit as
    select
      1 as load_id,
      current_timestamp - interval '{{ age_hours | int }} hours' as loaded_at
  {% endset %}

  {% do run_query(fixture_sql) %}
  {{ log('Fixture de freshness criada com idade de ' ~ (age_hours | string) ~ ' hora(s).', info=true) }}
{% endmacro %}
