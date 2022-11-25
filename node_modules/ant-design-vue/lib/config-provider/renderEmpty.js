'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _empty = require('../empty');

var _empty2 = _interopRequireDefault(_empty);

var _configConsumerProps = require('./configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RenderEmpty = {
  functional: true,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  props: {
    componentName: _vueTypes2['default'].string
  },
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        injections = context.injections;

    function renderHtml(componentName) {
      var getPrefixCls = injections.configProvider.getPrefixCls;
      var prefix = getPrefixCls('empty');
      switch (componentName) {
        case 'Table':
        case 'List':
          return h(_empty2['default'], {
            attrs: { image: _empty2['default'].PRESENTED_IMAGE_SIMPLE }
          });

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
        case 'Mentions':
          return h(_empty2['default'], {
            attrs: { image: _empty2['default'].PRESENTED_IMAGE_SIMPLE },
            'class': prefix + '-small' });

        default:
          return h(_empty2['default']);
      }
    }
    return renderHtml(props.componentName);
  }
};

function renderEmpty(h, componentName) {
  return h(RenderEmpty, {
    attrs: { componentName: componentName }
  });
}

exports['default'] = renderEmpty;