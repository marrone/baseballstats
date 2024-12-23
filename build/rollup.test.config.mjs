import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import multi from "@rollup/plugin-multi-entry";
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
import { sveltePreprocess } from 'svelte-preprocess';
//import istanbul from 'rollup-plugin-istanbul';
import css from 'rollup-plugin-css-only';
//import svelteWarnings from './svelte-warnings.cjs';
import childProcess from "child_process";
//import { istanbulPreprocess, printCompiledSvelteFile, writeTestSourceFile } from "./testCoverage.cjs";

const coverage = !!process.env.TEST_COVERAGE;

export default {
    input: 'tests/spec/**/*-spec.js',
	output: {
		sourcemap: false,
		format: 'es', // "amd", "cjs", "system", "es", "iife" or "umd".
        interop: "compat",
		name: 'tests',
		dir: 'tests/build/'
	},
	plugins: [
        multi({exports: false}),
        svelte({
            //onwarn: svelteWarnings.handleWarnings,
            compilerOptions: {dev: false, css: 'external'},
            preprocess: [sveltePreprocess({ })],
        }),
        css({output: false}),
        commonjs(),
        json(),
        strip({
            functions: ['console.*', 'console.log', 'console.log.*', 'console.dir', 'console.dir.*', 'assert.*'],
            sourceMap: false,
        }),
        /*
        coverage && {
            transform: function(code, id) {
                if(id.endsWith('.svelte')) {
                    code = istanbulPreprocess(code);
                    //if(id.endsWith('FormInput.svelte')) { printCompiledSvelteFile(code, id); }
                    writeTestSourceFile(code, id);
                }
                return { code: code, map: null };
            },
        },
        */
        //coverage && istanbul({
            //"exclude": ['**/*.json', 'tests/**/*.js']
        //}),
	],
    onwarn(warning, warn) {
        if(warning.code === 'UNRESOLVED_IMPORT' || warning.pluginCode === 'unused-export-let') { return; }
        warn(warning);
	}
};
