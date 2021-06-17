FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile
RUN yarn global add pm2

COPY ./ ./

CMD [ "yarn", "start" ]

