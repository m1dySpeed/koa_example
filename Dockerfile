FROM node:16.14.2 as build

ARG APP_DIR=/usr/app

WORKDIR $APP_DIR

COPY . .

RUN npm ci

RUN npm run build

FROM node:16-alpine

ARG APP_DIR=/usr/app

WORKDIR $APP_DIR

ENV NODE_ENV=production

COPY --from=build $APP_DIR/package.json ./package.json

COPY --from=build $APP_DIR/package-lock.json ./package-lock.json

COPY --from=build $APP_DIR/build ./build

RUN npm install --production

CMD node ./build/src/index
