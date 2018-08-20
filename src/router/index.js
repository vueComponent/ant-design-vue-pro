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
    component: () => import('../views/About')
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
    meta: { title: 'dashboard' },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('../views/dashboard/Analysis'),
        meta: { title: '分析页', hideHeader: true }
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('../views/dashboard/Monitor'),
        meta: { title: '监控页', hideHeader: true }
      },
      {
        path: 'workplace',
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
    meta: { title: '表单页' },
    children: [
      {
        path: 'base-form',
        name: 'BaseForm',
        component: () => import('../views/form/BasicForm'),
        meta: { title: '基础表单' }
      },
      {
        path: 'step-form',
        name: 'StepForm',
        component: () => import('../views/form/BasicForm'),
        meta: { title: '分步表单' }
      },
      {
        path: 'advanced-form',
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
    meta: { title: '列表页' },
    children: [
      {
        path: 'table-list',
        name: 'TableList',
        component: () => import('../views/list/TableList'),
        meta: { title: '查询表格' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    name: 'profile',
    meta: { title: '详情页' },
    children: [
      {
        path: 'basic',
        name: 'ProfileBasic',
        component: () => import('../views/list/TableList'),
        meta: { title: '基础详情页' }
      },
      {
        path: 'advanced',
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
    meta: { title: '结果页' },
    children: [
      {
        path: 'success',
        name: 'ResultSuccess',
        component: () => import('../views/result/Success'),
        meta: { title: '成功' }
      },
      {
        path: 'fail',
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
    meta: { title: '异常页' },
    children: [
      {
        path: '403',
        name: 'Exception403',
        component: () => import('../views/result/Success'),
        meta: { title: '403' }
      },
      {
        path: '404',
        name: 'Exception404',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "fail" */ '../views/result/Success'),
        meta: { title: '404' }
      },
      {
        path: '500',
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