test:
	cd ./facets/about && npm i && npm test
	cd ./facets/submissions && npm i && npm test

.PHONY: test
