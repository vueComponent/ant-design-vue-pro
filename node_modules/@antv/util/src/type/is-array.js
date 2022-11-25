const isType = require('./is-type');

const isArray = Array.isArray ? Array.isArray : value => isType(value, 'Array');

module.exports = isArray;
