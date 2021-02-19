FROM node:12

WORKDIR /app

COPY ./build/package*.json ./
COPY ./build/yarn.lock ./

RUN yarn

COPY ./build .

ENV PORT=8080

EXPOSE 8080

CMD [ "node","server.js" ]
