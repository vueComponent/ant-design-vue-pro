const client = require('webpack-theme-color-replacer/client')

export default {
  primaryColor: '#1890ff',
  getAntdSerials (color) {
    // 淡化（即less的tint）
    var lightens = new Array(9).fill().map((t, i) => {
      return client.varyColor.lighten(color, i / 10)
    })
    // 此处为了简化，采用了darken。实际按color.less需求可以引入tinycolor, colorPalette变换得到颜色值
    var darkens = new Array(6).fill().map((t, i) => {
      return client.varyColor.darken(color, i / 10)
    })
    return lightens.concat(darkens)
  },
  changeColor (newColor) {
    var lastColor = this.lastColor || this.primaryColor
    var options = {
      cssUrl: '/css/theme-colors.css',
      oldColors: this.getAntdSerials(lastColor), // current colors array. The same as `matchColors`
      newColors: this.getAntdSerials(newColor) // new colors array, one-to-one corresponde with `oldColors`
    }
    var promise = client.changer.changeColor(options)
    this.lastColor = lastColor
    return promise
  }
}
