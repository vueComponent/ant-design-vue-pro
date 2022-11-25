'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = formatDate;
function formatDate(value, format) {
  if (!value) {
    return '';
  }
  if (Array.isArray(format)) {
    format = format[0];
  }
  if (typeof format === 'function') {
    var result = format(value);
    if (typeof result === 'string') {
      return result;
    } else {
      throw new Error('The function of format does not return a string');
    }
  }
  return value.format(format);
}