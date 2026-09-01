{% macro normalize_city_ascii(column_expr) %}
    lower(
        regexp_replace(
            regexp_replace(
                translate(trim({{ column_expr }}),
                    'ÁÀÃÂÄáàãâäÉÈÊËéèêëÍÌÎÏíìîïÓÒÕÔÖóòõôöÚÙÛÜúùûüÇç',
                    'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'
                ),
                '[^a-z0-9 ]',
                ' '
            ),
            '\\s+',
            ' '
        )
    )
{% endmacro %}
