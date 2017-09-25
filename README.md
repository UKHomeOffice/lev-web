# LEV Front End

[![Build Status](https://travis-ci.org/UKHomeOffice/lev-web.svg?branch=master)](https://travis-ci.org/UKHomeOffice/lev-web)
[![Build Status](https://drone.digital.homeoffice.gov.uk/api/badges/UKHomeOffice/lev-web/status.svg)](https://drone.digital.homeoffice.gov.uk/UKHomeOffice/lev-web)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The following tools are needed to install the software
- NodeJS / NPM

### Installing
```bash
npm install
```

## Running the tests

### Locally
```bash
npm test
```

### Acceptance tests against a server
```bash
ENV=dev TEST_URL=http://lev-web-dev.dsp.notprod.homeoffice.gov.uk USERNAME=xxxx PASSWORD=xxxx npm run chimp
```
OR
```
docker build -f ./E2E_test_Dockerfile -t lev-web-e2e-tests .
docker run --rm -e ENV=dev -e TEST_URL=http://lev-web-dev.dsp.notprod.homeoffice.gov.uk -e USERNAME=xxxx -e PASSWORD=xxxx lev-web-e2e-tests
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## License

This project is licensed under the GPLv2 License - see the [LICENSE.md](LICENSE.md) file for details
