{% macro rp_date_diff(start_expr, end_expr) -%}
  {{ return(adapter.dispatch('rp_date_diff', 'dabdbt')(start_expr, end_expr)) }}
{%- endmacro %}

{% macro duckdb__rp_date_diff(start_expr, end_expr) -%}
  date_diff('day', {{ start_expr }}, {{ end_expr }})
{%- endmacro %}

{% macro databricks__rp_date_diff(start_expr, end_expr) -%}
  datediff({{ end_expr }}, {{ start_expr }})
{%- endmacro %}

{% macro default__rp_date_diff(start_expr, end_expr) -%}
  datediff(day, {{ start_expr }}, {{ end_expr }})
{%- endmacro %}

{% macro rp_collect_set(expression) -%}
  {{ return(adapter.dispatch('rp_collect_set', 'dabdbt')(expression)) }}
{%- endmacro %}

{% macro duckdb__rp_collect_set(expression) -%}
  list(distinct {{ expression }})
{%- endmacro %}

{% macro databricks__rp_collect_set(expression) -%}
  collect_set({{ expression }})
{%- endmacro %}

{% macro default__rp_collect_set(expression) -%}
  array_agg(distinct {{ expression }})
{%- endmacro %}

{% macro rp_collect_set_string(expression) -%}
  {{ return(adapter.dispatch('rp_collect_set_string', 'dabdbt')(expression)) }}
{%- endmacro %}

{% macro duckdb__rp_collect_set_string(expression) -%}
  string_agg(distinct {{ expression }}, ', ' order by {{ expression }})
{%- endmacro %}

{% macro databricks__rp_collect_set_string(expression) -%}
  concat_ws(', ', sort_array(collect_set({{ expression }})))
{%- endmacro %}

{% macro default__rp_collect_set_string(expression) -%}
  string_agg(distinct {{ expression }}, ', ')
{%- endmacro %}

{% macro rp_last_by(value_expr, order_expr) -%}
  {{ return(adapter.dispatch('rp_last_by', 'dabdbt')(value_expr, order_expr)) }}
{%- endmacro %}

{% macro duckdb__rp_last_by(value_expr, order_expr) -%}
  arg_max({{ value_expr }}, {{ order_expr }})
{%- endmacro %}

{% macro databricks__rp_last_by(value_expr, order_expr) -%}
  max_by({{ value_expr }}, {{ order_expr }})
{%- endmacro %}

{% macro default__rp_last_by(value_expr, order_expr) -%}
  max({{ value_expr }})
{%- endmacro %}

{% macro rp_date_spine() -%}
  {{ return(adapter.dispatch('rp_date_spine', 'dabdbt')()) }}
{%- endmacro %}

{% macro duckdb__rp_date_spine() -%}
  select cast(date '2024-01-01' + cast(i as integer) as date) as date_day
  from range(0, 731) as t(i)
{%- endmacro %}

{% macro databricks__rp_date_spine() -%}
  select explode(sequence(to_date('2024-01-01'), to_date('2025-12-31'), interval 1 day)) as date_day
{%- endmacro %}

{% macro default__rp_date_spine() -%}
  select cast('2024-01-01' as date) as date_day
{%- endmacro %}
