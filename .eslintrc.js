module.exports = {
  "env": {
    "es6": true,
    "node": true,
  },
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended",
    "plugin:flowtype/recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    },
    "sourceType": "module"
  },
  "plugins": [
    "flowtype"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
