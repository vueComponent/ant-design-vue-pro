"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settings = exports["default"] = exports.SettingDrawerProps = void 0;

require("./index.less");

var _omit = _interopRequireDefault(require("omit.js"));

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

require("ant-design-vue/es/divider/style");

var _divider = _interopRequireDefault(require("ant-design-vue/es/divider"));

require("ant-design-vue/es/drawer/style");

var _drawer = _interopRequireDefault(require("ant-design-vue/es/drawer"));

require("ant-design-vue/es/list/style");

var _list = _interopRequireDefault(require("ant-design-vue/es/list"));

require("ant-design-vue/es/switch/style");

var _switch = _interopRequireDefault(require("ant-design-vue/es/switch"));

require("ant-design-vue/es/button/style");

var _button = _interopRequireDefault(require("ant-design-vue/es/button"));

require("ant-design-vue/es/icon/style");

var _icon = _interopRequireDefault(require("ant-design-vue/es/icon"));

require("ant-design-vue/es/alert/style");

var _alert = _interopRequireDefault(require("ant-design-vue/es/alert"));

var _portalDirective = _interopRequireDefault(require("ant-design-vue/es/_util/portalDirective"));

require("ant-design-vue/es/message/style");

var _message = _interopRequireDefault(require("ant-design-vue/es/message"));

var _BlockCheckbox = _interopRequireDefault(require("./BlockCheckbox"));

var _ThemeColor = _interopRequireDefault(require("./ThemeColor"));

var _LayoutChange = _interopRequireWildcard(require("./LayoutChange"));

var _dynamicTheme = require("../../utils/dynamicTheme");

var _util = require("../../utils/util");

var _vueCopyToClipboard = _interopRequireDefault(require("vue-copy-to-clipboard"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseClassName = 'ant-pro-setting-drawer';
var BodyProps = {
  title: _vueTypes["default"].string.def('')
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
    (0, _dynamicTheme.updateTheme)(value);
  }

  if (key === 'colorWeak') {
    (0, _dynamicTheme.updateColorWeak)(value);
  }
};

var genCopySettingJson = function genCopySettingJson(settings) {
  return JSON.stringify((0, _omit["default"])(_objectSpread({}, settings, {
    primaryColor: (0, _util.genStringToTheme)(settings.primaryColor)
  }), ['colorWeak']), null, 2);
};

var settings = {
  theme: _vueTypes["default"].oneOf(['dark', 'light', 'realDark']),
  primaryColor: _vueTypes["default"].string,
  layout: _vueTypes["default"].oneOf(['sidemenu', 'topmenu']),
  colorWeak: _vueTypes["default"].bool,
  contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // 替换兼容 PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid')
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  fixedHeader: _vueTypes["default"].bool,
  fixSiderbar: _vueTypes["default"].bool,
  hideHintAlert: _vueTypes["default"].bool.def(false),
  hideCopyButton: _vueTypes["default"].bool.def(false)
};
exports.settings = settings;
var SettingDrawerProps = {
  getContainer: _vueTypes["default"].func,
  settings: _vueTypes["default"].objectOf(settings),
  i18nRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(false)
};
exports.SettingDrawerProps = SettingDrawerProps;
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

    return h(_drawer["default"], {
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
    }, [this.show ? h(_icon["default"], {
      attrs: {
        type: "close"
      },
      style: iconStyle
    }) : h(_icon["default"], {
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
    }, [h(_BlockCheckbox["default"], {
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
    })]), h(_ThemeColor["default"], {
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
    }), h(_divider["default"]), h(Body, {
      attrs: {
        title: i18n('app.setting.navigationmode')
      }
    }, [h(_BlockCheckbox["default"], {
      attrs: {
        i18nRender: i18n,
        value: layout
      },
      on: {
        "change": function change(value) {
          changeSetting('layout', value, null);
        }
      }
    })]), h(_LayoutChange["default"], {
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
    }), h(_divider["default"]), h(Body, {
      attrs: {
        title: i18n('app.setting.othersettings')
      }
    }, [h(_list["default"], {
      attrs: {
        split: false,
        renderItem: function renderItem(item) {
          return (0, _LayoutChange.renderLayoutSettingItem)(h, item);
        },
        dataSource: [{
          title: i18n('app.setting.weakmode'),
          action: h(_switch["default"], {
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
    })]), hideHintAlert && hideCopyButton ? null : h(_divider["default"]), hideHintAlert ? null : h(_alert["default"], {
      attrs: {
        type: "warning",
        message: i18n('app.setting.production.hint'),
        icon: h(_icon["default"], {
          attrs: {
            type: 'notification'
          }
        }),
        showIcon: true
      },
      style: {
        marginBottom: '16px'
      }
    }), hideCopyButton ? null : h(_vueCopyToClipboard["default"], {
      attrs: {
        text: genCopySettingJson(settings)
      },
      on: {
        "copy": function copy() {
          return _message["default"].success(i18n('app.setting.copyinfo'));
        }
      }
    }, [h(_button["default"], {
      attrs: {
        block: true
      }
    }, [h(_icon["default"], {
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
  Vue.use(_portalDirective["default"]);
  Vue.component(SettingDrawer.name, SettingDrawer);
};

var _default = SettingDrawer;
exports["default"] = _default;