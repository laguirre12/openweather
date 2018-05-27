module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },

  // common rules recommended by eslint are enforced
  "extends": [
    "eslint:recommended",
  ],

  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    },
    "sourceType": "module"
  },

  "plugins": ["jsdoc"],

  "rules": {
    "no-console": "warn",         // only warn when using console methods
    "no-eval": "error",           // do not allow use of eval()
    "prefer-const": "error",      // prefer using const for all vars.
    "no-script-url": "error",     // do not allow javascript calls in URL's
    "default-case": "warn",       // have default case in switch
    "no-extra-bind": "warn",      // warn on useless .bind()'s
    "no-invalid-this": "error",   // no this outisde class or classlike objects
    "no-throw-literal": "error",  // do not throw string literals as errors
    "semi": ["error","always"],   // always use semi-colons
    "quotes": ["error","single"], // use single quotes
    "linebreak-style": ["error", "unix"],  // use unix linebreaks

    "indent": [ "error", 2, {   // require 2 spaces for indent size
      "SwitchCase": 1
    }],

    "valid-jsdoc": [ "warn", {      // enforce valid jsdoc. comments dont require
      "requireReturn": false,       // return statement for all functions
      "requireReturnType": true,
    }],

    "no-magic-numbers": ["warn", {  // no special numbers, except for array indx.
      "ignoreArrayIndexes": true
    }],

    "yoda": ["error","never", {    // var. must appear before literal in comps.
      "exceptRange": true          // except for when used in range comparisons
    }],

    "max-len": ["warn", {          // max line-length of 80, ignore for urls,
        "code": 80,                // strings, and template-literals
        "tabWidth": 2,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
    }],

    "space-before-function-paren": [ "error", {
        "named": "never",
        "anonymous": "always",
        "asyncArrow": "always"
    }],

    // jsdoc plugin (https://github.com/gajus/eslint-plugin-jsdoc) rules below

    "jsdoc/check-param-names": 1,  // param names match those in function
    "jsdoc/check-tag-names": 1,    // checks for valid jsdoc tags
    "jsdoc/check-types": 1,        // reports invalid types
    //"jsdoc/newline-after-description": 0,  // off
    //"jsdoc/no-undefined-types": 1,
    //"jsdoc/require-description-complete-sentence": 1,
    //"jsdoc/require-example": 0,                           // each function needs an @example tag (off)
    //"jsdoc/require-hyphen-before-param-description": 0,   // (off)
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 1,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-returns-description": 1,
    "jsdoc/require-returns-type": 1,
    "jsdoc/valid-types": 1
  }
};
