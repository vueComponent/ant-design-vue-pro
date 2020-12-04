import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'
import menu from './zh-CN/menu'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

export default {
  'message': '-',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Do you really log-out.',

  ...components,
  ...menu
}
