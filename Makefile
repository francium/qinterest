format:
	@( \
		source venv/bin/activate; \
		yapf -i qinterest/**/*.py tests/**/*.py; \
		npm run --silent format; \
	)

frontend-watch:
	npm run watch

gunicorn:
	@( \
		source venv/bin/activate; \
		source ./.env; \
		sh run.sh; \
	)

init:
	@( \
		source venv/bin/activate; \
		flask init; \
	)

install: venv
	@( \
		source venv/bin/activate; \
		pip install .; \
	)

install-dev: venv
	@( \
		source venv/bin/activate; \
		pip install -e .; \
		pip install -r requirements.dev.txt; \
		npm i; \
	)

package:
	@ echo -e "##### Building UI..."
	NODE_ENV=production npm build
	@ echo -e "\n##### Packaging application..."
	python setup.py sdist

run:
	@( \
		source venv/bin/activate; \
		flask run; \
	)

test-server:
	@( \
		source venv/bin/activate; \
		pytest tests; \
	)

test-server-watch:
	@( \
		source venv/bin/activate; \
		ptw tests --last-failed; \
	)

test-ui:
	npm run test

test-ui-watch:
	npm run test-watch

venv:
	@virtualenv venv
