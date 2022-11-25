const { isObject, isString } = require('../../utils/validateType');

module.exports = function validatePrimaryOption(actualOptions) {
	// Otherwise, begin checking array options
	if (!Array.isArray(actualOptions)) {
		return false;
	}

	// Every item in the array must be a certain string or an object
	// with a "type" property
	if (
		!actualOptions.every((item) => {
			if (isString(item)) {
				return [
					'custom-properties',
					'dollar-variables',
					'at-variables',
					'declarations',
					'rules',
					'at-rules',
					'less-mixins',
				].includes(item);
			}

			return isObject(item) && item.type !== undefined;
		})
	) {
		return false;
	}

	const objectItems = actualOptions.filter(isObject);

	if (
		!objectItems.every((item) => {
			let result = true;

			if (item.type !== 'at-rule' && item.type !== 'rule') {
				return false;
			}

			if (item.type === 'at-rule') {
				// if parameter is specified, name should be specified also
				if (item.parameter !== undefined && item.name === undefined) {
					return false;
				}

				if (item.hasBlock !== undefined) {
					result = item.hasBlock === true || item.hasBlock === false;
				}

				if (item.name !== undefined) {
					result = isString(item.name) && item.name.length;
				}

				if (item.parameter !== undefined) {
					result =
						(isString(item.parameter) && item.parameter.length) ||
						isRegExp(item.parameter);
				}
			}

			if (item.type === 'rule') {
				if (item.selector !== undefined) {
					result =
						(isString(item.selector) && item.selector.length) ||
						isRegExp(item.selector);
				}

				if (result && item.name !== undefined) {
					result = isString(item.name) && item.name.length;
				}
			}

			return result;
		})
	) {
		return false;
	}

	return true;
};

function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}
