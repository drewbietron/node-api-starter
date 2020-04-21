SHELL:=/bin/bash

OS := $(shell uname -s)
ifeq ($(OS),Linux)
  FIND = find
endif
ifeq ($(OS),Darwin) # Mac OS X
  FIND = gfind
endif

all: install build run-migrations

# If you add more commands here, make sure that they are all ran.  Heroku postbuild command is in root Procfile
install:
	@echo "Installing dependencies"
	@yarn install;

install:
	@echo "Building app" 
	@yarn build;

run-migrations:
	@echo "Running migrations"
	@yarn run-migrations;
