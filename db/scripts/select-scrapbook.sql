select * from laml.api_proxies;

select * from laml.api_filters;

select * from laml.api_proxy_filter_types;

select * from laml.api_proxy_filters;

select * from laml.api_user_flows;

select p.api_proxy_id, p.uuid, p.name, p.basepath, p.target_server, p.created_at, p.last_updated, pf.api_proxy_filters_id, f.name, pf.api_proxy_filter_type_id, ft.name, pf.position, pf.config_json
from laml.api_proxies p
INNER JOIN laml.api_proxy_filters pf ON pf.api_proxy_id = p.api_proxy_id
INNER JOIN laml.api_filters f ON f.api_filter_id = pf.api_filter_id
INNER JOIN laml.api_proxy_filter_types ft ON ft.api_proxy_filter_type_id = pf.api_proxy_filter_type_id

select p.api_proxy_id, p.uuid, p.name, p.basepath, p.target_server, p.created_at, p.last_updated, pf.api_proxy_filters_id, f.name, pf.api_proxy_filter_type_id, ft.name, pf.position, pf.config_json
from laml.api_proxies p
INNER JOIN laml.api_user_flows uf ON uf.api_proxy_id = p.api_proxy_id
INNER JOIN laml.api_proxy_filters pf ON pf.api_user_flow_id = uf.api_user_flow_id
INNER JOIN laml.api_filters f ON f.api_filter_id = pf.api_filter_id
INNER JOIN laml.api_proxy_filter_types ft ON ft.api_proxy_filter_type_id = pf.api_proxy_filter_type_id