const contains = require('../array/contains');
const values = require('./values');

module.exports = (obj, value) => contains(values(obj), value);
