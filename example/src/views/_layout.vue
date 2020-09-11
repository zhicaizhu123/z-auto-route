<z-route>
{
  "dynamic": false,
  "redirect": "/",
  "data": 1,
  "meta": {
    "title": "布局组件",
    "hide": true
  }
}
</z-route>

<template>
  <el-container class="layout">
    <layout-sidebar class="layout-sidebar"></layout-sidebar>

    <el-container>
      <el-header style="text-align: right; font-size: 12px;">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>ZCoder</span>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  components: {
    LayoutSidebar: Sidebar,
  },

  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 60px;
  }
  .el-main {
    background-color: #f3f4f5;
    overflow: auto;
  }
}
</style>
