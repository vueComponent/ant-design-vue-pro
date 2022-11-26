/**
 * @fileOverview 提取公共代码到util方法
 * @author dxq613@gmail.com
 */

const isString = require('@antv/util/lib/type/is-string');
const isDate = require('@antv/util/lib/type/is-date');

module.exports = {
  toTimeStamp(value) {
    if (isString(value)) {
      if (value.indexOf('T') > 0) {
        value = new Date(value).getTime();
      } else {
        value = new Date(value.replace(/-/ig, '/')).getTime();
      }
    }
    if (isDate(value)) {
      value = value.getTime();
    }
    return value;
  }
};
