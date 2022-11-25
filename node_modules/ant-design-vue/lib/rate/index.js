'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RateProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _vcRate = require('../vc-rate');

var _vcRate2 = _interopRequireDefault(_vcRate);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RateProps = exports.RateProps = {
  prefixCls: _vueTypes2['default'].string,
  count: _vueTypes2['default'].number,
  value: _vueTypes2['default'].value,
  defaultValue: _vueTypes2['default'].value,
  allowHalf: _vueTypes2['default'].bool,
  allowClear: _vueTypes2['default'].bool,
  tooltips: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  disabled: _vueTypes2['default'].bool,
  character: _vueTypes2['default'].any,
  autoFocus: _vueTypes2['default'].bool
};

var Rate = {
  name: 'ARate',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: RateProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    characterRender: function characterRender(node, _ref) {
      var index = _ref.index;
      var h = this.$createElement;
      var tooltips = this.$props.tooltips;

      if (!tooltips) return node;
      return h(
        _tooltip2['default'],
        {
          attrs: { title: tooltips[index] }
        },
        [node]
      );
    },
    focus: function focus() {
      this.$refs.refRate.focus();
    },
    blur: function blur() {
      this.$refs.refRate.blur();
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('rate', customizePrefixCls);

    var character = (0, _propsUtil.getComponentFromProp)(this, 'character') || h(_icon2['default'], {
      attrs: { type: 'star', theme: 'filled' }
    });
    var rateProps = {
      props: (0, _extends3['default'])({
        character: character,
        characterRender: this.characterRender,
        prefixCls: prefixCls
      }, (0, _omit2['default'])(restProps, ['tooltips'])),
      on: (0, _propsUtil.getListeners)(this),
      ref: 'refRate'
    };
    return h(_vcRate2['default'], rateProps);
  }
};

/* istanbul ignore next */
Rate.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Rate.name, Rate);
};
exports['default'] = Rate;