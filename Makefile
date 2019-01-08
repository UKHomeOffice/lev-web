DOCKER_IMAGE ?= lev-web

perf_test_image = quay.io/ukhomeofficedigital/artillery-ci:0.3.2

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

compose_project_name = $(current_dir)
compose_network != echo "$$(echo '$(compose_project_name)' | tr -d '[\-_]')_default"
probe_network = docker network ls | grep -q '$(compose_network)'

docker-compose-deps:
	docker-compose pull

docker-test-deps: docker-compose-deps
	docker pull '$(perf_test_image)'

docker:
	docker build -t '$(DOCKER_IMAGE)' .

docker-compose: docker-compose-deps docker
	docker-compose build

docker-test: docker-test-deps docker
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' stop
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' rm -vfs
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' down -v
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' pull
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' build
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' up &> /dev/null &
	eval $(probe_network); \
	while [ $$? -ne 0 ]; do \
		echo ...; \
		sleep 5; \
		eval $(probe_network); \
	done; true
	docker run --net '$(compose_network)' --env "TEST_CONFIG=$$(cat ./test/perf/artillery.config.yml)" --env "MEDIAN_LATENCY=500" --env "WAIT_URL=lev-web:8001/readiness" --env "TEST_URL=lev-web:8001" '$(perf_test_image)'
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' down -v

docker-compose-clean:
	docker-compose stop
	docker-compose rm -vf

test: docker-test
