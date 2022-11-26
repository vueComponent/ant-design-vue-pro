import Vue from 'vue'
import App from './App.vue'
import AppMixin from './AppMixin.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h('div', {}, [h(App), h(AppMixin)])
}).$mount('#app')
