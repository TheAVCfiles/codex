module.exports = {
  root: true,
  overrides: [
    {
      files: ["scripts/neon/**/*.ts", "vitest.neon.config.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.neon.eslint.json"],
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint"],
      env: { node: true, es2022: true },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
