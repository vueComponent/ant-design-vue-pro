function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import './index.less';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { layoutContentWidth } from '../../utils/util';
var GridContent = {
  name: 'GridContent',
  functional: true,
  props: {
    children: PropTypes.any,
    contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid')
  },
  render: function render(h, content) {
    var _classNames;

    var contentWidth = content.props.contentWidth;
    var children = content.children;
    var propsContentWidth = layoutContentWidth(contentWidth);
    var classNames = (_classNames = {}, _defineProperty(_classNames, 'ant-pro-grid-content', true), _defineProperty(_classNames, 'wide', propsContentWidth), _classNames);
    return h("div", {
      "class": classNames
    }, [children]);
  }
};
export default GridContent;