import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'Workplace'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) { // 如果已登录，则有token
    /* has token */
    if (to.path === '/user/login') { // 如果没有点击退出登录却返回了登录页，则重定向回首页
      next({ path: '/dashboard/analysis' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        if (Vue.ls.get(ACCESS_TOKEN).permissionList) {
          const arr = []
          Vue.ls.get(ACCESS_TOKEN).permissionList.forEach(item => {
            arr.push(item.name)
          })
          store.dispatch('GetInfo', arr).then(res => {
            store.dispatch('RenderRoutes', arr).then(() => {
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
        }
      } else {
        next()
      }
    //   if (store.getters.roles.length === 0) {
    //     var role = typeof Vue.ls.get(ACCESS_TOKEN).centerId !== 'undefined' ? ['center'] : ['group']
    //     store
    //       .dispatch('GetInfo', role)
    //       .then(res => {
    //         store.dispatch('GenerateRoutes', role).then(() => {
    //           // 根据roles权限生成可访问的路由表
    //           // 动态添加可访问路由表
    //           router.addRoutes(store.getters.addRouters)
    //           const redirect = decodeURIComponent(from.query.redirect || to.path)
    //           if (to.path === redirect) {
    //             // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
    //             next({
    //               ...to,
    //               replace: true
    //             })
    //           } else {
    //             // 跳转到目的路由
    //             next({
    //               path: redirect
    //             })
    //           }
    //         })
    //       })
    //       .catch(() => {
    //         notification.error({
    //           message: '错误',
    //           description: '请求用户信息失败，请重试'
    //         })
    //         store.dispatch('Logout').then(() => {
    //           next({
    //             path: '/user/login',
    //             query: {
    //               redirect: to.fullPath
    //             }
    //           })
    //         })
    //       })
    //   } else {
    //     next()
    //   }
    }
  } else { // 否则退出登录，清除token
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})