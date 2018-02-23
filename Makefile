DOCKER_IMAGE ?= lev-web

perf_test_image = quay.io/ukhomeofficedigital/artillery-ci:0.2
compose_network = levweb_default
web_url = lev-web:8001

probe_web=curl -fs '$(web_url)/readiness' &> /dev/null

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
	eval $(probe_web); \
	while [ $$? -ne 0 ]; do \
		echo ...; \
		sleep 5; \
		eval $(probe_web); \
	done; true
	docker run --net '$(compose_network)' --env "TEST_CONFIG=$$(cat ./test/perf/artillery.config.yml)" --env "MEDIAN_LATENCY=50" '$(perf_test_image)'
	docker-compose stop

docker-compose-clean:
	docker-compose stop
	docker-compose rm -vf

test: docker-test
