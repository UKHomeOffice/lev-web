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

RUN npm run test && \
    npm prune --production && \
    yum remove -y git && \
    yum clean all && \
    rpm --rebuilddb && \
    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER nodejs
CMD [ "start" ]
