FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY src src
RUN yarn build

#####################################

FROM node:14-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN apk add --no-cache tini

COPY package.json yarn.lock ormconfig.json ./
RUN yarn install --prod --frozen-lockfile

COPY --from=build /usr/src/app/dist dist/
