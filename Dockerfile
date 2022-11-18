FROM node:16.18.1-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install -g prisma typescript ts-node @nestjs/cli


RUN npm ci

COPY . .

EXPOSE 4001

RUN npm run prisma:generate

CMD ["npm", "run", "start"]