FROM node:4.2

RUN useradd -d /app app
RUN mkdir -p /app
RUN chown app:app /app

USER app
WORKDIR /app

COPY . /app
RUN npm install

CMD [ "npm", "start" ]
