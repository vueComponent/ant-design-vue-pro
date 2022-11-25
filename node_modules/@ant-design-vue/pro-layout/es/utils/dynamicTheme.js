import client from 'webpack-theme-color-replacer/client';
import generate from '@ant-design/colors/lib/generate';
import { message } from 'ant-design-vue';
export var themeColor = {
  getAntdSerials: function getAntdSerials(color) {
    // 淡化（即less的tint）
    var lightens = new Array(9).fill().map(function (t, i) {
      return client.varyColor.lighten(color, i / 10);
    }); // colorPalette 变换得到颜色值

    var colorPalettes = generate(color);
    var rgb = client.varyColor.toNum3(color.replace('#', '')).join(',');
    return lightens.concat(colorPalettes).concat(rgb);
  },
  changeColor: function changeColor(newColor) {
    var options = {
      newColors: this.getAntdSerials(newColor),
      // new colors array, one-to-one corresponde with `matchColors`
      changeUrl: function changeUrl(cssUrl) {
        return "/".concat(cssUrl); // while router is not `hash` mode, it needs absolute path
      }
    };
    return client.changer.changeColor(options, Promise);
  }
};
export var updateTheme = function updateTheme(newPrimaryColor) {
  var hideMessage = message.loading('正在切换主题', 0);
  themeColor.changeColor(newPrimaryColor).then(function (r) {
    hideMessage();
  });
};
export var updateColorWeak = function updateColorWeak(colorWeak) {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  var app = document.body.querySelector('#app .ant-pro-basicLayout');
  colorWeak ? app.classList.add('colorWeak') : app.classList.remove('colorWeak');
};