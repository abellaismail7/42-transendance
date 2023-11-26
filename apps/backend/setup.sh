#!/bin/bash

mkdir -p /Users/fael-bou/goinfre/backend/node_modules
mkdir -p ~/goinfre/trans/node_modules/
mkdir -p ~/goinfre/trans/Containers/
pg_ctl -D db -l .dblogfile start 