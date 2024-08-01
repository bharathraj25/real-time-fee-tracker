import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: [
      "*.js",
      "**/*.js",
      "!**/node_modules/**",
      "!**/dist/**",
      "!**/coverage/**",
      "!**/tests/**",
    ],
    languageOptions: { sourceType: "module" },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
