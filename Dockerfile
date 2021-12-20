FROM node:slim

COPY package.json /package.json
COPY package-lock.json /package-lock.json
RUN npm install

COPY app.js /app.js
COPY public /public

RUN mkdir -p /save

EXPOSE 8080

CMD ["npm", "start"]