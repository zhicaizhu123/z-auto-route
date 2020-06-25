<template>
  <el-aside theme="light" width="200px">
    <div class="logo" />
    <el-menu class="sidebar-menu" :default-active="defaultSelectedKeys" @select="handler">
      <template v-for="item in menuTree">
        <el-menu-item
          v-if="!item.children || !item.children.length"
          :key="item.fullUrl"
          :index="item.fullUrl"
        >
          <i :class="item.meta.icon"></i>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
        <sidebar-item v-else :key="item.fullUrl" :item="item"></sidebar-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import { menuRoutes } from '@/router'
import SidebarItem from './Item'

export default {
  components: {
    SidebarItem,
  },

  data() {
    return {
      collapsed: false,
      menuTree: menuRoutes,
    }
  },

  computed: {
    defaultSelectedKeys() {
      return this.$route.path
    },
  },

  methods: {
    handler(index) {
      this.$router.push({ path: index })
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  height: 32px;
  background: rgba(#333, 0.2);
  margin: 16px;
}
.sidebar-menu {
  height: calc(100vh - 64px);
}
</style>
