DOCKER_IMAGE ?= lev-web

perf_test_image = quay.io/ukhomeofficedigital/artillery-ci:0.3.2

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

compose_project_name = $(current_dir)
compose_network_regexp != echo "$$(echo '$(compose_project_name)' | sed -E 's/([-_])+/[-_]*/g')_default"
probe_network = docker network ls | grep -o '$(compose_network_regexp)'

docker-compose-deps:
	docker-compose pull

docker-test-deps:
	docker pull '$(perf_test_image)'
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' pull

docker:
	docker build -t '$(DOCKER_IMAGE)' .

docker-compose: docker-compose-deps
	docker-compose build

docker-test:
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' down -v
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' build
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' up &> /dev/null &
	compose_network=`$(probe_network)`; \
	while [ $$? -ne 0 ]; do \
		echo ...; \
		sleep 5; \
		compose_network=`$(probe_network)`; \
	done; \
	docker run --net "$${compose_network}" --env "TEST_CONFIG=$$(cat ./test/perf/artillery.config.yml)" --env "MEDIAN_LATENCY=500" --env "WAIT_URL=lev-web:8001/readiness" --env "TEST_URL=lev-web:8001" '$(perf_test_image)'
	docker-compose -f docker-compose-test.yml -p '$(compose_project_name)' down -v

docker-compose-clean:
	docker-compose stop
	docker-compose rm -vf

test: docker-test

clean:
	rm -rf node_modules package-lock.json

install:
	npm install

