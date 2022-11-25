import interopDefault from './interopDefault';
import * as moment from 'moment';
import warning from './warning';
import isNil from 'lodash/isNil';

export var TimeType = {
  validator: function validator(value) {
    return typeof value === 'string' || isNil(value) || moment.isMoment(value);
  }
};

export var TimesType = {
  validator: function validator(value) {
    if (Array.isArray(value)) {
      return value.length === 0 || value.findIndex(function (val) {
        return typeof val !== 'string';
      }) === -1 || value.findIndex(function (val) {
        return !isNil(val) && !moment.isMoment(val);
      }) === -1;
    }
    return false;
  }
};

export var TimeOrTimesType = {
  validator: function validator(value) {
    if (Array.isArray(value)) {
      return value.length === 0 || value.findIndex(function (val) {
        return typeof val !== 'string';
      }) === -1 || value.findIndex(function (val) {
        return !isNil(val) && !moment.isMoment(val);
      }) === -1;
    } else {
      return typeof value === 'string' || isNil(value) || moment.isMoment(value);
    }
  }
};

export function checkValidate(componentName, value, propName, valueFormat) {
  var values = Array.isArray(value) ? value : [value];
  values.forEach(function (val) {
    if (!val) return;
    valueFormat && warning(interopDefault(moment)(val, valueFormat).isValid(), componentName, 'When set `valueFormat`, `' + propName + '` should provides invalidate string time. ');
    !valueFormat && warning(interopDefault(moment).isMoment(val) && val.isValid(), componentName, '`' + propName + '` provides invalidate moment time. If you want to set empty value, use `null` instead.');
  });
}
export var stringToMoment = function stringToMoment(value, valueFormat) {
  if (Array.isArray(value)) {
    return value.map(function (val) {
      return typeof val === 'string' && val ? interopDefault(moment)(val, valueFormat) : val || null;
    });
  } else {
    return typeof value === 'string' && value ? interopDefault(moment)(value, valueFormat) : value || null;
  }
};

export var momentToString = function momentToString(value, valueFormat) {
  if (Array.isArray(value)) {
    return value.map(function (val) {
      return interopDefault(moment).isMoment(val) ? val.format(valueFormat) : val;
    });
  } else {
    return interopDefault(moment).isMoment(value) ? value.format(valueFormat) : value;
  }
};