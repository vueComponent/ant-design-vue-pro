import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/Layout'

Vue.use(Router)
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('../views/Login')
  },
  {
    path: '/404',
    component: () => import('../views/404')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true
  }
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/dashboard',
    component: Layout,
    name: 'dashboard',
    redirect: '/dashboard/analysis',
    meta: { title: 'dashboard', icon: 'dashboard' },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('../views/dashboard/Analysis'),
        meta: { title: '分析页', hideHeader: true }
      },
      {
        path: '/dashboard/monitor',
        name: 'Monitor',
        component: () => import('../views/dashboard/Monitor'),
        meta: { title: '监控页', hideHeader: true }
      },
      {
        path: '/dashboard/workplace',
        name: 'Workplace',
        component: () => import('../views/dashboard/Workplace'),
        meta: { title: '工作台', hideHeader: true }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    name: 'form',
    redirect: '/form/base-form',
    meta: { title: '表单页', icon: 'form' },
    children: [
      {
        path: '/form/base-form',
        name: 'BaseForm',
        component: () => import('../views/form/BasicForm'),
        meta: { title: '基础表单' }
      },
      {
        path: '/form/step-form',
        name: 'StepForm',
        component: () => import('../views/form/BasicForm'),
        meta: { title: '分步表单' }
      },
      {
        path: '/form/advanced-form',
        name: 'AdvanceForm',
        component: () => import('../views/form/BasicForm'),
        meta: { title: '高级表单' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    name: 'list',
    redirect: '/list/query-list',
    meta: { title: '列表页', icon: 'table' },
    children: [
      {
        path: '/list/query-list',
        name: 'QueryList',
        component: () => import('../views/list/TableList'),
        meta: { title: '查询表格' }
      },
      {
        path: '/list/basic-list',
        name: 'BasicList',
        component: () => import('../views/list/StandardList'),
        meta: { title: '标准列表' }
      },
      {
        path: '/list/card',
        name: 'CardList',
        component: () => import('../views/list/TableList'),
        meta: { title: '卡片列表' }
      },
      {
        path: '/list/search',
        name: 'SearchList',
        redirect: '/list/search/articles',
        meta: { title: '搜索列表' },
        children: [
          {
            path: '/list/search/articles',
            name: 'SearchArticles',
            component: () => import('../views/list/TableList'),
            meta: { title: '搜索列表（文章）' }
          },
          {
              path: '/list/search/projects',
              name: 'SearchProjects',
              component: () => import('../views/list/TableList'),
              meta: { title: '搜索列表（项目）' }
          },
          {
              path: '/list/search/applications',
              name: 'SearchApplications',
              component: () => import('../views/list/TableList'),
              meta: { title: '搜索列表（应用）' }
          },
        ]
      },
    ]
  },
  {
    path: '/profile',
    component: Layout,
    name: 'profile',
    redirect: '/profile/basic',
    meta: { title: '详情页', icon: 'profile' },
    children: [
      {
        path: '/profile/basic',
        name: 'ProfileBasic',
        component: () => import('../views/list/TableList'),
        meta: { title: '基础详情页' }
      },
      {
        path: '/profile/advanced',
        name: 'ProfileAdvanced',
        component: () => import('../views/list/TableList'),
        meta: { title: '高级详情页' }
      }
    ]
  },
  {
    path: '/result',
    component: Layout,
    name: 'result',
    redirect: '/result/success',
    meta: { title: '结果页', icon: 'check-circle-o' },
    children: [
      {
        path: '/result/success',
        name: 'ResultSuccess',
        component: () => import('../views/result/Success'),
        meta: { title: '成功' }
      },
      {
        path: '/result/fail',
        name: 'ResultFail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "fail" */ '../views/result/Success'),
        meta: { title: '失败' }
      }
    ]
  },
  {
    path: '/exception',
    component: Layout,
    name: 'exception',
    redirect: '/exception/403',
    meta: { title: '异常页', icon: 'warning' },
    children: [
      {
        path: '/exception/403',
        name: 'Exception403',
        component: () => import('../views/result/Success'),
        meta: { title: '403' }
      },
      {
        path: '/exception/404',
        name: 'Exception404',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "fail" */ '../views/result/Success'),
        meta: { title: '404' }
      },
      {
        path: '/exception/500',
        name: 'Exception500',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "fail" */ '../views/result/Success'),
        meta: { title: '500' }
      }
    ]
  }
]