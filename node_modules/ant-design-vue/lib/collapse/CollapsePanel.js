'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propsUtil = require('../_util/props-util');

var _vcCollapse = require('../vc-collapse');

var _vcCollapse2 = _interopRequireDefault(_vcCollapse);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACollapsePanel',
  props: (0, _extends3['default'])({}, (0, _vcCollapse.panelProps)()),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        _showArrow = this.showArrow,
        showArrow = _showArrow === undefined ? true : _showArrow;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('collapse', customizePrefixCls);

    var collapsePanelClassName = (0, _defineProperty3['default'])({}, prefixCls + '-no-arrow', !showArrow);
    var rcCollapePanelProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        prefixCls: prefixCls,
        extra: (0, _propsUtil.getComponentFromProp)(this, 'extra')
      }),
      'class': collapsePanelClassName,
      on: (0, _propsUtil.getListeners)(this)
    };
    var header = (0, _propsUtil.getComponentFromProp)(this, 'header');
    return h(
      _vcCollapse2['default'].Panel,
      rcCollapePanelProps,
      [this.$slots['default'], header ? h(
        'template',
        { slot: 'header' },
        [header]
      ) : null]
    );
  }
};