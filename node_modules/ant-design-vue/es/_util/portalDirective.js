export function antPortal(Vue) {
  return Vue.directive('ant-portal', {
    inserted: function inserted(el, binding) {
      var value = binding.value;

      var parentNode = typeof value === 'function' ? value(el) : value;
      if (parentNode !== el.parentNode) {
        parentNode.appendChild(el);
      }
    },
    componentUpdated: function componentUpdated(el, binding) {
      var value = binding.value;

      var parentNode = typeof value === 'function' ? value(el) : value;
      if (parentNode !== el.parentNode) {
        parentNode.appendChild(el);
      }
    }
  });
}

export default {
  install: function install(Vue) {
    antPortal(Vue);
  }
};