import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from "@/store/mutation-types"

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => {
          const roles = res.result && res.result.role
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          notification.error({ message: '错误', description: '请求用户信息失败，请重试' })
          store.dispatch('Logout').then(() => {
            next({ path: '/user/login' })
          })
        })

      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/user/login')
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }

  }

})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})