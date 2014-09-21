test: jshint unit integration

jshint:
	./node_modules/jshint/bin/jshint .

unit:
	npm i
	cd ./facets/about && npm i && npm test
	cd ./facets/submissions && npm i && npm test

integration:
	./download-selenium.sh
	npm run bootstrap
	./node_modules/lab/bin/lab ./test/integration

.PHONY: test unit integration jshint
