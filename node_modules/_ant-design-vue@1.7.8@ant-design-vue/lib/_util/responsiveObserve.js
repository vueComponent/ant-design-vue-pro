'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responsiveMap = exports.responsiveArray = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
var enquire = void 0;

// TODO: Will be removed in antd 4.0 because we will no longer support ie9
if (typeof window !== 'undefined') {
  var matchMediaPolyfill = function matchMediaPolyfill(mediaQuery) {
    return {
      media: mediaQuery,
      matches: false,
      addListener: function addListener() {},
      removeListener: function removeListener() {}
    };
  };
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!window.matchMedia) window.matchMedia = matchMediaPolyfill;
  // eslint-disable-next-line global-require
  enquire = require('enquire.js');
}

var responsiveArray = exports.responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

var responsiveMap = exports.responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

var subscribers = [];
var subUid = -1;
var screens = {};

var responsiveObserve = {
  dispatch: function dispatch(pointMap) {
    screens = pointMap;
    if (subscribers.length < 1) {
      return false;
    }

    subscribers.forEach(function (item) {
      item.func(screens);
    });

    return true;
  },
  subscribe: function subscribe(func) {
    if (subscribers.length === 0) {
      this.register();
    }
    var token = (++subUid).toString();
    subscribers.push({
      token: token,
      func: func
    });
    func(screens);
    return token;
  },
  unsubscribe: function unsubscribe(token) {
    subscribers = subscribers.filter(function (item) {
      return item.token !== token;
    });
    if (subscribers.length === 0) {
      this.unregister();
    }
  },
  unregister: function unregister() {
    Object.keys(responsiveMap).map(function (screen) {
      return enquire.unregister(responsiveMap[screen]);
    });
  },
  register: function register() {
    var _this = this;

    Object.keys(responsiveMap).map(function (screen) {
      return enquire.register(responsiveMap[screen], {
        match: function match() {
          var pointMap = (0, _extends5['default'])({}, screens, (0, _defineProperty3['default'])({}, screen, true));
          _this.dispatch(pointMap);
        },
        unmatch: function unmatch() {
          var pointMap = (0, _extends5['default'])({}, screens, (0, _defineProperty3['default'])({}, screen, false));
          _this.dispatch(pointMap);
        },
        // Keep a empty destroy to avoid triggering unmatch when unregister
        destroy: function destroy() {}
      });
    });
  }
};

exports['default'] = responsiveObserve;