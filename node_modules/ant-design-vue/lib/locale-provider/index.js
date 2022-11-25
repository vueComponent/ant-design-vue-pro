'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANT_MARK = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _locale = require('../modal/locale');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export interface Locale {
//   locale: string;
//   Pagination?: Object;
//   DatePicker?: Object;
//   TimePicker?: Object;
//   Calendar?: Object;
//   Table?: Object;
//   Modal?: ModalLocale;
//   Popconfirm?: Object;
//   Transfer?: Object;
//   Select?: Object;
//   Upload?: Object;
// }
var ANT_MARK = exports.ANT_MARK = 'internalMark';
function setMomentLocale(locale) {
  if (locale && locale.locale) {
    (0, _interopDefault2['default'])(moment).locale(locale.locale);
  } else {
    (0, _interopDefault2['default'])(moment).locale('en');
  }
}

var LocaleProvider = {
  name: 'ALocaleProvider',
  props: {
    locale: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    _ANT_MARK__: _vueTypes2['default'].string
  },
  data: function data() {
    (0, _warning2['default'])(this._ANT_MARK__ === ANT_MARK, 'LocaleProvider', '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead');
    return {
      antLocale: (0, _extends3['default'])({}, this.locale, {
        exist: true
      })
    };
  },
  provide: function provide() {
    return {
      localeData: this.$data
    };
  },

  watch: {
    locale: function locale(val) {
      this.antLocale = (0, _extends3['default'])({}, this.locale, {
        exist: true
      });
      setMomentLocale(val);
      (0, _locale.changeConfirmLocale)(val && val.Modal);
    }
  },
  created: function created() {
    var locale = this.locale;

    setMomentLocale(locale);
    (0, _locale.changeConfirmLocale)(locale && locale.Modal);
  },
  beforeDestroy: function beforeDestroy() {
    (0, _locale.changeConfirmLocale)();
  },
  render: function render() {
    return this.$slots['default'] ? this.$slots['default'][0] : null;
  }
};

/* istanbul ignore next */
LocaleProvider.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(LocaleProvider.name, LocaleProvider);
};

exports['default'] = LocaleProvider;