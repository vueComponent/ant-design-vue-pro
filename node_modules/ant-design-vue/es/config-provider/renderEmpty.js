import PropTypes from '../_util/vue-types';
import Empty from '../empty';
import { ConfigConsumerProps } from './configConsumerProps';

var RenderEmpty = {
  functional: true,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  props: {
    componentName: PropTypes.string
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
          return h(Empty, {
            attrs: { image: Empty.PRESENTED_IMAGE_SIMPLE }
          });

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
        case 'Mentions':
          return h(Empty, {
            attrs: { image: Empty.PRESENTED_IMAGE_SIMPLE },
            'class': prefix + '-small' });

        default:
          return h(Empty);
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

export default renderEmpty;