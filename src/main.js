import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

import { VueAxios } from "@/utils/request"

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'


import '@/permission' // permission control

Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
