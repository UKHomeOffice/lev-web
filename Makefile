DOCKER_IMAGE ?= lev-web

perf_test_image = quay.io/ukhomeofficedigital/artillery-ci:0.3.2
compose_network = levweb_default

probe_network = docker network ls | grep -q '$(compose_network)'

docker-compose-deps:
	docker-compose pull

docker-test-deps: docker-compose-deps
	docker pull '$(perf_test_image)'

docker:
	docker build -t '$(DOCKER_IMAGE)' .

docker-compose: docker-compose-deps docker
	docker-compose build

docker-test: docker-test-deps docker-compose-clean docker-compose
	docker-compose up &> /dev/null &
	eval $(probe_network); \
	while [ $$? -ne 0 ]; do \
		echo ...; \
		sleep 5; \
		eval $(probe_network); \
	done; true
	docker run --net '$(compose_network)' --env "TEST_CONFIG=$$(cat ./test/perf/artillery.config.yml)" --env "MEDIAN_LATENCY=500" --env "WAIT_URL=lev-web:8001/readiness" --env "TEST_URL=lev-web:8001" '$(perf_test_image)'
	docker-compose stop

docker-compose-clean:
	docker-compose stop
	docker-compose rm -vf

test: docker-test
