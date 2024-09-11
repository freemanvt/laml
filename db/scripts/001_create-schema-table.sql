CREATE SCHEMA IF NOT EXISTS laml AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS laml.api_proxies (
  api_proxy_id SERIAL PRIMARY KEY, 
  uuid VARCHAR (50) UNIQUE NOT NULL, 
  name VARCHAR (50) NOT NULL, 
  basepath VARCHAR (255) NOT NULL, 
  target_server VARCHAR (255) NOT NULL, 
  description VARCHAR (255), 
  created_at TIMESTAMP NOT NULL, 
  last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS laml.api_filters (
  api_filter_id SERIAL PRIMARY KEY, 
  name VARCHAR (255) UNIQUE NOT NULL, -- this should match the module name in the code
  description VARCHAR (255), 
  created_at TIMESTAMP NOT NULL, 
  last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS laml.api_proxy_filter_types (
  api_proxy_filter_type_id SERIAL PRIMARY KEY, 
  name VARCHAR (50) UNIQUE NOT NULL, -- REQUEST, RESPONSE, USER_FLOW_REQUEST, USER_FLOW_RESPONSE
  description VARCHAR (255), 
  created_at TIMESTAMP NOT NULL, 
  last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS laml.api_user_flows (
  api_user_flow_id SERIAL PRIMARY KEY, 
  api_proxy_id INT,
  name VARCHAR (50) UNIQUE NOT NULL, 
  match_path VARCHAR (255) UNIQUE NOT NULL, 
  created_at TIMESTAMP NOT NULL, 
  last_updated TIMESTAMP NOT NULL,
  CONSTRAINT fk_api_proxies
    FOREIGN KEY(api_proxy_id) 
	    REFERENCES laml.api_proxies(api_proxy_id)
);

CREATE TABLE IF NOT EXISTS laml.api_proxy_filters (
  api_proxy_filters_id SERIAL PRIMARY KEY, 
  api_proxy_id INT,
  api_user_flow_id INT,
  api_filter_id INT,
  api_proxy_filter_type_id INT,
  position INT,
  config_json TEXT,
  created_at TIMESTAMP NOT NULL, 
  last_updated TIMESTAMP NOT NULL,
  CONSTRAINT fk_api_proxies
    FOREIGN KEY(api_proxy_id) 
	    REFERENCES laml.api_proxies(api_proxy_id)
	      ON DELETE CASCADE,
  CONSTRAINT fk_api_user_flows
    FOREIGN KEY(api_user_flow_id) 
	    REFERENCES laml.api_user_flows(api_user_flow_id)
	      ON DELETE CASCADE,
  CONSTRAINT fk_api_filters
    FOREIGN KEY(api_filter_id) 
	    REFERENCES laml.api_filters(api_filter_id)
        ON DELETE CASCADE,
  CONSTRAINT fk_api_proxy_filter_type
    FOREIGN KEY(api_proxy_filter_type_id) 
	    REFERENCES laml.api_filters(api_proxy_filter_type_id)
        ON DELETE CASCADE,
);






