module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {
    React: "writable",
  },
};
