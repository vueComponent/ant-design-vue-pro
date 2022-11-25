import './index.less';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { getComponentFromProp, hasProp } from "ant-design-vue/es/_util/props-util";
var GlobalFooterProps = {
  links: PropTypes.array,
  copyright: PropTypes.any
};
var GlobalFooter = {
  name: 'GlobalFooter',
  props: GlobalFooterProps,
  render: function render() {
    var h = arguments[0];
    var copyright = getComponentFromProp(this, 'copyright');
    var links = getComponentFromProp(this, 'links');
    var linksType = hasProp(links);
    return h("footer", {
      "class": "ant-pro-global-footer"
    }, [h("div", {
      "class": "ant-pro-global-footer-links"
    }, [linksType && links.map(function (link) {
      return h("a", {
        key: link.key,
        attrs: {
          title: link.key,
          target: link.blankTarget ? '_blank' : '_self',
          href: link.href
        }
      }, [link.title]);
    }) || links]), copyright && h("div", {
      "class": "ant-pro-global-footer-copyright"
    }, [copyright])]);
  }
};
export default GlobalFooter;