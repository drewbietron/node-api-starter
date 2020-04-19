SHELL:=/bin/bash

OS := $(shell uname -s)
ifeq ($(OS),Linux)
  FIND = find
endif
ifeq ($(OS),Darwin) # Mac OS X
  FIND = gfind
endif

all: install-dependencies run-migrations

# If you add more commands here, make sure that they are all ran.  Heroku postbuild command is in root Procfile
install-dependencies:
	@echo "Installing dependencies"
	@yarn install && yarn global add sequelize-cli && yarn build;

run-migrations:
	@echo "Running migrations"
	@yarn run-migrations;
