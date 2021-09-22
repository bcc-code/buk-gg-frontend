module.exports = {
    "defaultSeverity": "warning",
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript'
    ],
    "linterOptions": {
        "exclude": ["node_modules/**"]
    },
    "rules": {
        "quotemark": [true, "single"],
        "indent": [true, "spaces", 2],
        "interface-name": false,
        "ordered-imports": false,
        "object-literal-sort-keys": false,
        "no-consecutive-blank-lines": false,
        "max-line-length": [true, 256]
    }
}
