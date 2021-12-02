<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-8 bgStyle">
            <top-navbar></top-navbar>
            <router-view ></router-view>
            <content-footer></content-footer>
          </div>
      </div>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'

export default {
  name: 'BasicLayout',
  components: {
    TopNavbar,
    ContentFooter
  },
  data () {
    return {
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true'
    }
  },
  computed: {
    ...mapState({
      mainMenu: state => state.permission.addRouters
    })
  },
  created () {
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    i18nRender
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";

.bgStyle {
  background-color: black;
  // height: 920px;
  // width: 100%;
}
</style>
