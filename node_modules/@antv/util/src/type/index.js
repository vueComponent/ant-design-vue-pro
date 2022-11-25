const isType = require('./is-type');

const checkType = {
  getType: require('./get-type'),
  isArray: require('./is-array'),
  isArrayLike: require('./is-array-like'),
  isBoolean: require('./is-boolean'),
  isFunction: require('./is-function'),
  isNil: require('./is-nil'),
  isNull: require('./is-null'),
  isNumber: require('./is-number'),
  isObject: require('./is-object'),
  isObjectLike: require('./is-object-like'),
  isPlainObject: require('./is-plain-object'),
  isPrototype: require('./is-prototype'),
  isType,
  isUndefined: require('./is-undefined'),
  isString: require('./is-string'),
  isRegExp: require('./is-reg-exp'),
  isDate: require('./is-date'),
  isArguments: require('./is-arguments'),
  isError: require('./is-error')
};

module.exports = checkType;
