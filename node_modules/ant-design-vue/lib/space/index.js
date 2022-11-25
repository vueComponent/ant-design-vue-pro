'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpaceProps = exports.SpaceSizeType = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SpaceSizeType = exports.SpaceSizeType = _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].oneOf(['small', 'middle', 'large'])]);

var spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};

var SpaceProps = exports.SpaceProps = {
  prefixCls: _vueTypes2['default'].string,
  size: SpaceSizeType,
  direction: _vueTypes2['default'].oneOf(['horizontal', 'vertical']),
  align: _vueTypes2['default'].oneOf(['start', 'end', 'center', 'baseline'])
};

var Space = {
  functional: true,
  name: 'ASpace',
  props: (0, _propsUtil.initDefaultProps)(SpaceProps, {
    size: 'small',
    direction: 'horizontal'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
    var items = (0, _propsUtil.filterEmpty)(children);
    var len = items.length;

    if (len === 0) {
      return null;
    }

    var mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

    var someSpaceClass = [(_ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + direction, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-align-' + mergedAlign, mergedAlign), _ref)];

    if (content.data['class']) {
      someSpaceClass.push(content.data['class']);
    }

    var itemClassName = prefixCls + '-item';
    var marginDirection = 'marginRight'; // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([content.data, { 'class': someSpaceClass }]),
      [items.map(function (child, i) {
        return h(
          'div',
          {
            'class': itemClassName,
            key: itemClassName + '-' + i,
            style: i === len - 1 ? {} : (0, _defineProperty3['default'])({}, direction === 'vertical' ? 'marginBottom' : marginDirection, typeof size === 'string' ? spaceSize[size] + 'px' : size + 'px')
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
exports['default'] = Space;