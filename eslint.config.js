import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from '@typescript-eslint/parser';
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import vueParser from "vue-eslint-parser";
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
   ...compat.extends(),
   eslintConfigPrettier,
   {
      plugins: {
         "@typescript-eslint": typescriptEslintPlugin
      },

      languageOptions: {
         globals: {
            ...globals.browser,
            ...autoImportGlobals.globals,
            defineProps: "writable",
            defineEmits: "writable"
         },

         parser: vueParser,
         ecmaVersion: "latest",
         sourceType: "module",

         parserOptions: {
            parser: typescriptParser,
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
