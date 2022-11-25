import { PageHeaderWrapper } from './components';
var PageView = {
  name: 'PageView',
  render: function render() {
    var h = arguments[0];
    return h(PageHeaderWrapper, [h("router-view")]);
  }
};
export default PageView;