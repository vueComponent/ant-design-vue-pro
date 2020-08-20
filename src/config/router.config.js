// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, /*BlankLayout,*/ PageView } from '@/layouts'
import { bxAnaalyse, baogao, bingli, fangshi, ruzhu, zhanghao, home, jixing, blzysq, blzysh, wxyhbd, wenjuan, hzbgsy, huodongquan, jkzs, myzj, webconfig } from '@/core/icons'
export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页', permission: ['center', 'group'] },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '首页', keepAlive: true, icon: home, permission: ['center', 'group'] }
      },
      {
        path: '/patient',
        component: RouteView,
        redirect: '/patient/list',
        meta: { title: '病历管理', keepAlive: true, icon: wxyhbd, permission: ['center', 'group'] },
        children: [{
            path: '/patient/list',
            name: 'patientList',
            component: () => import('@/views/patient/list'),
            meta: { title: '患者管理', keepAlive: false, icon: wxyhbd, permission: ['center', 'group'] }
          }, {
            path: '/list/index',
            name: 'list',
            component: () => import('@/views/list/TableList'),
            meta: { title: '基线管理', keepAlive: true, icon: bingli, permission: ['center', 'group'] }
          }, {
            path: '/acute/index',
            name: 'acute',
            component: () => import('@/views/acute/TableList'),
            meta: { title: '急性加重信息', keepAlive: true, icon: jixing, permission: ['center', 'group'] }
          }, {
            path: '/task/index',
            name: 'Task',
            component: () => import('@/views/task/index'),
            meta: { title: '访视信息', keepAlive: true, icon: fangshi, permission: ['center', 'group'] }
          }, {
            path: '/caseTransfer/index',
            name: 'CaseTransfer',
            component: () => import('@/views/caseTransfer/index'),
            meta: { title: '病历转移申请', keepAlive: true, icon: blzysq, permission: ['center', 'group'] }
          },
          {
            path: '/caseTransfer/review',
            name: 'caseTransferReview',
            component: () => import('@/views/caseTransfer/review'),
            meta: { title: '病历转移审核', keepAlive: true, icon: blzysh, permission: ['center', 'group'] }
          }
        ]
      },
      {
        path: '/wx',
        component: RouteView,
        redirect: '/wx/userBind',
        meta: { title: '微信管理', keepAlive: true, icon: wxyhbd, permission: ['center', 'group'] },
        children: [{
            path: '/wx/userBind',
            name: 'wxUserBind',
            component: () => import('@/views/wx/userBind'),
            meta: { title: '微信用户绑定', keepAlive: true, icon: wxyhbd, isBack: false, permission: ['center', 'group'] }
          },
          {
            path: '/wx/questionReview',
            name: 'wxQuestionReview',
            component: () => import('@/views/wx/questionReview'),
            meta: { title: '微信问卷审阅', keepAlive: true, icon: wenjuan, isBack: false, permission: ['center', 'group'] }
          }, {
            path: '/wx/patientReportReview',
            name: 'wxPatientReportReview',
            component: () => import('@/views/wx/patientReportReview'),
            meta: { title: '患者报告审阅', keepAlive: true, icon: hzbgsy, isBack: false, permission: ['center', 'group'] }
          },
          {
            path: '/wx/ticketRegister',
            name: 'wxTicketRegister',
            component: () => import('@/views/wx/ticketRegister'),
            meta: { title: '活动券登记', keepAlive: true, icon: huodongquan, isBack: false, permission: ['center', 'group'] }
          },
        ]
      },
      {
        path: '/report',
        component: RouteView,
        redirect: '/report/index',
        meta: { title: '报表管理', keepAlive: true, icon: baogao, permission: ['center', 'group'] },
        children: [{
            path: '/report/index',
            name: 'report',
            component: () => import('@/views/report/index'),
            meta: { title: '数据统计', keepAlive: true, icon: baogao, isBack: false, permission: ['center', 'group'] }
          }, {
            path: '/reportApply/index',
            name: 'reportApply',
            component: () => import('@/views/reportApply/index'),
            meta: { title: '申请开通报表', keepAlive: true, icon: blzysh, isBack: false, permission: ['center', 'group'] }
          },
          {
            path: '/score/list',
            name: 'scoreList',
            component: () => import('@/views/score/list'),
            meta: { title: '支扩评分报表', keepAlive: true, icon: baogao, isBack: false, permission: ['center', 'group'] }
          },
          {
            path: '/reportApply/review',
            name: 'reportReview',
            component: () => import('@/views/reportApply/review'),
            meta: { title: '开通报表审核', keepAlive: true, icon: blzysh, isBack: false, permission: ['center', 'group'] }
          }
        ]
      },
      {
        path: '/list/basis/:id(\\d*)',
        name: 'basis',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/Index'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/jxjzq/:id(\\d*)',
        name: 'jxjzq',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/jxjzq'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/1',
        name: 'mask1',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-1'),
        meta: { maskId: 1, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/2',
        name: 'mask2',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-2'),
        meta: { maskId: 2, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/5',
        name: 'mask5',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-5'),
        meta: { maskId: 5, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/6',
        name: 'mask6',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-6'),
        meta: { maskId: 6, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/7',
        name: 'mask7',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-7'),
        meta: { maskId: 7, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/8',
        name: 'mask8',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-8'),
        meta: { maskId: 8, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/9',
        name: 'mask9',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-9'),
        meta: { maskId: 9, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/10',
        name: 'mask10',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-10'),
        meta: { maskId: 10, permission: ['center', 'group'] }
      },
      {
        path: '/list/basis/:id(\\d+)/4',
        name: 'mask4',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/components/mask-4'),
        meta: { maskId: 4, permission: ['center', 'group'] }
      },
      {
        path: '/basis/question/:id(\\d+)/:qid(\\d+)',
        name: 'BasisQuestion',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/account/center/question'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d*)',
        name: 'taskTotal',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/task/total'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/11',
        name: 'task11',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-11'),
        meta: { maskId: 11, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/14',
        name: 'task14',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-14'),
        meta: { maskId: 14, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/15',
        name: 'task15',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-15'),
        meta: { maskId: 15, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/19',
        name: 'task19',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-19'),
        meta: { maskId: 19, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/20',
        name: 'task20',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-20'),
        meta: { maskId: 20, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/21',
        name: 'task21',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-21'),
        meta: { maskId: 21, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/22',
        name: 'task22',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-22'),
        meta: { maskId: 22, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/23',
        name: 'task23',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-23'),
        meta: { maskId: 23, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/24',
        name: 'task24',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-24'),
        meta: { maskId: 24, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/17',
        name: 'task17',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-17'),
        meta: { maskId: 17, permission: ['center', 'group'] }
      },
      {
        path: '/list/task/:id(\\d+)/18',
        name: 'task18',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/components/mask-18'),
        meta: { maskId: 18, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/index',
        name: 'Gallery',
        component: () => import('@/views/gallery/index'),
        meta: { title: '报告采集', keepAlive: true, icon: baogao, isBack: false, permission: ['center', 'group'] }
      },
      {
        path: '/group/index',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '入组管理', keepAlive: true, icon: ruzhu, isBack: false, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/execute/:id(\\d+)/53',
        name: 'Exec53',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/gallery/components/mask-53'),
        meta: { maskId: 53, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/execute/:id(\\d+)/51',
        name: 'Exec51',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/gallery/components/mask-51'),
        meta: { maskId: 51, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/execute/:id(\\d+)/52',
        name: 'Exec52',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/gallery/components/mask-52'),
        meta: { maskId: 52, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/execute/:id(\\d+)/54',
        name: 'Exec54',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/gallery/components/mask-54'),
        meta: { maskId: 54, permission: ['center', 'group'] }
      },
      {
        path: '/gallery/execute/:id(\\d+)',
        name: 'galleryExec',
        hidden: true,
        hideChildrenInMenu: true,
        component: () => import('@/views/gallery/execute'),
        meta: { permission: ['center', 'group'] }
      },


      {
        path: '/wx/questionDetail/:id(\\d*)',
        name: 'wxQuestionDetail',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/wx/questionDetail'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/wx/article',
        name: 'wxArticle',
        component: () => import('@/views/wx/article'),
        meta: { title: '微信文章', keepAlive: true, icon: jkzs, isBack: false, permission: ['group'] }
      },
      {
        path: '/gw/article',
        name: 'gwArticle',
        component: () => import('@/views/gw/article'),
        meta: { title: '官网文章', keepAlive: true, icon: jkzs, isBack: false, permission: ['group'] }
      },
      {
        path: '/wx/famousDoctor',
        name: 'famousDoctor',
        component: () => import('@/views/wx/famousDoctor'),
        meta: { title: '名医专家', keepAlive: true, icon: myzj, isBack: false, permission: ['group'] }
      },
      {
        path: '/gw/pageConfigure',
        name: 'pageConfigure',
        component: () => import('@/views/gw/pageConfigure'),
        meta: { title: '官网首页配置', keepAlive: true, icon: webconfig, isBack: false, permission: ['group'] }
      },
      {
        path: '/gallery/detail/:id(\\d*)',
        name: 'collectDetail',
        hidden: true,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/account/center/collect'),
        meta: { permission: ['center', 'group'] }
      },
      {
        path: '/group/addProject',
        name: 'addProject',
        hidden: true,
        component: () => import('@/views/group/addProject'),
        meta: { hiddenHeaderContent: true, hidden: true }
      },
      {
        path: '/center/list',
        name: 'centerList',
        component: () => import('@/views/center/list'),
        meta: { title: '中心管理', keepAlive: true, icon: wxyhbd, isBack: false, permission: ['center', 'group'] }
      },
      {
        path: '/role/list',
        name: 'roleList',
        component: () => import('@/views/role/list'),
        meta: { title: '角色管理', keepAlive: true, icon: wxyhbd, isBack: false, permission: ['center', 'group'] }
      },
      {
        path: '/user/list',
        name: 'userList',
        component: () => import('@/views/user/list'),
        meta: { title: '用户管理', keepAlive: true, icon: wxyhbd, isBack: false, permission: ['center', 'group'] }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  /*{
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
  },*/

  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]