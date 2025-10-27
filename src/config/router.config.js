// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
/*
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
*/
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/workplace2',
            name: 'Workplace2',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace2', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/zhuomian',
            name: 'Zhuomian',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.zhuomian', keepAlive: false, permission: ['dashboard'] }
          }
          // 外部链接
          /*
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: 'menu.dashboard.monitor', target: '_blank' }
          },
          */
        ]
      },
      // 会员
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        redirect: '/user/userList',
        meta: { title: 'menu.user', icon: 'user', permission: ['user'] },
        children: [
          {
            path: '/user/userList/:pageNo([1-9]\\d*)?',
            name: 'UserList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/user/UserList'),
            meta: { title: 'menu.user.list', keepAlive: false, permission: ['user'] }
          },
          {
            path: '/user/bossVersion',
            name: 'BossVersion',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/user/BossVersion'),
            meta: { title: 'menu.user.list', keepAlive: false, permission: ['user'] }
          },
          {
            path: '/user/userAuth',
            name: 'UserAuth',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/user/UserAuth'),
            meta: { title: 'menu.user.list', keepAlive: false, permission: ['user'] }
          },
        ]
      },
      // 节点管理
      {
        path: '/node',
        redirect: '/node/list',
        component: RouteView,
        meta: { title: 'menu.node', icon: 'node', permission: ['node'] },
        children: [
          {
            path: '/node/list',
            name: 'NodeList',
            component: () => import('@/views/node/NodeList'),
            meta: { title: 'menu.node.NodeList', keepAlive: false, permission: ['node'] }
          },
          {
            path: '/node/price',
            name: 'NodePrice',
            component: () => import('@/views/node/NodePrice'),
            meta: { title: 'menu.node.NodePrice', keepAlive: false, permission: ['node'] }
          }
        ]
      },
      // 工单
      {
        path: '/ticket',
        redirect: '/ticket/list',
        component: RouteView,
        meta: { title: 'menu.ticket', icon: 'ticket', permission: ['ticket'] },
        children: [
          {
            path: '/ticket/list',
            name: 'TicketList',
            component: () => import('@/views/ticket/TicketList'),
            meta: { title: 'menu.ticket.TicketList', keepAlive: false, permission: ['ticket'] }
          }
        ]
      },
      // 上游管理
      {
        path: '/upstream',
        redirect: '/upstream/apiConfig',
        component: RouteView,
        meta: { title: 'menu.upstream', icon: 'upstream', permission: ['upstream'] },
        children: [
          {
            path: '/upstream/apiConfig',
            name: 'UpstreamApiConfig',
            component: () => import('@/views/upstream/UpstreamApiConfig'),
            meta: { title: 'menu.upstream.UpstreamApiConfig', keepAlive: false, permission: ['upstream'] }
          }
        ]
      },
      // 上游管理
      {
        path: '/buy',
        redirect: '/buy/record',
        component: RouteView,
        meta: { title: 'menu.buy', icon: 'buy', permission: ['buy'] },
        children: [
          {
            path: '/buy/record',
            name: 'BuyRecord',
            component: () => import('@/views/buy/BuyRecord'),
            meta: { title: 'menu.buy.BuyRecord', keepAlive: false, permission: ['buy'] }
          }
        ]
      },
      // 财务
      {
        path: '/finance',
        name: 'finance',
        redirect: '/finance/detail',
        component: RouteView,
        meta: { title: 'menu.finance', icon: 'finance', permission: ['finance'] },
        children: [
          {
            path: '/finance/detail',
            name: 'FinanceDetail',
            component: () => import('@/views/finance/FinanceDetail'),
            meta: { title: 'menu.finance.detail', keepAlive: false, permission: ['finance'] }
          }
        ]
      },
      {
        path: '/device',
        name: 'device',
        redirect: '/device/index',
        component: RouteView,
        meta: { title: 'menu.device', icon: 'device', permission: ['device'] },
        children: [
          {
            path: '/device/index',
            name: 'Device',
            component: () => import('@/views/device/Device'),
            meta: { title: 'menu.device.detail', keepAlive: false, permission: ['device'] }
          },
          {
            path: '/device/serviceApi',
            name: 'DeviceServiceApi',
            component: () => import('@/views/device/DeviceServiceApi'),
            meta: { title: 'menu.device.DeviceServiceApi', keepAlive: false, permission: ['device'] }
          }
        ]
      },
      // 提现管理
      {
        path: '/withdrawal',
        redirect: '/withdrawal/record',
        component: RouteView,
        meta: { title: 'menu.withdrawal', icon: 'withdrawal', permission: ['withdrawal'] },
        children: [
          {
            path: '/withdrawal/record',
            name: 'WithdrawalRecord',
            component: () => import('@/views/withdrawal/WithdrawalRecord'),
            meta: { title: 'menu.withdrawal.WithdrawalRecord', keepAlive: false, permission: ['withdrawal'] }
          },
          {
            path: '/withdrawal/bankAccount',
            name: 'WithdrawalBankAccount',
            component: () => import('@/views/withdrawal/WithdrawalBankAccount'),
            meta: { title: 'menu.withdraw.WithdrawalBankAccount', keepAlive: false, permission: ['withdrawal'] }
          },
          {
            path: '/withdrawal/config',
            name: 'WithdrawalConfig',
            component: () => import('@/views/withdrawal/WithdrawalConfig'),
            meta: { title: 'menu.withdraw.WithdrawalConfig', keepAlive: false, permission: ['withdrawal'] }
          },
          {
            path: '/withdrawal/allRecord',
            name: 'WithdrawalAllRecord',
            component: () => import('@/views/withdrawal/WithdrawalAllRecord'),
            meta: { title: 'menu.withdraw.WithdrawalAllRecord', keepAlive: false, permission: ['withdrawal'] }
          }
        ]
      },
      // 业务管理
      {
        path: '/business',
        redirect: '/business/list',
        component: RouteView,
        meta: { title: 'menu.business', icon: 'business', permission: ['business'] },
        children: [
          {
            path: '/business/list',
            name: 'BusinessList',
            component: () => import('@/views/business/BusinessList'),
            meta: { title: 'menu.business.BusinessList', keepAlive: false, permission: ['business'] }
          },
          {
            path: '/business/price',
            name: 'BizPrice',
            component: () => import('@/views/business/BizPrice'),
            meta: { title: 'menu.business.BizPrice', keepAlive: false, permission: ['business'] }
          },
          {
            path: '/business/priceGroup',
            name: 'BusinessPriceGroup',
            component: () => import('@/views/business/BusinessPriceGroup'),
            meta: { title: 'menu.business.BusinessPriceGroup', keepAlive: false, permission: ['business'] }
          },
          {
            path: '/business/script',
            name: 'BusinessScript',
            component: () => import('@/views/business/BusinessScript'),
            meta: { title: 'menu.business.BusinessScript', keepAlive: false, permission: ['business'] }
          }
        ]
      },
      // 公告
      {
        path: '/notice',
        redirect: '/notice/manage',
        component: RouteView,
        meta: { title: 'menu.notice', icon: 'notice', permission: ['notice'] },
        children: [
          {
            path: '/notice/manage',
            name: 'NoticeManage',
            component: () => import('@/views/notice/NoticeManage'),
            meta: { title: 'menu.notice.NoticeManage', keepAlive: false, permission: ['notice'] }
          },
          {
            path: '/noedebind/desc/',
            name: 'NodebindDesc',
            component: () => import('@/views/notice/NodebindDesc'),
            meta: { title: 'menu.notice.NodebindDesc', keepAlive: false, permission: ['notice'] }
          }
        ]
      },
      // 网站配置
      {
        path: '/web',
        redirect: '/web/basic',
        component: RouteView,
        meta: { title: 'menu.web', icon: 'web', permission: ['web'] },
        children: [
          {
            path: '/web/basic',
            name: 'WebBasic',
            component: () => import('@/views/web/WebBasic'),
            meta: { title: 'menu.web.WebBasic', keepAlive: false, permission: ['web'] }
          },
          {
            path: '/web/service',
            name: 'WebService',
            component: () => import('@/views/web/WebService'),
            meta: { title: 'menu.web.WebService', keepAlive: false, permission: ['web'] }
          },
          {
            path: '/web/beian',
            name: 'WebBeian',
            component: () => import('@/views/web/WebBeian'),
            meta: { title: 'menu.web.WebBeian', keepAlive: false, permission: ['web'] }
          },
          {
            path: '/web/domain',
            name: 'WebDomain',
            component: () => import('@/views/web/WebDomain'),
            meta: { title: 'menu.web.WebDomain', keepAlive: false, permission: ['web'] }
          }
        ]
      },
      // 域名
      {
        path: '/domain',
        redirect: '/domain/basic',
        component: RouteView,
        meta: { title: 'menu.domain', icon: 'domain', permission: ['domain'] },
        children: [
          {
            path: '/domain/basic',
            name: 'DomainBasic',
            component: () => import('@/views/domain/DomainBasic'),
            meta: { title: 'menu.domain.DomainBasic', keepAlive: false, permission: ['domain'] }
          },
          {
            path: '/domain/manage',
            name: 'DomainManage',
            component: () => import('@/views/domain/DomainManage'),
            meta: { title: 'menu.domain.DomainManage', keepAlive: false, permission: ['domain'] }
          }
        ]
      },
      // 短信
      {
        path: '/sms',
        redirect: '/sms/sendRecord',
        component: RouteView,
        meta: { title: 'menu.sms', icon: 'sms', permission: ['sms'] },
        children: [
          {
            path: '/sms/sendRecord',
            name: 'SmsSendRecord',
            component: () => import('@/views/sms/SmsSendRecord'),
            meta: { title: 'menu.sms.SmsSendRecord', keepAlive: false, permission: ['sms'] }
          },
          {
            path: '/sms/plan',
            name: 'SmsPlan',
            component: () => import('@/views/sms/SmsPlan'),
            meta: { title: 'menu.sms.SmsPlan', keepAlive: false, permission: ['sms'] }
          },
          {
            path: '/sms/balance',
            name: 'SmsBalance',
            component: () => import('@/views/sms/SmsBalance'),
            meta: { title: 'menu.sms.SmsBalance', keepAlive: false, permission: ['sms'] }
          },
          {
            path: '/sms/config',
            name: 'SmsConfig',
            component: () => import('@/views/sms/SmsConfig'),
            meta: { title: 'menu.sms.SmsConfig', keepAlive: false, permission: ['sms'] }
          }
        ]
      },
      // 接口配置
      {
        path: '/apiConfig',
        redirect: '/apiConfig/realnameVerifi',
        component: RouteView,
        meta: { title: 'menu.apiConfig', icon: 'apiConfig', permission: ['apiConfig'] },
        children: [
          {
            path: '/apiCconfig/realnameVerifi',
            name: 'RealnameVerifi',
            component: () => import('@/views/apiConfig/RealnameVerifi'),
            meta: { title: 'menu.apiConfig.RealnameVerifi', keepAlive: false, permission: ['apiConfig'] }
          },
          {
            path: '/apiCconfig/sms',
            name: 'SmsApiConfig',
            component: () => import('@/views/apiConfig/SmsApiConfig'),
            meta: { title: 'menu.apiConfig.SmsApiConfig', keepAlive: false, permission: ['apiConfig'] }
          }
        ]
      },
      // 日志
      {
        path: '/log',
        redirect: '/log/user',
        component: RouteView,
        meta: { title: 'menu.log', icon: 'log', permission: ['log'] },
        children: [
          {
            path: '/log/user',
            name: 'LogUser',
            component: () => import('@/views/log/LogUser'),
            meta: { title: 'menu.log.LogUser', keepAlive: false, permission: ['log'] }
          },
          {
            path: '/log/system',
            name: 'LogSystem',
            component: () => import('@/views/log/LogSystem'),
            meta: { title: 'menu.log.LogSystem', keepAlive: false, permission: ['log'] }
          }
        ]
      },
      // 其他
      {
        path: '/other',
        redirect: '/other/segment',
        component: RouteView,
        meta: { title: 'menu.other', icon: 'other', permission: ['other'] },
        children: [
          {
            path: '/other/segment',
            name: 'OtherSegment',
            component: () => import('@/views/other/OtherSegment'),
            meta: { title: 'menu.other.OtherSegment', keepAlive: false, permission: ['other'] }
          },
          {
            path: '/other/ip',
            name: 'OtherIp',
            component: () => import('@/views/other/OtherIp'),
            meta: { title: 'menu.other.OtherIp', keepAlive: false, permission: ['other'] }
          }
        ]
      },
      // 员工
      {
        path: '/staff',
        redirect: '/staff/manage',
        component: RouteView,
        meta: { title: 'menu.staff', icon: 'staff', permission: ['staff'] },
        children: [
          {
            path: '/staff/manage',
            name: 'StaffManage',
            component: () => import('@/views/staff/StaffManage'),
            meta: { title: 'menu.staff.StaffManage', keepAlive: false, permission: ['staff'] }
          },
          {
            path: '/staff/post',
            name: 'StaffPost',
            component: () => import('@/views/staff/StaffPost'),
            meta: { title: 'menu.staff.StaffPost', keepAlive: false, permission: ['staff'] }
          }
        ]
      },
      // 系统
      {
        path: '/system',
        redirect: '/system/security',
        component: RouteView,
        meta: { title: 'menu.system', icon: 'system', permission: ['system'] },
        children: [
          {
            path: '/system/security',
            name: 'Security',
            component: () => import('@/views/system/Security'),
            meta: { title: 'menu.system.Security', keepAlive: false, permission: ['system'] }
          }
        ]
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
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
export const constantRouterMap = [
  {
    path: '/index',
    component: UserLayout,
    redirect: '/index/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
