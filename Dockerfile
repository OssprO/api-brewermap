FROM node:latest

MAINTAINER	Osiel Hernandez

ENV 		NODE_ENV=production 
ENV 		MONGO_HOST=mongo

COPY 		. /src

WORKDIR 	/src

RUN			npm install

EXPOSE		3000

ENTRYPOINT	["npm", "start"]