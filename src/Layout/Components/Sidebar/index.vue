<template>
   <div :class="{ 'has-logo': true }">
      <logo :collapse="isCollapse" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
         <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :active-text-color="variables.menuActiveText"
            :unique-opened="true"
            :collapse-transition="false"
            mode="vertical"
         >
            <sidebar-item
               v-for="(route, index) in permissionRoutes"
               :key="route.path + index"
               :item="route"
               :base-path="route.path"
            />
         </el-menu>
      </el-scrollbar>
   </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/Assets/Style/Variables.module.less";

export default {
   name: "Sidebar",
   components: { SidebarItem, Logo },
   computed: {
      ...mapGetters(["permissionRoutes", "sidebar"]),
      activeMenu() {
         const route = this.$route;
         const { meta, path } = route;
         // if set path, the sidebar will highlight the path you set
         if (meta.activeMenu) {
            return meta.activeMenu;
         }
         return path;
      },
      variables() {
         return variables;
      },
      isCollapse() {
         return !this.sidebar.opened;
      }
   }
};
</script>
