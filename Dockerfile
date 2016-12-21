FROM quay.io/ukhomeofficedigital/nodejs-base:v6.9.1

RUN yum clean -q all && \
    yum update -y -q && \
    yum install -y -q git && \
    yum clean -q all && \
    rpm --rebuilddb --quiet

WORKDIR /app
COPY ./package.json /app/
RUN npm install --only production > .npm-install.log 2>&1 && rm .npm-install.log || ( EC=$?; cat .npm-install.log; exit $EC )

COPY . /app

RUN ( npm prune --production > .npm-prune.log 2>&1 && rm .npm-prune.log || ( EC=$?; cat .npm-prune.log; exit $EC ) ) && \
    yum clean -q all && \
    yum remove -y -q git && \
    yum update -y -q && \
    yum clean -q all && \
    rpm --rebuilddb --quiet && \
    chown -R nodejs:nodejs .

ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 8001

USER nodejs
CMD [ "start" ]
