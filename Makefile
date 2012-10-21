MOCHA=./node_modules/.bin/mocha
REPORTER=spec
TEST_FILES=test/*.js

test:
	@${MOCHA} -r test/index --reporter $(REPORTER) $(TEST_FILES)

test-watch:
	@${MOCHA} -r test/index --reporter $(REPORTER) $(TEST_FILES) --watch

test-coverage: generate-coverage-report
	@AUTH_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm -fR lib-cov

generate-coverage-report:
	@rm -fR lib-cov
	@jscoverage lib lib-cov

.PHONY: test test-watch test-coverage generate-coverage-report
