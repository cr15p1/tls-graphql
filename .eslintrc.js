module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    extends: ['airbnb-typescript/base', "prettier"],
    plugins: ['prettier'],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "project": ["./packages/**/tsconfig.json"]
    },
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "rules": {
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",
        "max-len": ["error", { "code": 120, "tabWidth":2, "comments":120, "ignoreStrings": true }],
        "max-depth": ["error", 1],
        "max-statements": ["error", 5, { "ignoreTopLevelFunctions": true }],
        "import/order": ["error", {
            "newlines-between": "always",
            "pathGroups": [
                {
                    "pattern": "~/**",
                    "group": "external"
                }
            ],
            alphabetize: {
                order: 'asc',
                caseInsensitive: true
            }
        }],
        "complexity": ["error", 3],
        "prettier/prettier": "error",
    }
};
