module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "rules": {
        // Erreurs et bonnes pratiques
        "no-console": "warn",
        "no-unused-vars": "error",
        "no-undef": "error",
        "no-var": "error",
        "prefer-const": "warn",
        "no-empty": "error",
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "no-trailing-spaces": "error",
        "eqeqeq": ["error", "always"],
        "no-return-await": "error",

        // Style de code
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single", { "avoidEscape": true }],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        "arrow-parens": ["error", "always"],
        "space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "object-curly-spacing": ["error", "always"],

        // Asynchrone
        "require-await": "error",
        "no-async-promise-executor": "error"
    }
};
