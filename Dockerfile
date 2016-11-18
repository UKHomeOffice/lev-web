FROM quay.io/ukhomeofficedigital/nodejs-base:v6.9.1

RUN yum clean all && \
    yum update -y && \
    yum install -y git && \
    yum clean all && \
    rpm --rebuilddb

WORKDIR /app
COPY ./package.json /app/
RUN npm install --quiet

COPY . /app

# Run npm postinstall again to build /public dir
RUN npm run postinstall && \
    npm run lint && \
    npm run test:unit && \
    npm prune --production && \
    yum remove -y git && \
    yum clean all && \
    rpm --rebuilddb && \
    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER nodejs
CMD [ "start" ]
