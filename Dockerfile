# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of your app's source code
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Your application's default port
EXPOSE 3000

# Command to run your app using Node.js
CMD ["node", "dist/index.js"]
