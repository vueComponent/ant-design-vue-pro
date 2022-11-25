function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import './index.less';
import omit from 'omit.js';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import 'ant-design-vue/es/divider/style';
import Divider from 'ant-design-vue/es/divider';
import 'ant-design-vue/es/drawer/style';
import Drawer from 'ant-design-vue/es/drawer';
import 'ant-design-vue/es/list/style';
import List from 'ant-design-vue/es/list';
import 'ant-design-vue/es/switch/style';
import Switch from 'ant-design-vue/es/switch';
import 'ant-design-vue/es/button/style';
import Button from 'ant-design-vue/es/button';
import 'ant-design-vue/es/icon/style';
import Icon from 'ant-design-vue/es/icon';
import 'ant-design-vue/es/alert/style';
import Alert from 'ant-design-vue/es/alert';
import antPortal from 'ant-design-vue/es/_util/portalDirective';
import 'ant-design-vue/es/message/style';
import message from 'ant-design-vue/es/message';
import BlockCheckbox from './BlockCheckbox';
import ThemeColor from './ThemeColor';
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange';
import { updateTheme, updateColorWeak } from '../../utils/dynamicTheme';
import { contentWidthCheck, genStringToTheme } from '../../utils/util';
import CopyToClipboard from 'vue-copy-to-clipboard';
var baseClassName = 'ant-pro-setting-drawer';
var BodyProps = {
  title: PropTypes.string.def('')
};
var Body = {
  props: BodyProps,
  render: function render(h) {
    var title = this.title;
    return h("div", {
      style: {
        marginBottom: 24
      }
    }, [h("h3", {
      "class": "".concat(baseClassName, "-title")
    }, [title]), this.$slots["default"]]);
  }
};

var defaultI18nRender = function defaultI18nRender(t) {
  return t;
};

var getThemeList = function getThemeList(i18nRender) {
  var list = window.umi_plugin_ant_themeVar || [];
  var themeList = [{
    key: 'light',
    url: 'https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg',
    title: i18nRender('app.setting.pagestyle.light')
  }, {
    key: 'dark',
    url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
    title: i18nRender('app.setting.pagestyle.dark')
  }];
  var darkColorList = [{
    key: '#1890ff',
    color: '#1890ff',
    theme: 'dark'
  }];
  var lightColorList = [{
    key: '#1890ff',
    color: '#1890ff',
    theme: 'dark'
  }];

  if (list.find(function (item) {
    return item.theme === 'dark';
  })) {
    themeList.push({
      // disable click
      disable: true,
      key: 'realDark',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/hmKaLQvmY2/LCkqqYNmvBEbokSDscrm.svg',
      title: i18nRender('app.setting.pagestyle.realdark')
    });
  } // insert  theme color List


  list.forEach(function (item) {
    var color = (item.modifyVars || {})['@primary-color'];

    if (item.theme === 'dark' && color) {
      darkColorList.push(_objectSpread({
        color: color
      }, item));
    }

    if (!item.theme || item.theme === 'light') {
      lightColorList.push(_objectSpread({
        color: color
      }, item));
    }
  });
  return {
    colorList: {
      dark: darkColorList,
      light: lightColorList
    },
    themeList: themeList
  };
};

var handleChangeSetting = function handleChangeSetting(key, value, hideMessageLoading) {
  if (key === 'primaryColor') {
    // 更新主色调
    updateTheme(value);
  }

  if (key === 'colorWeak') {
    updateColorWeak(value);
  }
};

var genCopySettingJson = function genCopySettingJson(settings) {
  return JSON.stringify(omit(_objectSpread({}, settings, {
    primaryColor: genStringToTheme(settings.primaryColor)
  }), ['colorWeak']), null, 2);
};

