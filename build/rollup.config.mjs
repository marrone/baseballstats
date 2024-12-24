import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { sveltePreprocess } from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import fs from "fs";
import postcssConfig from './postcss.config.cjs';
import childProcess from 'child_process';
import liveReload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';

const production = process.env.NODE_ENV === 'production';
const watch = !!process.env.ROLLUP_WATCH;

export default {
	input: 'src/scripts/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'TruMedia.core',
        file: 'public/build/main' + (production ? '.min' : '') + '.js',
	},
	plugins: [
        svelte({
            preprocess: [
                sveltePreprocess({
                    postcss: postcssConfig({options: {map: true}}),
                })
            ],
            compilerOptions: {
                dev: !production,
            },
        }),

        css({output: (styles, styleNodes) => {
            let outfile = 'public/build/main' + (production ? '.min' : '') + '.css';
            fs.writeFileSync(outfile, styles);
        }}),    

        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript(),

        production && strip({
            functions: ['console.*', 'console.log.*', 'console.dir.*', 'assert.*']
        }),

        babel({
            babelrc: true,
            babelHelpers: 'bundled',
            extensions: ['.js', '.mjs', '.html', '.svelte'],
        }),

        watch && serve(),

        watch && liveReload('public'),

        production && terser({safari10: true})
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				childProcess.spawn('npm', ['run', 'start'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
