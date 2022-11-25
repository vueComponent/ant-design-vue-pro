import _extends from 'babel-runtime/helpers/extends';
import Vue from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getComponentFromProp } from '../_util/props-util';
import defaultRenderEmpty from './renderEmpty';
import Base from '../base';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

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
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    renderEmpty: PropTypes.func,
    csp: PropTypes.object,
    autoInsertSpaceInButton: PropTypes.bool,
    locale: PropTypes.object,
    pageHeader: PropTypes.object,
    transformCellText: PropTypes.func
  },
  provide: function provide() {
    var _self = this;
    this._proxyVm = new Vue({
      data: function data() {
        return _extends({}, _self.$props, {
          getPrefixCls: _self.getPrefixCls,
          renderEmpty: _self.renderEmptyComponent
        });
      }
    });
    return {
      configProvider: this._proxyVm._data
    };
  },

  watch: _extends({}, getWatch(['prefixCls', 'csp', 'autoInsertSpaceInButton', 'locale', 'pageHeader', 'transformCellText'])),
  methods: {
    renderEmptyComponent: function renderEmptyComponent(h, name) {
      var renderEmpty = getComponentFromProp(this, 'renderEmpty', {}, false) || defaultRenderEmpty;
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
        LocaleProvider,
        {
          attrs: { locale: this.locale || legacyLocale, _ANT_MARK__: ANT_MARK }
        },
        [this.$slots['default'] ? filterEmpty(this.$slots['default'])[0] : null]
      );
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];

    return h(LocaleReceiver, {
      scopedSlots: { 'default': function _default(_, __, legacyLocale) {
          return _this.renderProvider(legacyLocale);
        } }
    });
  }
};

/* istanbul ignore next */
ConfigProvider.install = function (Vue) {
  Vue.use(Base);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;