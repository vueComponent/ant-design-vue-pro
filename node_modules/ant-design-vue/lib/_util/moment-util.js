'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.momentToString = exports.stringToMoment = exports.TimeOrTimesType = exports.TimesType = exports.TimeType = undefined;
exports.checkValidate = checkValidate;

var _interopDefault = require('./interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _warning = require('./warning');

var _warning2 = _interopRequireDefault(_warning);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TimeType = exports.TimeType = {
  validator: function validator(value) {
    return typeof value === 'string' || (0, _isNil2['default'])(value) || moment.isMoment(value);
  }
};

var TimesType = exports.TimesType = {
  validator: function validator(value) {
    if (Array.isArray(value)) {
      return value.length === 0 || value.findIndex(function (val) {
        return typeof val !== 'string';
      }) === -1 || value.findIndex(function (val) {
        return !(0, _isNil2['default'])(val) && !moment.isMoment(val);
      }) === -1;
    }
    return false;
  }
};

var TimeOrTimesType = exports.TimeOrTimesType = {
  validator: function validator(value) {
    if (Array.isArray(value)) {
      return value.length === 0 || value.findIndex(function (val) {
        return typeof val !== 'string';
      }) === -1 || value.findIndex(function (val) {
        return !(0, _isNil2['default'])(val) && !moment.isMoment(val);
      }) === -1;
    } else {
      return typeof value === 'string' || (0, _isNil2['default'])(value) || moment.isMoment(value);
    }
  }
};

function checkValidate(componentName, value, propName, valueFormat) {
  var values = Array.isArray(value) ? value : [value];
  values.forEach(function (val) {
    if (!val) return;
    valueFormat && (0, _warning2['default'])((0, _interopDefault2['default'])(moment)(val, valueFormat).isValid(), componentName, 'When set `valueFormat`, `' + propName + '` should provides invalidate string time. ');
    !valueFormat && (0, _warning2['default'])((0, _interopDefault2['default'])(moment).isMoment(val) && val.isValid(), componentName, '`' + propName + '` provides invalidate moment time. If you want to set empty value, use `null` instead.');
  });
}
var stringToMoment = exports.stringToMoment = function stringToMoment(value, valueFormat) {
  if (Array.isArray(value)) {
    return value.map(function (val) {
      return typeof val === 'string' && val ? (0, _interopDefault2['default'])(moment)(val, valueFormat) : val || null;
    });
  } else {
    return typeof value === 'string' && value ? (0, _interopDefault2['default'])(moment)(value, valueFormat) : value || null;
  }
};

var momentToString = exports.momentToString = function momentToString(value, valueFormat) {
  if (Array.isArray(value)) {
    return value.map(function (val) {
      return (0, _interopDefault2['default'])(moment).isMoment(val) ? val.format(valueFormat) : val;
    });
  } else {
    return (0, _interopDefault2['default'])(moment).isMoment(value) ? value.format(valueFormat) : value;
  }
};