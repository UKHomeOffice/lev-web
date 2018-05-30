FROM node:8-alpine

RUN apk add --no-cache ca-certificates python3 \
 && apk upgrade --no-cache \
 && addgroup -S app \
 && adduser -S app -G app -u 31337 -h /app/ \
 && chown -R app:app /app/

USER app
WORKDIR /app
ENV NODE_ENV production

COPY *node_modules/ package.json /app/
RUN npm install --only production > .npm-install.log 2>&1 \
 && rm .npm-install.log \
 || ( EC=$?; cat .npm-install.log; exit $EC )

COPY . /app

RUN npm run postinstall

USER root
RUN chown -R app:app .

USER 31337
ENV LISTEN_HOST="0.0.0.0" \
    PORT="8001" \
    API_PROTOCOL="http" \
    API_HOST="localhost" \
    API_PORT="8080"
CMD ["node", "."]
