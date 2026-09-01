{% macro apply_uc_tags(relation, table_tags=None, columns=None, default_column_tags=None) %}
  {%- if target.type != 'databricks' -%}
    {{ return('') }}
  {%- endif -%}
  {%- if table_tags is not none -%}
    {%- set assignments = [] -%}
    {%- for key, value in table_tags.items() -%}
      {%- if value is not none -%}
        {%- do assignments.append("'" ~ key ~ "' = '" ~ value ~ "'") -%}
      {%- endif -%}
    {%- endfor -%}
    {%- if assignments|length > 0 -%}
      {%- set sql = "ALTER TABLE " ~ relation ~ " SET TAGS (" ~ ", ".join(assignments) ~ ")" -%}
      {%- do adapter.execute(sql, auto_begin=False) -%}
    {%- endif -%}
  {%- endif -%}

  {%- if columns is not none -%}
    {%- for col_name, col in columns.items() -%}
      {%- set col_tags = None -%}
      {%- if col.meta is defined and col.meta is not none and 'tags' in col.meta -%}
        {%- set col_tags = col.meta['tags'] -%}
      {%- elif default_column_tags is not none -%}
        {%- set col_tags = default_column_tags -%}
      {%- endif -%}
      {%- if col_tags is not none -%}
        {%- set assignments = [] -%}
        {%- for key, value in col_tags.items() -%}
          {%- if value is not none -%}
            {%- do assignments.append("'" ~ key ~ "' = '" ~ value ~ "'") -%}
          {%- endif -%}
        {%- endfor -%}
        {%- if assignments|length > 0 -%}
          {%- set sql = "ALTER TABLE " ~ relation ~ " ALTER COLUMN " ~ adapter.quote(col_name) ~ " SET TAGS (" ~ ", ".join(assignments) ~ ")" -%}
          {%- do adapter.execute(sql, auto_begin=False) -%}
        {%- endif -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endif -%}

  {{ return('') }}
{% endmacro %}
