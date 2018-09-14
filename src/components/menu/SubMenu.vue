<template>
  <a-menu-item :key="menu.id" v-if="!menu.children && $router.matcher.match({ name: menu.permission }).matched.length">
    <router-link :to="{ name: menu.name, params: { pageNo: '1' } }">
      <a-icon v-if="menu.meta.icon" :type="menu.meta.icon"></a-icon>
      <span>{{ menu.meta.title }}</span>
    </router-link>
  </a-menu-item>
  <a-sub-menu :key="menu.id" v-else>
    <span slot="title"><a-icon :type="menu.meta.icon" v-if="menu.meta.icon" /><span>{{ menu.meta.title }}</span></span>
    <template v-for="submenu in menu.children">
      <s-submenu :key="submenu.id" :menu="submenu"></s-submenu>
    </template>
  </a-sub-menu>
</template>

<script>
import SubMenu from './SubMenu'

export default {
    name: "SubMenu",
  components: {
      "s-submenu": SubMenu
  },
  props: {
    menu: {},
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>