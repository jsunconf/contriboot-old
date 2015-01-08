test: jshint unit integration

jshint:
	./node_modules/jshint/bin/jshint .

unit:
	./node_modules/lab/bin/lab ./test/unit
	cd ./facets/about && npm test
	cd ./facets/submissions && npm test
	cd ./services/data && npm test

integration:
	./download-selenium.sh
	npm run bootstrap
	./node_modules/lab/bin/lab ./test/integration

.PHONY: test unit integration jshint
