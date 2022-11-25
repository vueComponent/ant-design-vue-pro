import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import defaultLocaleData from './default';

export default {
  name: 'LocaleReceiver',
  props: {
    componentName: PropTypes.string.def('global'),
    defaultLocale: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    children: PropTypes.func
  },
  inject: {
    localeData: { 'default': function _default() {
        return {};
      } }
  },
  methods: {
    getLocale: function getLocale() {
      var componentName = this.componentName,
          defaultLocale = this.defaultLocale;

      var locale = defaultLocale || defaultLocaleData[componentName || 'global'];
      var antLocale = this.localeData.antLocale;


      var localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return _extends({}, typeof locale === 'function' ? locale() : locale, localeFromContext || {});
    },
    getLocaleCode: function getLocaleCode() {
      var antLocale = this.localeData.antLocale;

      var localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return defaultLocaleData.locale;
      }
      return localeCode;
    }
  },
  render: function render() {
    var $scopedSlots = this.$scopedSlots;

    var children = this.children || $scopedSlots['default'];
    var antLocale = this.localeData.antLocale;

    return children(this.getLocale(), this.getLocaleCode(), antLocale);
  }
};