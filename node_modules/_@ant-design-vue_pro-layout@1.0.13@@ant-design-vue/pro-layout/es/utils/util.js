import triggerEvent from 'ant-design-vue/es/_util/triggerEvent';
import { inBrowser } from 'ant-design-vue/es/_util/env';

var getComponentFromProp = function getComponentFromProp(instance, prop) {
  var slots = instance.slots && instance.slots();
  return slots[prop] || instance.props[prop];
};

var isFun = function isFun(func) {
  return typeof func === 'function';
}; // 兼容 0.3.4~0.3.8


export var contentWidthCheck = function contentWidthCheck(contentWidth) {
  return Object.prototype.toString.call(contentWidth) === '[object Boolean]' ? contentWidth === true && 'Fixed' || 'Fluid' : contentWidth;
};
export var layoutContentWidth = function layoutContentWidth(contentType) {
  return contentType !== 'Fluid';
};
var themeConfig = {
  daybreak: 'daybreak',
  '#1890FF': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#52C41A': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple'
};

var invertKeyValues = function invertKeyValues(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[obj[key]] = key;
    return acc;
  }, {});
};
/**
 * #1890ff -> daybreak
 * @param val
 */


export function genThemeToString(val) {
  return val && themeConfig[val] ? themeConfig[val] : val;
}
/**
 * daybreak-> #1890ff
 * @param val
 */

export function genStringToTheme(val) {
  var stringConfig = invertKeyValues(themeConfig);
  return val && stringConfig[val] ? stringConfig[val] : val;
}
export { triggerEvent, inBrowser, getComponentFromProp, isFun };