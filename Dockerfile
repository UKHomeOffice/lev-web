FROM quay.io/ukhomeofficedigital/nodejs-base:v6

RUN yum clean -q all && \
    yum update -y -q && \
    yum install -y -q git && \
    yum clean -q all && \
    rpm --rebuilddb --quiet

WORKDIR /app
COPY ./package.json /app/
ENV NODE_ENV production
RUN npm install --only production > .npm-install.log 2>&1 && rm .npm-install.log || ( EC=$?; cat .npm-install.log; exit $EC )

COPY . /app

RUN npm run postinstall && \
    yum clean -q all && \
    yum remove -y -q git && \
    yum update -y -q && \
    yum clean -q all && \
    rpm --rebuilddb --quiet && \
    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER 998
CMD [ "start" ]
