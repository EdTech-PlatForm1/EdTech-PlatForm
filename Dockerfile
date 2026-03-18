FROM node:22.15.0

WORKDIR /app

COPY package.json  .

RUN  npm i

COPY . .

CMD [ "npm","run",'dev' ]