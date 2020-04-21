SHELL:=/bin/bash

OS := $(shell uname -s)
ifeq ($(OS),Linux)
  FIND = find
endif
ifeq ($(OS),Darwin) # Mac OS X
  FIND = gfind
endif

# all: pre-build run-migrations
prebuild: install-dependencies build
postbuild: run-migrations

# If you add more commands here, make sure that they are all ran.  Heroku postbuild command is in root Procfile
install-dependencies:
	@echo "Installing dependencies"
	@yarn install;

build: 
	@echo "Building App"
	@yarn heroku-build	
	
run-migrations:
	@echo "Running migrations"
	@yarn global add sequelize-cli && yarn run-migrations;
