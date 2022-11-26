var isArray = require('@antv/util/lib/type/is-array');

var isString = require('@antv/util/lib/type/is-string');

var INVALID_FIELD_ERR_MSG = 'Invalid field: it must be a string!';
var INVALID_FIELDS_ERR_MSG = 'Invalid fields: it must be an array!';
module.exports = {
  getField: function getField(options, defaultField) {
    var field = options.field,
        fields = options.fields;

    if (isString(field)) {
      return field;
    }

    if (isArray(field)) {
      console.warn(INVALID_FIELD_ERR_MSG);
      return field[0];
    }

    console.warn(INVALID_FIELD_ERR_MSG + " will try to get fields instead.");

    if (isString(fields)) {
      return fields;
    }

    if (isArray(fields) && fields.length) {
      return fields[0];
    }

    if (defaultField) {
      return defaultField;
    }

    throw new TypeError(INVALID_FIELD_ERR_MSG);
  },
  getFields: function getFields(options, defaultFields) {
    var field = options.field,
        fields = options.fields;

    if (isArray(fields)) {
      return fields;
    }

    if (isString(fields)) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return [fields];
    }

    console.warn(INVALID_FIELDS_ERR_MSG + " will try to get field instead.");

    if (isString(field)) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return [field];
    }

    if (isArray(field) && field.length) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return field;
    }

    if (defaultFields) {
      return defaultFields;
    }

    throw new TypeError(INVALID_FIELDS_ERR_MSG);
  }
};