import globals from "globals";
import { shouldIgnore } from "./handleWarnings.js";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

let indentRule = ["error", 4, {
    "MemberExpression": "off",
    "ignoreComments": true,
    "SwitchCase": 1,
    "flatTernaryExpressions": true,
}];

//export default tseslint.config(
export default [
    ...[
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ].map(conf => ({
        ...conf,
        files: ['src/scripts/**/*.ts'],
    })),
    //'plugin:svelte/recommended',
    {
        files: ["src/scripts/**/*.ts"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: {
            svelte: {
                "ignore-warnings": function(warning) {
                    if(shouldIgnore(warning)) {
                        return true;
                    }
                    return false;
                },
            }
        },
        rules: {
            "indent": indentRule,
            "prefer-const": ["off"],
            "@typescript-eslint/no-explicit-any": ["off"],
            "no-console": ["off"],
            "no-useless-escape": ["off"],
            "no-prototype-builtins": ["off"],
            "no-empty": ["off"],
            "no-constant-binary-expression": "error",
            "linebreak-style": [
                "error",
                "unix"
            ],
            "quotes": [
                "off",
                "double"
            ],
            "semi": [
                "error",
                "always"
            ]
        }
    },
];
//);
