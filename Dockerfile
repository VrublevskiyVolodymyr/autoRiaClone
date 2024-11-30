FROM node:20-alpine

MAINTAINER Volodymyr Vrublevskyi

RUN mkdir /app
WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install

COPY . /app


