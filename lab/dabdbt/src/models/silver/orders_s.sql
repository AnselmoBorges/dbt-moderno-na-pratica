{{
  config(
    alias='orders',
    materialized='incremental',
    unique_key='order_id',
    on_schema_change='fail'
  )
}}

select
    order_id,
    customer_id,
    order_status,
    order_purchase_timestamp,
    order_approved_at,
    order_delivered_carrier_date,
    order_delivered_customer_date,
    order_estimated_delivery_date
from {{ source('olist', 'orders') }}
{% if is_incremental() %}
where order_purchase_timestamp >= (
  select coalesce(max(order_purchase_timestamp), cast('1900-01-01' as timestamp))
  from {{ this }}
)
{% endif %}
