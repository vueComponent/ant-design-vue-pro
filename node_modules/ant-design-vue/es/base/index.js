import antDirective from '../_util/antDirective';
var base = {};
var install = function install(Vue) {
  base.Vue = Vue;
  Vue.use(antDirective);
};
base.install = install;

export default base;