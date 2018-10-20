import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router/'
import store from './store/'

import { VueAxios } from "@/utils/request"

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import * as dayjs from 'dayjs' // 日期时间支持库

import '@/permission' // permission control
import '@/utils/filter' // base filter

import { ACCESS_TOKEN, DEFAULT_COLOR, DEFAULT_THEME, SIDEBAR_TYPE } from "@/store/mutation-types"
import config from '@/defaultConfig'

Vue.config.productionTip = false

Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)

new Vue({
  router,
  store,
  mounted () {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, false))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  },
  render: h => h(App)
}).$mount('#app')
