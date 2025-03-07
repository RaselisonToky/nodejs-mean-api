module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "spaced-comment": ["off"],
        "quotes": ["error", "single", { "avoidEscape": true }],
        "require-jsdoc": "off",
        "no-unused-expressions": "off",
        "no-trailing-spaces": "off",
    }
};
