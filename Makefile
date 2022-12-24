build:
	bundle exec jekyll build

serve:
	bundle exec jekyll serve

serve-prod:
	JEKYLL_ENV=production bundle exec jekyll serve

prettier:
	npx prettier --write .

lint:
	npx eslint --cache --fix .
