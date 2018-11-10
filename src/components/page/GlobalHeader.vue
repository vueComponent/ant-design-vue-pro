<template>
  <a-layout-header style="padding: 0px;">
    <div v-if="mode === 'sidemenu'" class="header">
      <a-icon
        v-if="device==='mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click.native="toggle"></a-icon>
      <a-icon
        v-else
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click.native="toggle"/>

      <user-menu></user-menu>
    </div>
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide">
        <div class="header-index-left">
          <logo class="top-nav-header" />
          <s-menu
            mode="horizontal"
            :menu="menus"
            :theme="theme"
          ></s-menu>
        </div>
        <user-menu class="header-index-right">

        </user-menu>
      </div>
    </div>

  </a-layout-header>
</template>

<script>
  import UserMenu from '../tools/UserMenu'
  import SMenu from '../menu/'
  import Logo from '../tools/Logo'

  import { mapState } from 'vuex'

  export default {
    name: "LayoutHeader",
    components: {
      UserMenu,
      SMenu,
      Logo
    },
    props: {
      mode: {
        type: String,
        // sidemenu, topmenu
        default: 'sidemenu'
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      device: {
        type: String,
        required: false,
        default: 'desktop'
      }
    },
    data() {
      return {
        menus: [],
      }
    },
    created() {
      this.menus = this.mainMenu.find((item) => item.path === '/').children
    },
    computed: {
      ...mapState({
        mainMenu: state => state.permission.addRouters,
      }),
    },
    methods: {

      toggle() {
        this.$emit('toggle')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>