<template functional>
  <el-submenu :index="props.item.fullUrl">
    <span slot="title">
      <i :class="props.item.meta.icon"></i>
      <span>{{ props.item.meta.title }}</span>
    </span>
    <template v-for="child in props.item.children">
      <el-menu-item
        v-if="!child.children || !child.children.length"
        :key="child.fullUrl"
        :index="child.fullUrl"
      >
        {{ child.meta.title }}
      </el-menu-item>
      <sidebar-item
        v-else
        :key="child.fullUrl"
        :index="child.fullUrl"
        :item="child"
      ></sidebar-item>
    </template>
  </el-submenu>
</template>

<script>
export default {
  name: 'SidebarItem',

  components: {},

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
