<template>
    <a-menu-item :key="menu.id" :name="menu.id" v-if="!menu.children && router.matcher.match({ name: menu.permission }).matched.length">
        <router-link :to="{ name: menu.permission, params: { pageNo: '1' } }">
            <a-icon v-if="menu.icon" :type="menu.icon"></a-icon>
            <span>{{ menu.name }}</span>
        </router-link>
    </a-menu-item>
    <a-submenu :key="menu.id" :name="menu.id" v-else>
        <span slot="title"><a-icon :type="menu.icon" v-if="menu.icon" /><span>{{ menu.name }}</span></span>
        <template v-for="(submenu, index) in menu.children">
            <s-submenu :key="submenu.id" :menu="submenu"></s-submenu>
        </template>
    </a-submenu>
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