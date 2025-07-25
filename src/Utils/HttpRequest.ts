import ba from "big-axios";
import { ElMessage } from "element-plus";
import { useTokenStore, useUserStore } from "@/Stores";
import loadingBar from "@/Plugins/LoadingBar/Index.js";

import type { AxiosRequestConfig } from "axios";

let hideError = false;

// 创建实例
const http = ba.create(null, {
   baseURL: import.meta.env.VITE_BASE_API, // api的base_url
   timeout: 60000 * 3 // 请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
   (config) => {
      if (!config.headers?.noLoading) {
         loadingBar.start();
      }

      const tokenStore = useTokenStore();
      if (tokenStore.token && !config.headers?.Authorization) {
         config.headers!.Authorization = "Bearer " + tokenStore.token;
      }

      // 在 option 中配置 data 对象
      if (config.data && config.data.hideError) {
         hideError = true;
      } else {
         hideError = false;
      }

      return config;
   },
   (err) => {
      loadingBar.error();

      if (!hideError) {
         ElMessage.closeAll();
         ElMessage.error(err.message);
      }

      return Promise.reject(err);
   }
);

// 响应拦截器
http.interceptors.response.use(
   (response) => {
      loadingBar.finish();

      return Promise.resolve(response);
   },
   (err) => {
      // 主动取消请求，不做提示
      if (hideError || err.message === "canceled") {
         loadingBar.error();
      } else {
         loadingBar.finish();

         if (err.response) {
            if (err.response.status === 401) {
               useUserStore().reset();
            } else {
               ElMessage.closeAll();
               ElMessage.error(err.message);
            }
         } else {
            ElMessage.closeAll();
            ElMessage.error(err.message);

            const errorData = {
               ...err.response,
               errorUrl: err.response.request.responseURL
            };

            return Promise.reject(errorData);
         }
      }

      const errorData = {
         config: err.config,
         data: err.response.data,
         errorUrl: err.config ? err.config.url : "",
         ...err
      };

      return Promise.reject(errorData);
   }
);

export default http;
