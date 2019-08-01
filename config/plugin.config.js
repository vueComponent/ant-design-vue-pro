const ThemeColorReplacer = require('webpack-theme-color-replacer')
const generate = require('@ant-design/colors/lib/generate').default

const getAntdSerials = (color) => {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}

const themePluginOption = {
  fileName: 'css/theme-colors-[contenthash:8].css',
  matchColors: getAntdSerials('#1890ff'), // 主色系列
  // 改变样式选择器，解决样式覆盖问题
  changeSelector (selector) {
    switch (selector) {
      case '.ant-calendar-today .ant-calendar-date':
        return ':not(.ant-calendar-selected-date):not(.ant-calendar-selected-day)' + selector
      case '.ant-btn:focus,.ant-btn:hover':
        return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
      case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
        return ':not(.ant-steps-item-process)' + selector
      case '.ant-btn.active,.ant-btn:active':
        return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
      case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
      case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
        return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'
      case '.ant-menu-horizontal > .ant-menu-item-selected > a':
        return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item-selected > a'
      case '.ant-menu-horizontal > .ant-menu-item > a:hover':
        return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item > a:hover'
      default :
        return selector
    }
  }
}

const createThemeColorReplacerPlugin = () => new ThemeColorReplacer(themePluginOption)

module.exports = createThemeColorReplacerPlugin
