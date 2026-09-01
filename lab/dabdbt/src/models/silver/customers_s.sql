{{ config(alias='customers') }}

with source as (
    select
        cast(customer_id as string) as customer_id,
        cast(customer_unique_id as string) as customer_unique_id,
        lpad(cast(customer_zip_code_prefix as string), 5, '0') as customer_zip_code_prefix,
        trim(customer_city) as customer_city_raw,
        upper(trim(customer_state)) as customer_state,
        {{ normalize_city_ascii('customer_city') }} as city_ascii
    from {{ source('olist', 'customers') }}
),
enriched as (
    select
        s.customer_id,
        s.customer_unique_id,
        cast(s.customer_zip_code_prefix as string) as customer_zip_code_prefix,
        coalesce(m.municipio_upper, upper(s.customer_city_raw)) as customer_city,
        s.customer_state,
        m.latitude as customer_latitude,
        m.longitude as customer_longitude
    from source s
    left join {{ ref('ibge_municipios') }} m
      on s.city_ascii = m.municipio_ascii
     and s.customer_state = m.uf
)

select
    customer_id,
    customer_unique_id,
    customer_zip_code_prefix,
    customer_city,
    customer_state,
    customer_latitude,
    customer_longitude
from enriched
