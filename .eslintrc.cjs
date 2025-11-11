module.exports = {
  root: true,
  env: { node: true, es2021: true },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  ignorePatterns: ["codex-cli/**", "codex-rs/**", "node_modules/**"],
  rules: {},
};
