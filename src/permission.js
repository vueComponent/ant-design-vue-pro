import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { Message } from 'ant-design-vue'

import { getToken } from "./utils/auth"

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (getToken()) {
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {

        store.dispatch('GetInfo').then(res => {
          const roles = res.result && res.result.role
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表

            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogout').then(() => {
            Vue.$message.error('This is a message of error');
            Vue.$message.error(err.message)
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
      next('/login')
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }

  }

})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})