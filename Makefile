.PHONY: build
build:
	bundle exec middleman build

.PHONY: run
run:
	 bundle exec middleman server

.PHONY: deploy
deploy:	build
	bundle exec middleman deploy
