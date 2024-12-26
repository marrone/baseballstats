import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import multi from "@rollup/plugin-multi-entry";
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { sveltePreprocess } from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import { handleWarnings } from "./handleWarnings.js";

export default {
    input: 'tests/spec/**/*-spec.ts',
	output: {
		sourcemap: true,
		format: 'es', // "amd", "cjs", "system", "es", "iife" or "umd".
        interop: "compat",
		name: 'tests',
		dir: 'tests/build/'
	},
	plugins: [
        multi({exports: false}),
        svelte({
            compilerOptions: {dev: false, css: 'external'},
            preprocess: [sveltePreprocess({ })],
        }),
        css({output: false}),
        commonjs(),
        typescript({tsconfig: "tsconfig.tests.json"}),
        json(),
        strip({
            functions: ['console.*', 'console.log', 'console.log.*', 'console.dir', 'console.dir.*', 'assert.*'],
            sourceMap: false,
        }),
	],
    onwarn: handleWarnings,
};
