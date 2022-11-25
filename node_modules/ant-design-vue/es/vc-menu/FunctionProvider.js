import _defineProperty from 'babel-runtime/helpers/defineProperty';
export var injectExtraPropsKey = 'ANT_MENU_PROVIDER_PROPS_KEY';
var FunctionProvider = {
  inheritAttrs: false,
  provide: function provide() {
    return _defineProperty({}, injectExtraPropsKey, this);
  },
  render: function render() {
    var slots = this.$slots;

    return slots['default'][0];
  }
};

export default FunctionProvider;