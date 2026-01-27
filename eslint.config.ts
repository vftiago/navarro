import path from "node:path";
import { fileURLToPath } from "node:url";
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ["**/dist"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
    ),
  ),
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },

      sourceType: "module",
    },
    linterOptions: {
      reportUnusedInlineConfigs: "error",
    },
    plugins: {
      perfectionist,
      "react-refresh": reactRefresh,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "func-style": ["warn", "expression"],
      "perfectionist/sort-classes": [
        "warn",
        {
          ignoreCase: true,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-imports": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          ignoreCase: true,
          newlinesBetween: 0,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "warn",
        {
          customGroups: [
            { groupName: "shorthand", modifiers: ["shorthand"] },
            { elementNamePattern: "^on.+", groupName: "callback" },
          ],
          groups: ["shorthand", "unknown", "callback"],
          ignoreCase: true,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          ignoreCase: true,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
