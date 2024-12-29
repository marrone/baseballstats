# TruMedia Networks Project - Core

Intended to explore prototyping and front end development in a sports analytics context.
Create an interactive tool that helps the user understand an MLB batter's performance over time.

Potential questions this tool was designed to answer:

From a media perspective:

    * How does a player compare vs others (potential fantasy league pickup decisions)

From a team's/coach/athlete's perspective:

    * How does a player perform in certain situations (eg home vs away)
    * How heavily correlated are the team's wins if a certain player stays under or over some threshold in anohter stat
    * How are the player's stats trending since some milestone or event (using a marker to denote this on the graph)

## Requirements

* Node v20 or greater
* Linux/Mac to build the project 
    * (utilizes some bash scripts and unix tools, which may work in Windows powershell, but untested)

## Setup

* Copy src/scripts/config.example.ts to src/scripts/config.ts
* Fill in your api key on config.ts

## Commands

* `npm run dev` to create a dev build (unminified)
* `npm run prod` to create a production build
* `npm run test` to run the unit tests
* `npm run lint` to lint the source code (and `npm run lint --fix` to auto correct any linting issues)

## Tech Stack

* [Typescript](ttps://www.typescriptlang.org/)
* [Svelte](https://svelte.dev/) - for reactive UI rendering
* [Sass](https://sass-lang.com/) - styles
* [D3](https://d3js.org/) - graph visualizations
* [Mocha](https://mochajs.org/)/[Chai](https://www.chaijs.com/)/[Sinon](https://sinonjs.org/) - unit tests
* [Rollup](https://rollupjs.org/) - bundler
* [Eslint](https://eslint.org/)/[Stylelint](https://stylelint.io/) - source code linting

## Source Code

* src/scripts/main.ts - entry point of the app
* src/scripts/config.ts - app configuration, including api key
* src/scripts/ - classes/models
* src/components/ - svelte UI
* tests/spec - unit tests
* tests/fixtures - sample test data
* tests/scripts - utility scripts/functions used in tests
* build/ - build scripts and configuration files
* public/build/ - build output directory
* public/index.html - load the built app in the browser
