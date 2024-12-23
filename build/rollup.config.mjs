import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { sveltePreprocess } from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
//import svelteWarnings from './svelte-warnings.cjs';
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
    //onwarn: svelteWarnings.handleWarnings,
	plugins: [
        svelte({
            preprocess: [
                sveltePreprocess({
                    postcss: postcssConfig({options: {map: true}}),
                })
            ],
            //onwarn: svelteWarnings.handleWarnings,
            // enable run-time checks when not in production
            compilerOptions: {
                dev: !production,
            },
        }),

        css({output: (styles, styleNodes) => {
            // we'll extract any component CSS out into
            // a separate file better for performance
            let outfile = 'public/build/main' + (production ? '.min' : '') + '.css';
            fs.writeFileSync(outfile, styles);
            /*
            let bundlefile = 'public/build/bundle' + (production ? '.min' : '') + '.css';
            childProcess.exec(`build/css.sh ${outfile} ${bundlefile}`, (error, stdout, stderr) => {
                if(error) { console.error(error); }
                if(stderr) { console.error(stderr); }
                console.log(stdout);
            });
            */
        }}),    
            
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration 
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript(),

        // strip console.log, etc
        production && strip({
            functions: ['console.*', 'console.log.*', 'console.dir.*', 'assert.*']
        }),

        babel({
            babelrc: true,
            babelHelpers: 'bundled',
            extensions: ['.js', '.mjs', '.html', '.svelte'],
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        watch && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        watch && liveReload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        // see: https://github.com/terser/terser#minify-options
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
