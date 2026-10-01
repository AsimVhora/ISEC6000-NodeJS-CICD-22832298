FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY app.js ./

EXPOSE 8080

CMD ["node", "app.js"]
