FROM quay.io/ukhomeofficedigital/nodejs-base:v4.4.2

RUN yum clean all && \
    yum update -y && \
    yum install -y git && \
    yum clean all && \
    rpm --rebuilddb

RUN mkdir -p /app/mock

WORKDIR /app/api/mock
COPY ./api/mock/package.json /app/api/mock/
RUN npm install

WORKDIR /app
COPY ./package.json /app/
RUN npm install

COPY . /app

# Run npm install again to build /public dir
RUN npm run postinstall && \
    npm test && \
    npm prune --production && \
    rm -rf ./api/mock && \

    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER nodejs
CMD [ "start" ]
