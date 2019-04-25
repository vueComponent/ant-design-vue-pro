<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enUS from 'ant-design-vue/lib/locale-provider/en_US'

import { AppDeviceEnquire } from '@/utils/mixin'
import { log } from 'util'
import { DEFAULT_Roles, DEFAULT_Language } from '@/store/mutation-types'
import router from './router'
import Router from 'vue-router'
import store from './store'

import permission from '@/store/modules/permission'
import constantRouterMap from '@/config/router.config'

export default {
  mixins: [AppDeviceEnquire],

  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {},
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.language == 'zh-CN') {
      this.locale = zhCN
    } else if (this.language == 'en-US') {
      this.locale = enUS
    }
  },
  watch: {
    language(val) {
      if (val == 'zh-CN') {
        this.locale = zhCN
        Vue.ls.set(DEFAULT_Language, 'zh-CN')
      } else if (val == 'en-US') {
        this.locale = enUS
        Vue.ls.set(DEFAULT_Language, 'en-US')
      }
      let roles = Vue.ls.get(DEFAULT_Roles)
      console.log(roles)
      this.$store.dispatch('GenerateRoutes', { roles }).then(() => {
        router.go(0)
        // router.addRoutes(store.getters.addRouters)
        console.log(store.getters.addRouters)
        console.log(router)
        // const createRouter = () => new Router({
        //   mode: 'history',
        //   routes: []
        // })
        // const newRouter = createRouter()
        // router.matcher = newRouter.matcher // the relevant part
        // console.log(router)
      })
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
