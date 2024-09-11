-- insert static data ------

-- insert api proxy filter types

INSERT INTO laml.api_proxy_filter_types (name, description, created_at, last_updated) VALUES ('REQUEST', 'Request flow type', NOW(), NOW());
INSERT INTO laml.api_proxy_filter_types (name, description, created_at, last_updated) VALUES ('RESPONSE', 'Response flow type', NOW(), NOW());
INSERT INTO laml.api_proxy_filter_types (name, description, created_at, last_updated) VALUES ('USER_FLOW_REQUEST', 'User flow request flow type', NOW(), NOW());
INSERT INTO laml.api_proxy_filter_types (name, description, created_at, last_updated) VALUES ('USER_FLOW_RESPONSE', 'User flow response flow type', NOW(), NOW());

-- insert basic filters

INSERT INTO laml.api_filters (name, description, created_at, last_updated) VALUES ('ApiKeyValidationFilter', 'Filter to perform Api Key Validation', NOW(), NOW());
INSERT INTO laml.api_filters (name, description, created_at, last_updated) VALUES ('AddQueryParameter', 'Filter to add query parameters', NOW(), NOW());
INSERT INTO laml.api_filters (name, description, created_at, last_updated) VALUES ('ResponseCache', 'Filter to check the response cache and return if found', NOW(), NOW());
INSERT INTO laml.api_filters (name, description, created_at, last_updated) VALUES ('ResponseCacheResponse', 'Filter to add the response to the response cache', NOW(), NOW());
INSERT INTO laml.api_filters (name, description, created_at, last_updated) VALUES ('ExampleUserFilter', 'Example user filter', NOW(), NOW());

-- insert test proxy

INSERT INTO laml.api_proxies(uuid, name, basepath, target_server, description, created_at, last_updated)
VALUES (gen_random_uuid(), 'httpbin-demo', '/v1/httpbin', 'https://httpbin.org', 'httpbin test endpoint, resend request to http://localhost:8000/v1/httpbin/get', NOW(), NOW());

---- request filters

INSERT INTO laml.api_proxy_filters(api_proxy_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 1, 1, 1, '{ "apiKeyName": "apikey" }', NOW(), NOW());
INSERT INTO laml.api_proxy_filters(api_proxy_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 2, 1, 2, '{ "params": [{ "key": "username", "value": "John"}, { "key": "surname", "value": "Doe"}] }', NOW(), NOW());
INSERT INTO laml.api_proxy_filters(api_proxy_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 3, 1, 3, '', NOW(), NOW());

---- response filters

INSERT INTO laml.api_proxy_filters(api_proxy_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 4, 2, 1, '', NOW(), NOW());
INSERT INTO laml.api_proxy_filters(api_proxy_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 5, 2, 2, '', NOW(), NOW());

---- user flows

INSERT INTO laml.api_user_flows(name, match_path, created_at, last_updated)
VALUES ('example user defined flow', '/get', NOW(), NOW());

---- user flows request filters

INSERT INTO laml.api_proxy_filters(api_user_flow_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 5, 3, 1, '', NOW(), NOW());

---- user flows response filters

INSERT INTO laml.api_proxy_filters(api_user_flow_id, api_filter_id, api_proxy_filter_type_id, position, config_json, created_at, last_updated)
VALUES (1, 5, 3, 1, '', NOW(), NOW());
