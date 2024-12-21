# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /thriftbids/
COPY public/ /thriftbid/public
COPY src/ /thriftbid/src
COPY package.json /thriftbid/
RUN npm install
CMD ["npm", "start"]