'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _renderEmpty = require('./renderEmpty');

var _renderEmpty2 = _interopRequireDefault(_renderEmpty);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _localeProvider = require('../locale-provider');

var _localeProvider2 = _interopRequireDefault(_localeProvider);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getWatch() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var watch = {};
  keys.forEach(function (k) {
    watch[k] = function (value) {
      this._proxyVm._data[k] = value;
    };
  });
  return watch;
}

var ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: _vueTypes2['default'].func,
    prefixCls: _vueTypes2['default'].string,
    renderEmpty: _vueTypes2['default'].func,
    csp: _vueTypes2['default'].object,
    autoInsertSpaceInButton: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object,
    pageHeader: _vueTypes2['default'].object,
    transformCellText: _vueTypes2['default'].func
  },
  provide: function provide() {
    var _self = this;
    this._proxyVm = new _vue2['default']({
      data: function data() {
        return (0, _extends3['default'])({}, _self.$props, {
          getPrefixCls: _self.getPrefixCls,
          renderEmpty: _self.renderEmptyComponent
        });
      }
    });
    return {
      configProvider: this._proxyVm._data
    };
  },

  watch: (0, _extends3['default'])({}, getWatch(['prefixCls', 'csp', 'autoInsertSpaceInButton', 'locale', 'pageHeader', 'transformCellText'])),
  methods: {
    renderEmptyComponent: function renderEmptyComponent(h, name) {
      var renderEmpty = (0, _propsUtil.getComponentFromProp)(this, 'renderEmpty', {}, false) || _renderEmpty2['default'];
      return renderEmpty(h, name);
    },
    getPrefixCls: function getPrefixCls(suffixCls, customizePrefixCls) {
      var _$props$prefixCls = this.$props.prefixCls,
          prefixCls = _$props$prefixCls === undefined ? 'ant' : _$props$prefixCls;

      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? prefixCls + '-' + suffixCls : prefixCls;
    },
    renderProvider: function renderProvider(legacyLocale) {
      var h = this.$createElement;

      return h(
        _localeProvider2['default'],
        {
          attrs: { locale: this.locale || legacyLocale, _ANT_MARK__: _localeProvider.ANT_MARK }
        },
        [this.$slots['default'] ? (0, _propsUtil.filterEmpty)(this.$slots['default'])[0] : null]
      );
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      scopedSlots: { 'default': function _default(_, __, legacyLocale) {
          return _this.renderProvider(legacyLocale);
        } }
    });
  }
};

/* istanbul ignore next */
ConfigProvider.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

exports['default'] = ConfigProvider;