import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import autoImportGlobals from "./.eslintrc-auto-import.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all
});

export default [
   ...compat.extends(
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
   ),
   {
      plugins: {
         "@typescript-eslint": typescriptEslint
      },

      languageOptions: {
         globals: {
            ...globals.browser,
            ...autoImportGlobals.globals,
            defineProps: "writable",
            defineEmits: "writable"
         },

         parser: parser,
         ecmaVersion: "latest",
         sourceType: "module",

         parserOptions: {
            parser: "@typescript-eslint/parser",
            ecmaFeatures: {
               jsx: true
            }
         }
      },

      rules: {
         "no-tabs": [
            "error",
            {
               allowIndentationTabs: true
            }
         ],

         "no-unused-vars": ["off"],
         "no-undef": "off",
         "@typescript-eslint/no-unused-vars": "off",
         "@typescript-eslint/no-non-null-assertion": "off",
         "@typescript-eslint/no-empty-function": "off"
      }
   }
];
