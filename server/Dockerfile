FROM node:14.17.6

WORKDIR /usr/src/app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]