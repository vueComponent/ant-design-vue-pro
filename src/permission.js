import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/index/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  // to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(domTitle)
  // alert(ACCESS_TOKEN)
  /* has token */
  console.log('ACCESS_TOKEN' + storage.get(ACCESS_TOKEN))
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            const roles = res.result && res.result.role
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              // VueRouter@3.5.0+ New API
              store.getters.addRouters.forEach((r, index) => {
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                // alert('store.getters.addRouters' + to.path + '   ' + redirect + JSON.stringify(r.children[0].children[0].path))
                router.addRoute(r)
                // alert('store.getters.addRouters' + to.path + '   ' + redirect + JSON.stringify(r))
                if (index === 0) {
                  if (to.path === redirect) {
                    if (to.path === '/' || to.path === '/404') {
                      // alert('/' + r.children[0].children[0].path)
                      next({ path: r.children[0].children[0].path })
                    } else {
                      next({ ...to, replace: true })
                    }
                  } else {
                    // 跳转到目的路由
                    next({ path: redirect })
                  }
                }
              })
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              /*
              const redirect = decodeURIComponent(from.query.redirect || to.path)

              // alert('to.path' + to.path + '   ' + redirect)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
              */
            })
            store.dispatch('Monitor').then(res => {
            })
          })
          .catch((erre) => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试' + erre
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then((res) => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
