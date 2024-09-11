-- CreateTable
CREATE TABLE "api_filters" (
    "api_filter_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "api_filters_pkey" PRIMARY KEY ("api_filter_id")
);

-- CreateTable
CREATE TABLE "api_proxies" (
    "api_proxy_id" SERIAL NOT NULL,
    "uuid" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "basepath" VARCHAR(255) NOT NULL,
    "target_server" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "api_proxies_pkey" PRIMARY KEY ("api_proxy_id")
);

-- CreateTable
CREATE TABLE "api_proxy_filter_types" (
    "api_proxy_filter_type_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "api_proxy_filter_types_pkey" PRIMARY KEY ("api_proxy_filter_type_id")
);

-- CreateTable
CREATE TABLE "api_proxy_filters" (
    "api_proxy_filters_id" SERIAL NOT NULL,
    "api_proxy_id" INTEGER,
    "api_user_flow_id" INTEGER,
    "api_filter_id" INTEGER,
    "api_proxy_filter_type_id" INTEGER,
    "position" INTEGER,
    "config_json" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "api_proxy_filters_pkey" PRIMARY KEY ("api_proxy_filters_id")
);

-- CreateTable
CREATE TABLE "api_user_flows" (
    "api_user_flow_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "match_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,
    "api_proxy_id" INTEGER,

    CONSTRAINT "api_user_flows_pkey" PRIMARY KEY ("api_user_flow_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_filters_name_key" ON "api_filters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "api_proxies_uuid_key" ON "api_proxies"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "api_proxy_filter_types_name_key" ON "api_proxy_filter_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "api_user_flows_name_key" ON "api_user_flows"("name");

-- CreateIndex
CREATE UNIQUE INDEX "api_user_flows_match_path_key" ON "api_user_flows"("match_path");

-- AddForeignKey
ALTER TABLE "api_proxy_filters" ADD CONSTRAINT "fk_api_filters" FOREIGN KEY ("api_filter_id") REFERENCES "api_filters"("api_filter_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "api_proxy_filters" ADD CONSTRAINT "fk_api_proxies" FOREIGN KEY ("api_proxy_id") REFERENCES "api_proxies"("api_proxy_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "api_proxy_filters" ADD CONSTRAINT "fk_api_proxy_filter_type" FOREIGN KEY ("api_proxy_filter_type_id") REFERENCES "api_proxy_filter_types"("api_proxy_filter_type_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "api_proxy_filters" ADD CONSTRAINT "fk_api_user_flows" FOREIGN KEY ("api_user_flow_id") REFERENCES "api_user_flows"("api_user_flow_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "api_user_flows" ADD CONSTRAINT "fk_api_proxies" FOREIGN KEY ("api_proxy_id") REFERENCES "api_proxies"("api_proxy_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

