import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import * as boundariesModule from "eslint-plugin-boundaries";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/*
 * The plugin's type declarations promise a default export, but its CJS
 * runtime has none under jiti — fall back to the namespace object.
 */
const boundaries =
  boundariesModule.default ??
  (boundariesModule as unknown as typeof boundariesModule.default);

const allowTo = (types: string[]) =>
  types.map((type) => ({ to: { element: { type } } }));

export default defineConfig(
  { ignores: ["dist"] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedInlineConfigs: "error",
    },
    plugins: { "@stylistic": stylistic, perfectionist },
    rules: {
      "@stylistic/multiline-comment-style": ["warn", "starred-block"],
      "@stylistic/padding-line-between-statements": [
        "warn",
        { blankLine: "always", next: "return", prev: "*" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      // Generated card text interpolates numeric params by design
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "curly": ["error", "all"],
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
  /*
   * Architecture boundaries — the module dependency matrix is enforced, not
   * conventional. Key invariants: UI never imports phase thunks (it emits
   * GameEvents), and card definitions stay pure data (no state imports).
   */
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: { boundaries },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          message:
            "{{ from.element.type }} may not import {{ to.element.type }} (see the boundaries matrix in eslint.config.ts)",
          policies: [
            {
              allow: allowTo([
                "app",
                "cards-shared",
                "decks",
                "definitions",
                "engine",
                "phases",
                "state",
                "ui",
              ]),
              from: { element: { type: "app" } },
            },
            {
              allow: allowTo(["cards-shared", "definitions"]),
              from: { element: { type: "cards-shared" } },
            },
            {
              allow: allowTo(["cards-shared", "decks"]),
              from: { element: { type: "decks" } },
            },
            {
              allow: allowTo(["cards-shared", "definitions", "engine"]),
              from: { element: { type: "definitions" } },
            },
            {
              allow: allowTo([
                "cards-shared",
                "definitions",
                "engine",
                "phases",
                "state",
              ]),
              from: { element: { type: "engine" } },
            },
            {
              allow: allowTo(["cards-shared", "engine", "phases", "state"]),
              from: { element: { type: "phases" } },
            },
            {
              allow: allowTo([
                "cards-shared",
                "decks",
                "definitions",
                "engine",
                "phases",
                "state",
              ]),
              from: { element: { type: "state" } },
            },
            {
              allow: allowTo([
                "cards-shared",
                "definitions",
                "engine",
                "state",
                "ui",
              ]),
              from: { element: { type: "ui" } },
            },
          ],
        },
      ],
    },
    settings: {
      "boundaries/elements": [
        { pattern: "src/cards/definitions", type: "definitions" },
        { pattern: "src/cards/engine", type: "engine" },
        { pattern: "src/cards", type: "cards-shared" },
        { pattern: "src/state/phases", type: "phases" },
        { pattern: "src/state", type: "state" },
        { pattern: "src/decks", type: "decks" },
        { pattern: "src/ui", type: "ui" },
        { pattern: "src/*", type: "app" },
      ],
      /*
       * The bundled node resolver must be taught TS extensions, or every
       * extensionless import resolves to "unknown" and the rule goes silent
       */
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
  },
  /*
   * The config file itself imports untyped plugins (jsx-a11y, boundaries),
   * which trips the type-aware unsafe-* rules — lint it without type info
   */
  {
    files: ["eslint.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
);
