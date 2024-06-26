FROM  --platform=linux/amd64 node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN tsc

EXPOSE 3000

EXPOSE 8545

CMD ["node", "dist/index.js"]