#!/bin/bash

# generates the unit-tests build

set -e

cd $(dirname $0)/../

rm -Rf tests/build/* 
npx rollup --config ./build/rollup.test.config.mjs --failAfterWarnings 
npx strip-debug 'tests/build/multi-entry.js' > /tmp/test$$ 
mv /tmp/test$$ 'tests/build/multi-entry.js'
