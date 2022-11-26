const each = require('../each');
const isFunction = require('../type/is-function');

const values = Object.values ? obj => Object.values(obj) : obj => {
  const result = [];
  each(obj, (value, key) => {
    if (!(isFunction(obj) && key === 'prototype')) {
      result.push(value);
    }
  });
  return result;
};

module.exports = values;
