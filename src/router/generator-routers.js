// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  // 首页
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),
  Monitor: () => import('@/views/dashboard/Monitor'),

  // 会员管理
  UserList: () => import('@/views/user/UserList'),
  BossVersion: () => import('@/views/user/BossVersion'),
  UserAuth: () => import('@/views/user/UserAuth'),

  // 节点
  NodeList: () => import('@/views/node/NodeList'),
  NodePrice: () => import('@/views/node/NodePrice'),

  // 工单
  TicketList: () => import('@/views/ticket/TicketList'),
  /* 上游管理 */
  // 接口配置
  UpstreamApiConfig: () => import('@/views/upstream/UpstreamApiConfig'),
  
  // 购买记录
  BuyRecord: () => import('@/views/buy/BuyRecord'),
  
  // 财务
  FinanceDetail: () => import('@/views/finance/FinanceDetail'),
  // 设备列表
  Device: () => import('@/views/device/Device'),
  DeviceServiceApi: () => import('@/views/device/DeviceServiceApi'),

  // 提现管理
  WithdrawalRecord: () => import('@/views/withdrawal/WithdrawalRecord'),
  WithdrawalBankAccount: () => import('@/views/withdrawal/WithdrawalBankAccount'),
  WithdrawalConfig: () => import('@/views/withdrawal/WithdrawalConfig'),
  WithdrawalAllRecord: () => import('@/views/withdrawal/WithdrawalAllRecord'),
  /* 业务管理 */
  // 业务列表
  BusinessList: () => import('@/views/business/BusinessList'),
  // 价格
  BizPrice: () => import('@/views/business/BizPrice'),
  // 价格分组
  BusinessPriceGroup: () => import('@/views/business/BusinessPriceGroup'),
  // 业务分类
  BusinessScript: () => import('@/views/business/BusinessScript'),
  
  // 公告
  NoticeManage: () => import('@/views/notice/NoticeManage'),
  // 上机说明
  NodebindDesc: () => import('@/views/notice/NodebindDesc'),
  // 网站配置
  WebBasic: () => import('@/views/web/WebBasic'),
  WebService: () => import('@/views/web/WebService'),
  WebBeian: () => import('@/views/web/WebBeian'),
  WebDomain: () => import('@/views/web/WebDomain'),
  // 域名
  DomainBasic: () => import('@/views/domain/DomainBasic'),
  DomainManage: () => import('@/views/domain/DomainManage'),
  // 短信
  SmsSendRecord: () => import('@/views/sms/SmsSendRecord'),
  SmsPlan: () => import('@/views/sms/SmsPlan'),
  SmsBalance: () => import('@/views/sms/SmsBalance'),
  SmsConfig: () => import('@/views/sms/SmsConfig'),

  // 接口配置
  RealnameVerifi: () => import('@/views/apiConfig/RealnameVerifi'),
  SmsApiConfig: () => import('@/views/apiConfig/SmsApiConfig'),
  // 日志
  LogUser: () => import('@/views/log/LogUser'),
  LogSystem: () => import('@/views/log/LogSystem'),

  // 其他
  OtherSegment: () => import('@/views/other/OtherSegment'),
  OtherIp: () => import('@/views/other/OtherIp'),
  // 员工
  StaffManage: () => import('@/views/staff/StaffManage'),
  StaffPost: () => import('@/views/staff/StaffPost'),
  // 系统
  Security: () => import('@/views/system/Security'),
  // form
  /*
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  TableList: () => import('@/views/list/TableList'),
  StandardList: () => import('@/views/list/BasicList'),
  // CardList: () => import('@/views/list/CardList'),
  SearchLayout: () => import('@/views/list/search/SearchLayout'),
  SearchArticles: () => import('@/views/list/search/Article'),
  SearchProjects: () => import('@/views/list/search/Projects'),
  SearchApplications: () => import('@/views/list/search/Applications'),
  ProfileBasic: () => import('@/views/profile/basic'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),
*/
  // result
  // ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  // ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500')

  // account
  /*
  AccountCenter: () => import('@/views/account/center'),
  AccountSettings: () => import('@/views/account/settings/Index'),
  BasicSetting: () => import('@/views/account/settings/BasicSetting'),
  SecuritySettings: () => import('@/views/account/settings/Security'),
  CustomSettings: () => import('@/views/account/settings/Custom'),
  BindingSettings: () => import('@/views/account/settings/Binding'),
  NotificationSettings: () => import('@/views/account/settings/Notification')
  */
  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/dashboard',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = token => {
  return new Promise((resolve, reject) => {
    loginService
      .getCurrentUserNav(token)
      .then(res => {
        // console.log('generatorDynamicRouter response:', JSON.stringify(res.data))
        // const { result } = res
        const menuNav = []
        const childrenNav = []
        //      后端数据, 根级树数组,  根级 PID
        listToTree(res.result, childrenNav, 0)
        // alert('childrenNav' + JSON.stringify(result))
        rootRouter.children = childrenNav
        menuNav.push(rootRouter)
        // alert('menuNav' + JSON.stringify(menuNav))
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        // alert('routers' + JSON.stringify(routers))
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  // console.log('routerMap', JSON.stringify(routerMap))
  return routerMap.map(item => {
    // alert(JSON.stringify(constantRouterComponents[item.component || item.key]))
    // alert(JSON.stringify(constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`))))
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
        /*
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ]
        */
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    // console.log('currentRouter', JSON.stringify(currentRouter))
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  // alert('child' + JSON.stringify(list))
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
