select order_id, order_item_id, count(*) as duplicate_count
from {{ ref('order_items_s') }}
group by order_id, order_item_id
having count(*) > 1
