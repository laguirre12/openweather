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

  "plugins": [],

  "rules": {
    "no-console": "warn",       // only warn when using console methods
    "no-eval": "error",         // do not allow use of eval()
    "prefer-const": "error",    // prefer using const for all vars.
    "no-script-url": "error",   // do not allow javascript calls in URL's
    "default-case": "warn",     // have default case in switch
    "no-extra-bind": "warn",    // warn on useless .bind()'s
    "no-invalid-this": "error", // no this outisde class or classlike objects
    "indent": [                 // require 2 spaces for indent size
      "error",
      2,
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [        // use unix linebreaks
      "error",
      "unix"
    ],
    "quotes": [                 // use single quotes
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "valid-jsdoc": [            // enforce valid jsdoc. comments dont require
      "warn",                   // return statement for all functions
      {
        "requireReturn": false,
        "requireReturnType": true,
      }
    ],
    "no-magic-numbers": [       // no special numbers, except for array indx.
      "warn",
      { "ignoreArrayIndexes": true }
    ],
    "yoda": [                   // var. must appear before literal in comps.
      "error",                  // except for when used in range comparisons
      "never",
      { "exceptRange": true }
    ],
    "max-len": [                // max line-length of 80, ignore for urls,
      "warn",                   // strings, and template-literals
      {
        "code": 80,
        "tabWidth": 2,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "space-before-function-paren": [ "error", {
        "named": "never",
        "anonymous": "always",
        "asyncArrow": "always"
      }
    ]
  }
};
