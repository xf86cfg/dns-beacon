FROM node:14-alpine as dns-beacon

WORKDIR /app

COPY ./package.json package.json
COPY ./yarn.lock yarn.lock


RUN yarn install

COPY . .

RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start"]