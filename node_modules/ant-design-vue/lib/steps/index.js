'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _vcSteps = require('../vc-steps');

var _vcSteps2 = _interopRequireDefault(_vcSteps);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var getStepsProps = function getStepsProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: _vueTypes2['default'].string,
    iconPrefix: _vueTypes2['default'].string,
    current: _vueTypes2['default'].number,
    initial: _vueTypes2['default'].number,
    labelPlacement: _vueTypes2['default'].oneOf(['horizontal', 'vertical']).def('horizontal'),
    status: _vueTypes2['default'].oneOf(['wait', 'process', 'finish', 'error']),
    size: _vueTypes2['default'].oneOf(['default', 'small']),
    direction: _vueTypes2['default'].oneOf(['horizontal', 'vertical']),
    progressDot: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    type: _vueTypes2['default'].oneOf(['default', 'navigation'])
  };
  return (0, _propsUtil.initDefaultProps)(props, defaultProps);
};

var Steps = {
  name: 'ASteps',
  props: getStepsProps({
    current: 0
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  model: {
    prop: 'current',
    event: 'change'
  },
  Step: (0, _extends3['default'])({}, _vcSteps2['default'].Step, { name: 'AStep' }),
  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        customizeIconPrefixCls = props.iconPrefix;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('steps', customizePrefixCls);
    var iconPrefix = getPrefixCls('', customizeIconPrefixCls);

    var icons = {
      finish: h(_icon2['default'], {
        attrs: { type: 'check' },
        'class': prefixCls + '-finish-icon' }),
      error: h(_icon2['default'], {
        attrs: { type: 'close' },
        'class': prefixCls + '-error-icon' })
    };
    var stepsProps = {
      props: (0, _extends3['default'])({
        icons: icons,
        iconPrefix: iconPrefix,
        prefixCls: prefixCls
      }, props),
      on: (0, _propsUtil.getListeners)(this),
      scopedSlots: this.$scopedSlots
    };
    return h(
      _vcSteps2['default'],
      stepsProps,
      [this.$slots['default']]
    );
  }
};

/* istanbul ignore next */
Steps.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Steps.name, Steps);
  Vue.component(Steps.Step.name, Steps.Step);
};

exports['default'] = Steps;