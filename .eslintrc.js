module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest", "@typescript-eslint"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "max-classes-per-file": "off",
    "import/extensions": ["warn", { ts: "never" }],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        packageDir: __dirname,
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-param-reassign": "off",
    "no-loop-func": "off",
    "no-new": "off",
    "no-promise-executor-return": "off",
    "no-use-before-define": "off",
    "no-restricted-syntax": "off",
    "default-param-last": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-bitwise": ["error", { allow: ["~"] }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".d.ts"],
      },
    },
  },
};
