install:
	npm i

develop:
	npm run develop

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test
