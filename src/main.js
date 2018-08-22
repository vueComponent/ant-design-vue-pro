import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

import { VueAxios } from "@/utils/request"

import AntDesign from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.css';  // or 'ant-design-vue/dist/antd.less'


import '@/permission' // permission control

Vue.use(AntDesign)
Vue.use(VueAxios, router)
Vue.use(Viser)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
