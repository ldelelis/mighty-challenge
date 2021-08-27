# MightyGram API

## Requirements

* NodeJS (v14 LTS was used for this)
* docker-compose

### Environment variables

The following environment variables are required for execution:

* JWT_SECRET_KEY: a randomized string used for token generation/validation

Additionally, the following environment variables can be set to alter some default behaviours:

* SERVICE_PORT: port in which the application should listen to. Defaults to `8000`
* PAGINATION_LIMIT: upper limit for each page in a paginated request. Defaults to `20`

It is recommended to use [direnv](https://direnv.net/) to manage these in an auomated manner, and to avoid incurring additional dependencies like `dotenv`.

## Getting started

1. Install dependencies: `yarn install`
2. Start external dependencies: `docker-compose up -d`
3. Start development server: `yarn dev`

### Bootstrapping the database

TypeORM requires migrations to be applied on the database before using the backend:

`yarn build && NODE_PATH=$PWD/dist/ npx typeorm migration:run`

Whenever a set of entity changes are applied, a new migration should be generated:

`yarn build && NODE_PATH=$PWD/dist/ npx typeorm migration:generate -n <migration name>`

This generates a typescript file in `src/migrations`, which should be versioned.

**NOTE**: in case of running these commands via docker-compose, suffix `-c production` to the previously referred commands

## Tests

A testing battery is setup for the project via Jest.
This battery generates a SQLite in-memory connection for performance purposes

They can be run with `yarn test`

## Database

PostgreSQL was chosen as the database engine for this exercise, mainly due to previous experience, comfort, and preference.

However, it should be noted that no part of the code directly requires PostgreSQL, so changing the underlying (relational) engine should be trivial.
