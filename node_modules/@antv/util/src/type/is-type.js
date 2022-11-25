const toString = {}.toString;
const isType = (value, type) => toString.call(value) === '[object ' + type + ']';

module.exports = isType;
