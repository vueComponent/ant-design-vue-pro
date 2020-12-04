import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'
import menu from './en-US/menu'
import setting from './en-US/setting'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

export default {
  'message': '-',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Are you sure you would like to logout?',

  ...components,
  ...menu,
  ...setting
}
