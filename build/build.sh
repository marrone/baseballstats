#!/bin/bash

# any arguments passed to this script are passed along to the rollup commands

set -e

npx svelte-check
npx rollup --config build/rollup.config.mjs --failAfterWarnings $@
