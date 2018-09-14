<template>
  <a-layout-header style="padding: 0px;">
    <div class="header">
      <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click.native="toggle"/>
      <div class="user-wrapper">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
        <header-notice class="action"/>
        <a-dropdown>
          <span class="action ant-dropdown-link user-dropdown-menu">
            <a-avatar class="avatar" size="small" :src="avatar()"/>
            <span>{{ nickname() }}</span>
          </span>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
            <a-menu-item key="0">
              <a-icon type="user"/>
              <span>个人中心</span>
            </a-menu-item>
            <a-menu-item key="1">
              <router-link :to="{ name: 'settings' }">
                <a-icon type="setting"/>
                <span>账户设置</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="2" disabled>
              <a-icon type="setting"/>
              <span>测试</span>
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="3">
              <a href="javascript:;" @click="handleLogout">
                <a-icon type="logout"/>
                <span>退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: "LayoutHeader",
    components: {
      HeaderNotice
    },
    props: {
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    data() {
      return {

      }
    },
    created() {

    },
    methods: {
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar"]),
      handleLogout() {
        this.Logout({}).then(() => {
          window.location.reload()
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      toggle() {
        this.$emit('toggle')
      }
    }
  }
</script>

<style scoped>

</style>