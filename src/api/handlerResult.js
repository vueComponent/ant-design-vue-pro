import Vue from 'vue'
import store from '../store'
// base library
import { message } from 'ant-design-vue'
Vue.use(message)
const loginRoutePath = '/index/login'
/**
 * 统一返回状态处理
 * @param {*} response
 * @returns
 */
export function handlerResult (response) {
  if (response.code === 0) {
    message.success(response.message)
    return true
  } else {
    message.error(response.message)
    if (response.code === 9998) {
      // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
      store.dispatch('Logout').then(() => {
        location.href = loginRoutePath
        // this.$router.push({ path: loginRoutePath })
      })
    }
    return false
  }
}
/**
 * 统一返回状态处理
 * @param {*} response
 * @returns
 */
 export function isPageResult (response) {
  if (response.code === 0) {
    return true
  } else {
    message.error(response.message)
    if (response.code === 9998) {
          // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
          store.dispatch('Logout').then(() => {
            location.href = loginRoutePath
            // this.$router.push({ path: loginRoutePath })
          })
    }
    return false
  }
}
