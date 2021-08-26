FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY src src
RUN yarn build

#####################################

FROM node:14-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache tini

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY --from=build /usr/src/app/dist dist/