export var settings = {
  theme: PropTypes.oneOf(['dark', 'light', 'realDark']),
  primaryColor: PropTypes.string,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu']),
  colorWeak: PropTypes.bool,
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // 替换兼容 PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid')
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
  hideHintAlert: PropTypes.bool.def(false),
  hideCopyButton: PropTypes.bool.def(false)
};
export var SettingDrawerProps = {
  getContainer: PropTypes.func,
  settings: PropTypes.objectOf(settings),
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
};
var SettingDrawer = {
  name: 'SettingDrawer',
  props: SettingDrawerProps,
  inject: ['locale'],
  data: function data() {
    return {
      show: false
    };
  },
  render: function render(h) {
    var _this = this;

    var setShow = this.setShow,
        getContainer = this.getContainer,
        settings = this.settings;
    var _settings$theme = settings.theme,
        theme = _settings$theme === void 0 ? 'dark' : _settings$theme,
        _settings$primaryColo = settings.primaryColor,
        primaryColor = _settings$primaryColo === void 0 ? 'daybreak' : _settings$primaryColo,
        _settings$layout = settings.layout,
        layout = _settings$layout === void 0 ? 'sidemenu' : _settings$layout,
        _settings$fixedHeader = settings.fixedHeader,
        fixedHeader = _settings$fixedHeader === void 0 ? false : _settings$fixedHeader,
        _settings$fixSiderbar = settings.fixSiderbar,
        fixSiderbar = _settings$fixSiderbar === void 0 ? false : _settings$fixSiderbar,
        contentWidth = settings.contentWidth,
        hideHintAlert = settings.hideHintAlert,
        hideCopyButton = settings.hideCopyButton,
        colorWeak = settings.colorWeak;
    var i18n = this.$props.i18nRender || this.locale || defaultI18nRender;
    var themeList = getThemeList(i18n);
    var isTopMenu = layout === 'topmenu';
    var iconStyle = {
      color: '#fff',
      fontSize: 20
    };

    var changeSetting = function changeSetting(type, value) {
      _this.$emit('change', {
        type: type,
        value: value
      });

      handleChangeSetting(type, value, false);
    };

    return h(Drawer, {
      attrs: {
        visible: this.show,
        width: 300,
        placement: "right",
        getContainer: getContainer
        /*handle={
          <div class="ant-pro-setting-drawer-handle" onClick={() => setShow(!this.show)}>
            {this.show
              ? (<Icon type="close" style={iconStyle} />)
              : (<Icon type="setting" style={iconStyle} />)
            }
          </div>
        }*/

      },
      on: {
        "close": function close() {
          return setShow(false);
        }
      },
      style: {
        zIndex: 999
      }
    }, [h("template", {
      slot: "handle"
    }, [h("div", {
      "class": "".concat(baseClassName, "-handle"),
      on: {
        "click": function click() {
          return setShow(!_this.show);
        }
      }
    }, [this.show ? h(Icon, {
      attrs: {
        type: "close"
      },
      style: iconStyle
    }) : h(Icon, {
      attrs: {
        type: "setting"
      },
      style: iconStyle
    })])]), h("div", {
      "class": "".concat(baseClassName, "-content")
    }, [h(Body, {
      attrs: {
        title: i18n('app.setting.pagestyle')
      }
    }, [h(BlockCheckbox, {
      attrs: {
        i18nRender: i18n,
        list: themeList.themeList,
        value: theme
      },
      on: {
        "change": function change(val) {
          changeSetting('theme', val);
        }
      }
    })]), h(ThemeColor, {
      attrs: {
        i18nRender: i18n,
        title: i18n('app.setting.themecolor'),
        value: primaryColor,
        colors: themeList.colorList[theme === 'realDark' ? 'dark' : 'light']
      },
      on: {
        "change": function change(color) {
          changeSetting('primaryColor', color, null);
        }
      }
    }), h(Divider), h(Body, {
      attrs: {
        title: i18n('app.setting.navigationmode')
      }
    }, [h(BlockCheckbox, {
      attrs: {
        i18nRender: i18n,
        value: layout
      },
      on: {
        "change": function change(value) {
          changeSetting('layout', value, null);
        }
      }
    })]), h(LayoutSetting, {
      attrs: {
        i18nRender: i18n,
        contentWidth: contentWidth,
        fixedHeader: fixedHeader,
        fixSiderbar: isTopMenu ? false : fixSiderbar,
        layout: layout
      },
      on: {
        "change": function change(_ref) {
          var type = _ref.type,
              value = _ref.value;
          changeSetting(type, value);
        }
      }
    }), h(Divider), h(Body, {
      attrs: {
        title: i18n('app.setting.othersettings')
      }
    }, [h(List, {
      attrs: {
        split: false,
        renderItem: function renderItem(item) {
          return renderLayoutSettingItem(h, item);
        },
        dataSource: [{
          title: i18n('app.setting.weakmode'),
          action: h(Switch, {
            attrs: {
              size: "small",
              checked: !!colorWeak
            },
            on: {
              "change": function change(checked) {
                return changeSetting('colorWeak', checked);
              }
            }
          })
        }]
      }
    })]), hideHintAlert && hideCopyButton ? null : h(Divider), hideHintAlert ? null : h(Alert, {
      attrs: {
        type: "warning",
        message: i18n('app.setting.production.hint'),
        icon: h(Icon, {
          attrs: {
            type: 'notification'
          }
        }),
        showIcon: true
      },
      style: {
        marginBottom: '16px'
      }
    }), hideCopyButton ? null : h(CopyToClipboard, {
      attrs: {
        text: genCopySettingJson(settings)
      },
      on: {
        "copy": function copy() {
          return message.success(i18n('app.setting.copyinfo'));
        }
      }
    }, [h(Button, {
      attrs: {
        block: true
      }
    }, [h(Icon, {
      attrs: {
        type: 'copy'
      }
    }), i18n('app.setting.copy')])]), h("div", {
      "class": "".concat(baseClassName, "-content-footer")
    }, [this.$slots["default"]])])]);
  },
  methods: {
    setShow: function setShow(flag) {
      this.show = flag;
    }
  }
};

SettingDrawer.install = function (Vue) {
  Vue.use(antPortal);
  Vue.component(SettingDrawer.name, SettingDrawer);
};

export default SettingDrawer;