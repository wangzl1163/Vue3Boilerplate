/*
 * @Description: 防火墙状态
 * @Author: 王占领
 * @Date: 2022-11-03 16:41:49
 * @LastEditTime: 2022-11-03 16:43:19
 * @LastEditors: 王占领
 */

import { useMakeEnum } from "./Composables/MakeEnum";

enum Status {
   "开启中" = "active",
   "关闭中" = "inactive"
}

export const FirewallStatus = useMakeEnum(Status, "status");
