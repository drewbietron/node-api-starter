SHELL:=/bin/bash

OS := $(shell uname -s)
ifeq ($(OS),Linux)
  FIND = find
endif
ifeq ($(OS),Darwin) # Mac OS X
  FIND = gfind
endif

all: pre-build run-migrations

# If you add more commands here, make sure that they are all ran.  Heroku postbuild command is in root Procfile
pre-build:
	@echo "Installing dependencies"
	@yarn install;

# install:
# 	@echo "Building app" 
# 	@yarn heroku-build;

run-migrations:
	@echo "Running migrations"
	@yarn run-migrations;
