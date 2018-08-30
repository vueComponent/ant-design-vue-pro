import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

import { VueAxios } from "@/utils/request"

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import * as dayjs from 'dayjs' // 日期时间支持库

import '@/permission' // permission control

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
