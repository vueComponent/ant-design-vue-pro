import PropTypes from 'ant-design-vue/es/_util/vue-types';
var ProConfigProviderProps = {
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  breadcrumbRender: PropTypes.func
};
var ConfigProvider = {
  name: 'ProConfigProvider',
  props: ProConfigProviderProps,
  provide: function provide() {
    var _self = this;

    return {
      locale: _self.$props.i18nRender,
      contentWidth: _self.$props.contentWidth,
      breadcrumbRender: _self.$props.breadcrumbRender
    };
  },
  render: function render() {
    var $scopedSlots = this.$scopedSlots;
    var children = this.children || $scopedSlots["default"];
    return children();
  }
};
export default ConfigProvider;