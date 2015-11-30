FROM node:4-onbuild

WORKDIR /usr/src/app
RUN npm install

CMD ["node", "app.js"]
