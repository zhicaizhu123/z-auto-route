<z-route>
{
  "sortIndex": 0,
  "redirect": "/system/role",
  "meta": {
    "title": "系统管理"
  },
  "beforeEnter": function (to, from, next) {
    next()
  }
}
</z-route>

<template>
  <div class>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped></style>
