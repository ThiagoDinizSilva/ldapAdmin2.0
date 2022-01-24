FROM node:14-alpine

WORKDIR /opt

COPY package.json yarn.lock /opt/

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]