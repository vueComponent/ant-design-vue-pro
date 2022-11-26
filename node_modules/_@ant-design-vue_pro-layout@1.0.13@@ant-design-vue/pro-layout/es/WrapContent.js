import PropTypes from 'ant-design-vue/es/_util/vue-types';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import ConfigProvider from 'ant-design-vue/es/config-provider';
import GridContent from './components/GridContent';
var Content = Layout.Content;
var WrapContentProps = {
  isChildrenLayout: PropTypes.bool,
  location: PropTypes.any,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid')
};
var WrapContent = {
  name: 'WrapContent',
  props: WrapContentProps,
  render: function render(h) {
    var _this$$props = this.$props,
        isChildrenLayout = _this$$props.isChildrenLayout,
        contentWidth = _this$$props.contentWidth;
    return h(Content, [h(ConfigProvider, {
      attrs: {
        getPopupContainer: function getPopupContainer(el, dialogContext) {
          if (isChildrenLayout) {
            return el.parentNode();
          }

          return document.body;
        }
      }
    }, [h("div", {
      "class": "ant-pro-basicLayout-children-content-wrap"
    }, [h(GridContent, {
      attrs: {
        contentWidth: contentWidth
      }
    }, [this.$slots["default"]])])])]);
  }
};
export default WrapContent;