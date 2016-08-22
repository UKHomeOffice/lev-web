FROM quay.io/ukhomeofficedigital/nodejs-base:v4.4.7

RUN yum clean all && \
    yum update -y && \
    yum install -y git make gcc-c++ psmisc java-1.8.0-openjdk-devel && \
    yum clean all && \
    rpm --rebuilddb && \
    mkdir -p /app/mock

WORKDIR /app
COPY ./package.json /app/
RUN npm install --quiet

COPY ./api/mock/get_latest_api_spec.sh /app/api/mock/
RUN npm run install:mockapi

COPY . /app

# Run npm install again to build /public dir
RUN npm run install:mockapi && \
    npm run postinstall && \
    npm test && \
    npm prune --production && \
    rm -rf ./api/mock && \
    yum erase -y git make gcc-c++ psmisc java-1.8.0-openjdk-devel && \
    yum clean all && \
    rpm --rebuilddb && \

    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER nodejs
CMD [ "start" ]
