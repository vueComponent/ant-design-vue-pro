import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var SpaceSizeType = PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['small', 'middle', 'large'])]);

var spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};

export var SpaceProps = {
  prefixCls: PropTypes.string,
  size: SpaceSizeType,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  align: PropTypes.oneOf(['start', 'end', 'center', 'baseline'])
};

var Space = {
  functional: true,
  name: 'ASpace',
  props: initDefaultProps(SpaceProps, {
    size: 'small',
    direction: 'horizontal'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render(h, content) {
    var _ref;

    var customizePrefixCls = content.prefixCls,
        configProvider = content.injections.configProvider,
        children = content.children;
    var _content$props = content.props,
        align = _content$props.align,
        size = _content$props.size,
        direction = _content$props.direction;


    var getPrefixCls = configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('space', customizePrefixCls);
    var items = filterEmpty(children);
    var len = items.length;

    if (len === 0) {
      return null;
    }

    var mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

    var someSpaceClass = [(_ref = {}, _defineProperty(_ref, prefixCls, true), _defineProperty(_ref, prefixCls + '-' + direction, true), _defineProperty(_ref, prefixCls + '-align-' + mergedAlign, mergedAlign), _ref)];

    if (content.data['class']) {
      someSpaceClass.push(content.data['class']);
    }

    var itemClassName = prefixCls + '-item';
    var marginDirection = 'marginRight'; // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

    return h(
      'div',
      _mergeJSXProps([content.data, { 'class': someSpaceClass }]),
      [items.map(function (child, i) {
        return h(
          'div',
          {
            'class': itemClassName,
            key: itemClassName + '-' + i,
            style: i === len - 1 ? {} : _defineProperty({}, direction === 'vertical' ? 'marginBottom' : marginDirection, typeof size === 'string' ? spaceSize[size] + 'px' : size + 'px')
          },
          [child]
        );
      })]
    );
  }
};

/* istanbul ignore next */
Space.install = function (Vue) {
  Vue.component(Space.name, Space);
};
export default Space;