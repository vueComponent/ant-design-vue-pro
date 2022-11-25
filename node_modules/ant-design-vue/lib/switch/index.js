'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _vcSwitch = require('../vc-switch');

var _vcSwitch2 = _interopRequireDefault(_vcSwitch);

var _wave = require('../_util/wave');

var _wave2 = _interopRequireDefault(_wave);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Switch = {
  name: 'ASwitch',
  __ANT_SWITCH: true,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: _vueTypes2['default'].string,
    // size=default and size=large are the same
    size: _vueTypes2['default'].oneOf(['small', 'default', 'large']),
    disabled: _vueTypes2['default'].bool,
    checkedChildren: _vueTypes2['default'].any,
    unCheckedChildren: _vueTypes2['default'].any,
    tabIndex: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    checked: _vueTypes2['default'].bool,
    defaultChecked: _vueTypes2['default'].bool,
    autoFocus: _vueTypes2['default'].bool,
    loading: _vueTypes2['default'].bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },
  created: function created() {
    (0, _warning2['default'])((0, _propsUtil2['default'])(this, 'checked') || !(0, _propsUtil2['default'])(this, 'value'), 'Switch', '`value` is not validate prop, do you mean `checked`?');
  },
  render: function render() {
    var _classes;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        loading = _getOptionProps.loading,
        disabled = _getOptionProps.disabled,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'size', 'loading', 'disabled']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('switch', customizePrefixCls);

    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, prefixCls + '-small', size === 'small'), (0, _defineProperty3['default'])(_classes, prefixCls + '-loading', loading), _classes);
    var loadingIcon = loading ? h(_icon2['default'], {
      attrs: { type: 'loading' },
      'class': prefixCls + '-loading-icon' }) : null;
    var switchProps = {
      props: (0, _extends3['default'])({}, restProps, {
        prefixCls: prefixCls,
        loadingIcon: loadingIcon,
        checkedChildren: (0, _propsUtil.getComponentFromProp)(this, 'checkedChildren'),
        unCheckedChildren: (0, _propsUtil.getComponentFromProp)(this, 'unCheckedChildren'),
        disabled: disabled || loading
      }),
      on: (0, _propsUtil.getListeners)(this),
      'class': classes,
      ref: 'refSwitchNode'
    };
    return h(
      _wave2['default'],
      {
        attrs: { insertExtraNode: true }
      },
      [h(_vcSwitch2['default'], switchProps)]
    );
  }
};

/* istanbul ignore next */
Switch.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Switch.name, Switch);
};

exports['default'] = Switch;