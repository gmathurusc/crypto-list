#!/usr/bin/env bash

set -x

git checkout master
git pull origin master
git push heroku master

