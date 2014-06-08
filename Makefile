test:
	cd ./facets/about && npm i && npm test
	cd ./facets/ci && npm i && npm test

.PHONY: test
