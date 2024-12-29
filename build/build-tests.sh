#!/bin/bash

# generates the unit-tests build

set -e

cd $(dirname $0)/../

rm -Rf tests/build/* 
npx rollup --config ./build/rollup.test.config.mjs --failAfterWarnings 
