module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "max-len": [2, 100, 4, {"ignoreUrls": true}],
  },
  parserOptions: {
    ecmaVersion: 12,
  },
};
