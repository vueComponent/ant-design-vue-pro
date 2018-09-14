<template>
  <a-menu
    theme="dark"
    mode="inline"
    :defaultSelectedKeys="['1']">

    <template v-for="menu in menus">
      <s-submenu :menu="menu" :key="menu.id"></s-submenu>
    </template>

  </a-menu>
</template>

<script>
import SubMenu from './SubMenu'
import { asyncRouterMap } from '../../router/index'

export default {
  name: "NavMenu",
  components: {
      "s-submenu": SubMenu
  },
  data() {
    return {
      menus: []
    }
  },
  created() {
    this.menus = asyncRouterMap
  }
}
</script>

<style scoped>

</style>