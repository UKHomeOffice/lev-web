#! /bin/bash

PERF_IMG=quay.io/ukhomeofficedigital/artillery-ci:0.2

#Pull the artillery image
docker pull $PERF_IMG;

npm run start:mock-kc-proxy &> /dev/null &
npm run start:mockapi &> /dev/null & npm start &> /dev/null & docker run --net=host --env "TEST_CONFIG=$(cat ./test/perf/artillery.config.yml)" --env "MEDIAN_LATENCY=50" $PERF_IMG;
