build:
	bundle exec jekyll build

serve:
	bundle exec jekyll serve

prettier:
	npx prettier --write .

lint:
	npx eslint --cache --fix .
