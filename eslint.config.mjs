import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["*.js", "**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
