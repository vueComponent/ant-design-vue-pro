// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse,baogao,bingli,fangshi,ruzhu,wenjuan,zhanghao,home } from '@/core/icons'
export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页', permission: ['center'] },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '首页', keepAlive: true, icon: home, permission: [ 'center' ] }
      },
      {
        path: '/list/index',
        name: 'list',
        component: () => import('@/views/list/TableList'),
        meta: { title: '病例管理', keepAlive: true, icon: bingli, permission: [ 'center' ]}
      },
      {
        path: '/acute/index',
        name: 'acute',
        component: () => import('@/views/acute/TableList'),
        meta: { title: '急性加重', keepAlive: true, icon: bingli, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d*)',
        name: 'basis',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/Index'),
        meta: { permission: [ 'center' ] }
      },
      {
        path: '/jxjzq/:id(\\d*)',
        name: 'jxjzq',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/jxjzq'),
        meta: { permission: [ 'center' ] }
      },
      {
        path: '/list/basis/:id(\\d+)/1',
        name: 'mask1',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-1'),
        meta: {maskId: 1, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/2',
        name: 'mask2',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-2'),
        meta: {maskId: 2, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/5',
        name: 'mask5',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-5'),
        meta: {maskId: 5, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/6',
        name: 'mask6',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-6'),
        meta: {maskId: 6, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/7',
        name: 'mask7',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-7'),
        meta: {maskId: 7, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/8',
        name: 'mask8',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-8'),
        meta: {maskId: 8, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/9',
        name: 'mask9',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-9'),
        meta: {maskId: 9, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/10',
        name: 'mask10',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-10'),
        meta: {maskId: 10, permission: [ 'center' ]}
      },
      {
        path: '/list/basis/:id(\\d+)/4',
        name: 'mask4',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-4'),
        meta: {maskId: 4, permission: [ 'center' ]}
      },
      {
        path: '/list/task/:id(\\d*)',
        name: 'taskDetail',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/task'),
        meta: { permission: [ 'center' ] }
      },
      {
        path: '/task/index',
        name: 'Task',
        component: () => import('@/views/task/index'),
        meta: { title: '访视任务', keepAlive: true, icon: fangshi, permission: [ 'center' ]}
      },
      {
        path: '/gallery/index',
        name: 'Gallery',
        component: () => import('@/views/gallery/index'),
        meta: { title: '报告采集', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/caseTransfer/index',
        name: 'CaseTransfer',
        component: () => import('@/views/caseTransfer/index'),
        meta: { title: '病例转移申请', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/caseTransfer/review',
        name: 'caseTransferReview',
        component: () => import('@/views/caseTransfer/review'),
        meta: { title: '病例转移审核', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/wx/userAudit',
        name: 'wxUserAudit',
        component: () => import('@/views/wx/userAudit'),
        meta: { title: '微信用户审核', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/wx/questionReview',
        name: 'wxQuestionReview',
        component: () => import('@/views/wx/questionReview'),
        meta: { title: '微信问卷审阅', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/wx/questionDetail/:id(\\d*)',
        name: 'wxQuestionDetail',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/wx/questionDetail'),
        meta: {permission: ['center']}
      },
      {
        path: '/wx/patientReportReview',
        name: 'wxPatientReportReview',
        component: () => import('@/views/wx/patientReportReview'),
        meta: { title: '患者报告审阅', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/wx/ticketRegister',
        name: 'wxTicketRegister',
        component: () => import('@/views/wx/ticketRegister'),
        meta: { title: '活动券登记', keepAlive: true, icon: baogao,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/wx/healthknowledge',
        name: 'healthknowledge',
        component: () => import('@/views/wx/healthknowledge'),
        meta: { title: '健康知识', keepAlive: true, icon: baogao,isBack:false}
      },
      {
        path: '/wx/famousDoctor',
        name: 'famousDoctor',
        component: () => import('@/views/wx/famousDoctor'),
        meta: { title: '名医专家', keepAlive: true, icon: baogao,isBack:false}
      },
      {
        path: '/gallery/detail/:id(\\d*)',
        name: 'collectDetail',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/collect'),
        meta: {permission: [ 'center' ]}
      },
      {
        path: '/group/index',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '入组管理', keepAlive: true, icon: ruzhu,isBack:false, permission: [ 'center' ]}
      },
      {
        path: '/group/addProject',
        name: 'addProject',
        hidden:true,
        component: () => import('@/views/group/addProject'),
        meta: { hiddenHeaderContent:true, hidden: true }
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