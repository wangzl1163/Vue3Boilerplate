/*
 * @Description  : vite config
 */

import eslintPlugin from "@nabla/vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import * as path from "path";
import AutoImportPlugin from "unplugin-auto-import/vite";
import { defineConfig, HttpProxy, splitVendorChunkPlugin, loadEnv } from "vite";
import checkerPlugin from "vite-plugin-checker";
import compressionPlugin from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import removeConsolePlugin from "vite-plugin-remove-console";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vueSetupExtendPlugin from "vite-plugin-vue-setup-extend";
import gojsHackPlugin from "./plugins/GojsHack";

import type { ClientRequest, IncomingMessage, ServerResponse } from "http";
import type { PluginOption } from "vite";

/**
 * @description:加载指定模式（mode）下的 .env 文件，读取环境变量
 * mode 通过 cross-env 在 scripts 中设置 mode variable 传入，mode 未传入时取 process.env.NODE_ENV 值
 *
 * Vite 默认是不加载 .env 文件的，因为这些文件需要在执行完 Vite 配置后才能确定加载哪一个
 * 这里使用 Vite 导出的 loadEnv 函数来加载指定的 .env 文件
 * @see:https://cn.vitejs.dev/config/#using-environment-variables-in-config
 */
const env = loadEnv(
   process.env.mode ?? process.env.NODE_ENV ?? "development",
   process.cwd()
);
const proxyRequestLog = (
   proxyReq: ClientRequest,
   req: IncomingMessage,
   res: ServerResponse,
   options: HttpProxy.ServerOptions
) => {
   console.group("request info:");
   console.log("raw url: ", req.url);
   console.log("proxy url: ", proxyReq.path);
   console.log("method: ", req.method);
   console.groupEnd();
};

// https://cn.vitejs.dev/config/
export default defineConfig({
   base: env.VITE_BASE ?? "/", // "/" 为 vite 默认值
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src")
      }
   },
   plugins: [
      vue(), // 官方插件，用于支持 Vue 的单文件组件写法即支持 .vue 格式的文件
      vueJsx(), // 官方插件，用于支持 Vue 组件中的 JSX 语法
      splitVendorChunkPlugin(), // 官方插件，用于支持分割代码文件块
      vueSetupExtendPlugin(), // 支持 script setup 语法下把组件的 name 写在 script 标签上
      // 支持生成 js、css 文件的 gzip 压缩文件
      compressionPlugin({
         ext: ".gz",
         deleteOriginFile: false
      }),
      // 支持 svg 文件作为图标
      createSvgIconsPlugin({
         // 配置svg文件所在的文件路径
         iconDirs: [path.resolve(__dirname, "src/Assets/Icons/svg")],
         symbolId: "icon-[dir]-[name]"
      }),
      // 支持在 Vite 中使用 ESlint
      eslintPlugin({
         eslintOptions: {
            fix: true,
            cache: false
         }
      }),
      gojsHackPlugin(),
      // 支持实时类型检查并将错误呈现在页面中
      checkerPlugin({
         typescript: true,
         enableBuild: false,
         overlay: { initialIsOpen: false }
      }),
      removeConsolePlugin(), // 支持构建时删除 console 输出
      ViteImageOptimizer() as unknown as PluginOption, // 支持压缩 svg 和各种图片
      // 支持自动导入模块，在需要使用某模块时不需要再手动导入
      AutoImportPlugin({
         // 默认支持的文件格式为：.ts, .tsx, .js, .jsx, .vue
         dirs: ["./src/Composables"], // ./src/Composables/** 写法：如果 Composables 下存在文件夹会搜索其下的文件夹中的模块即支持文件夹嵌套
         dts: true,
         eslintrc: {
            enabled: true,
            filepath: "./.eslintrc-auto-import.mjs"
         },
         imports: [
            "vue",
            "vue-router",
            {
               "@vueuse/core": ["useInterval"]
            },
            "pinia"
         ],
         vueTemplate: true
      })
   ],
   server: {
      port: 10101,
      strictPort: true,
      proxy: {
         [env.VITE_BASE_API]: {
            target: env.VITE_PROXY_TARGET, // "http://172.20.14.86:8000"
            changeOrigin: true,
            configure: (proxy, options) => {
               // proxy 是 'http-proxy' 的实例
               proxy.on("proxyReq", proxyRequestLog);
            }
         },
         "/permission/login/": {
            target: "http://172.20.80.12:8888",
            changeOrigin: true,
            configure: (proxy, options) => {
               proxy.on("proxyReq", proxyRequestLog);
            },
            rewrite: (path) => path.replace(/^\/permission\/login/, "")
         },
         "/permission/sys/": {
            target: "http://172.20.80.12:8001",
            configure: (proxy, options) => {
               proxy.on("proxyReq", proxyRequestLog);
            },
            rewrite: (path) => path.replace(/^\/permission\/sys/, "")
         },
         "/socket.io": {
            target: env.VITE_PROXY_TARGET_WS,
            ws: true
         }
      }
   },
   build: {
      reportCompressedSize: false
   },
   optimizeDeps: {
      // 修复开发模式下，echarts 图表无法展示
      exclude: ["echarts"]
   }
});

// 注册全局环境变量
import randomKey from "./src/Utils/RandomKey";
(import.meta as unknown as { env: Record<string, string> }).env = {
   AESKEY: randomKey.getKey(64),
   AESIV: randomKey.getKey(32)
};
