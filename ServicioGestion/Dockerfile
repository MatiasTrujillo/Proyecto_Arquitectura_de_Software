FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node_modules/.bin/ts-node", "src/index.ts"]
