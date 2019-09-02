// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '首页', keepAlive: true, icon: 'home'}
      },
      // {
      //   path: '/list/',
      //   name: 'list',
      //   component: RouteView,
      //   redirect: '/list/table-list',
      //   meta: { title: '病例管理', icon: 'table'},
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '病例管理', keepAlive: true, icon: 'table'}
      //     },
      //     {
      //       path: '/list/basis/:id(\\d*)',
      //       name: 'success',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       hidden: true,
      //       component: () => import('@/views/account/center/Index')
      //     }
      //   ]
      // },
      {
        path: '/list/index',
        name: 'list',
        component: () => import('@/views/list/TableList'),
        meta: { title: '病例管理', keepAlive: true, icon: 'table'}
      },
      {
        path: '/list/basis/:id(\\d*)',
        name: 'basis',
        hidden:true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/Index'),
      },
      {
        path: '/form',
        redirect: '/form/base-form',
        component: PageView,
        meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      },
      {
        path: '/task/index',
        name: 'Task',
        component: () => import('@/views/task/index'),
        meta: { title: '随访任务', keepAlive: true, icon: 'home'}
      },
      {
        path: '/gallery/index',
        name: 'Gallery',
        component: () => import('@/views/gallery/index'),
        meta: { title: '报告采集', keepAlive: true, icon: 'home',isBack:false}
      },
      {
        path: '/group/index',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '入组管理', keepAlive: true, icon: 'home',isBack:false}
      },
      {
        path: '/group/addProject',
        name: 'addProject',
        hidden:true,
        component: () => import('@/views/group/addProject'),
        meta: { hiddenHeaderContent:true, hidden: true }
      },
      {
        path: '/account/index',
        name: 'Account',
        component: () => import('@/views/account/index'),
        meta: { title: '账号管理', keepAlive: true, icon: 'home'}
      }
    ]
  },
 
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]