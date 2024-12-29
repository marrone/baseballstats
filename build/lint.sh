#!/bin/bash

# can pass args args to this script which are passed on directly to eslint

cd $(dirname $0)/../
pwd

set -e
#set -x

# call eslint for all js and svelte files
npx eslint -c ./build/eslint.config.js $@ ./src

# additional linting for svelte content sort order (script, html style, in that order)
files=$(find src/components -name '*.svelte')
for f in $files; do
    #echo "linting $f"
    output=$(sed -E -n -f ./build/svelte-sort-order.sed $f)
    if [ "$output" = "invalid" ]; then
        printf "\033[0;31mLINT ERROR: invalid sort order in $f, should be scriptmodule-script-html-style\033[0m\n"
        exit 1
    fi

    output=$(sed -E -n -f ./build/svelte-export-order.sed $f)
    if [ "$output" = "invalid" ]; then
        printf "\033[0;31mLINT ERROR: invalid script exports order in $f. exports should be at top of script\033[0m\n"
        exit 1
    fi
done

# lint the styles
npx stylelint "./src/components/**/*.svelte" $@
