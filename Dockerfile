FROM node:16-alpine

# Install build tools to compile native addons
RUN apk add --no-cache python3 make g++

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# If you have post-install scripts for rebuilding modules, run them
# RUN npm rebuild or any specific build commands for your project

# Install TypeScript globally
RUN npm install -g typescript

COPY . .

RUN tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]