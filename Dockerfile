FROM node:4-onbuild

VOLUME ["/usr/src/app"]

RUN npm install

EXPOSE 4000

WORKDIR /usr/src/app

CMD ["node", "app.js"]
