/*
 * @Description: autod config
 * @Author: 王占领
 * @Date: 2021-07-12 17:49:13
 * @LastEditTime: 2022-12-30 14:15:33
 * @LastEditors: 王占领
 */
"use strict";

module.exports = {
   write: true,
   prefix: "^",
   devprefix: "^",
   //  plugin: "",
   test: ["test"],
   dep: [
      "@element-plus/icons-vue",
      "@vueuse/core",
      "axios",
      "big-element",
      "crypto-js",
      "echarts",
      "echarts-util",
      "element-plus",
      "file-saver",
      "jsencrypt",
      "moment",
      "text-security",
      "vue",
      "vue-echarts",
      "vue-router",
      "pinia",
      "pinia-plugin-persistedstate"
   ],
   devdep: [
      "@nabla/vite-plugin-eslint",
      "@types/crypto-js",
      "@types/file-saver",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "@vitejs/plugin-vue",
      "@vitejs/plugin-vue-jsx",
      "autoprefixer",
      "eslint",
      "eslint-config-prettier",
      "fast-glob",
      "less",
      "prettier",
      "prettier-plugin-packagejson",
      "prettier-plugin-tailwindcss",
      "sharp",
      "svgo",
      "tailwindcss",
      "typescript",
      "vite",
      "vite-plugin-checker",
      "vite-plugin-compression",
      "vite-plugin-image-optimizer",
      "vite-plugin-remove-console",
      "vite-plugin-svg-icons",
      "vite-plugin-vue-setup-extend",
      "vue-eslint-parser",
      "vue-tsc"
   ],
   keep: ["jsencrypt"],
   exclude: [
      "node_modules",
      "./test/fixtures",
      "./dist",
      "./public",
      "./plugins",
      "./*.config.js"
   ]
};
