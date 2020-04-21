SHELL:=/bin/bash

OS := $(shell uname -s)
ifeq ($(OS),Linux)
  FIND = find
endif
ifeq ($(OS),Darwin) # Mac OS X
  FIND = gfind
endif

all: run-migrations

# If you add more commands here, make sure that they are all ran.  Heroku postbuild command is in root Procfile
pre-build:
	@echo "Running prebuild, installing dependencies"
	@yarn install && yarn build;

# install:
# 	@echo "Building app" 
# 	@yarn heroku-build;

run-migrations:
	@echo "Running migrations"
	@yarn run-migrations;
