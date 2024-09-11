# LAML
Lightweight API Management Layer provides a framework that allows you to create API proxies wrapping your backend APIs or Micro Services.

## Required

- Node 18+
- Docker and Docker compose

## Goal

- Allow you to create and run API proxies during runtime, an API proxy is a wrapper round a backend endpoint.
- Let you create reusable filters such as API key validation, security, caching, traffic management, logging, mediation etc that can be added 
to different request and response flows.

## Status

I won't have time to work on this for a while so thought I will put it out there for other to use, update, improve, build on etc. The code is at quite an early stage with a lot of features missing or areas that can be improved before being used in a proper production environment. However the main flow is there where you can create an API proxy round an endpoint and hit it.

- Added Postgres Database and schema. 
- Added Prisma ORM to interact with database.
- Added Redis cache for Caching filter.

## Build
Download the code by cloning this repository

> git clone https://github.com/freemanvt/laml

Then install all the dependencies

> npm install

## Database
The code can run with or without a database running. 

To run with a new database you can use Prisma CLI to create the schema.

1. create a new Database
2. create a new Schema called laml
3. update .env with the new details
4. run 

> ./node_modules/.bin/prisma migrate dev -n init (Please see the Prisma documentation for more info)

5. generate a Prisma client run 

> ./node_modules/.bin/prisma generate (Please see the Prisma documentation for more info)

Or you can install the sql scripts in the db/scripts folder.

After creating the Schema, you need to insert the ref data from /db/scripts/002_ref-data.sql

## To Run

Start the redis server and database using docker compose

> docker compose up

To Run with database

> npm run dev

To run without database

> npm run devnodb


## Creating New API Proxy

TBA

## Creating New Filters

TBA


