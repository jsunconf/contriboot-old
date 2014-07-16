test:
	./download-selenium.sh
	cd ./facets/about && npm i && npm test
	cd ./facets/submissions && npm i && npm test
	npm run bootstrap
	./node_modules/lab/bin/lab ./test/integration

.PHONY: test
