const isString = require('./isString');

module.exports = function validateOptions(options) {
	if (options === undefined || options === null) {
		return false;
	}

	if (!isObject(options)) {
		return reportError('Options should be an object.');
	}

	if (options.order !== undefined && options.order !== null) {
		const validatedOrder = validateOrder(options.order);
		const { isValid, message } = validatedOrder;

		if (!isValid) {
			return reportInvalidOption('order', message);
		}
	}

	if (options['properties-order'] !== undefined && options['properties-order'] !== null) {
		const validatedPropertiesOrder = validatePropertiesOrder(options['properties-order']);
		const { isValid, message } = validatedPropertiesOrder;

		if (!isValid) {
			return reportInvalidOption('properties-order', message);
		}
	}

	if (
		options['unspecified-properties-position'] !== undefined &&
		options['unspecified-properties-position'] !== null
	) {
		const validatedUnspecifiedPropertiesPosition = validateUnspecifiedPropertiesPosition(
			options['unspecified-properties-position']
		);
		const { isValid, message } = validatedUnspecifiedPropertiesPosition;

		if (!isValid) {
			return reportInvalidOption('unspecified-properties-position', message);
		}
	}

	return true;
};

function reportError(errorMessage) {
	return `postcss-sorting: ${errorMessage}`;
}

function reportInvalidOption(optionName, optionError = 'Invalid value') {
	return reportError(`${optionName}: ${optionError}`);
}

function keywordsList(keywords) {
	return keywords.join(', ');
}

function validateOrder(options) {
	// Otherwise, begin checking array options
	if (!Array.isArray(options)) {
		return {
			isValid: false,
			message: 'Should be an array',
		};
	}

	const keywords = [
		'custom-properties',
		'dollar-variables',
		'at-variables',
		'declarations',
		'rules',
		'at-rules',
	];

	// Every item in the array must be a certain string or an object
	// with a "type" property
	if (
		!options.every((item) => {
			if (isString(item)) {
				return keywords.includes(item);
			}

			return isObject(item) && item.type !== undefined;
		})
	) {
		return {
			isValid: false,
			message: `Every item in the array must be an object with a "type" property, or one of keywords: ${keywordsList(
				keywords
			)}.`,
		};
	}

	const objectItems = options.filter(isObject);
	let wrongObjectItem;

	if (
		!objectItems.every((item) => {
			let result = true;

			if (item.type !== 'at-rule' && item.type !== 'rule') {
				wrongObjectItem = `"type" could be 'at-rule' or 'rule' only`;

				return false;
			}

			if (item.type === 'at-rule') {
				// if parameter is specified, name should be specified also
				if (item.parameter !== undefined && item.name === undefined) {
					wrongObjectItem = `"at-rule" with "parameter" should also has a "name"`;

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
			}

			if (!result) {
				wrongObjectItem = `Following option is incorrect: ${JSON.stringify(item)}`;
			}

			return result;
		})
	) {
		return {
			isValid: false,
			message: wrongObjectItem,
		};
	}

	return {
		isValid: true,
	};
}

function validatePropertiesOrder(options) {
	// Return true early if alphabetical
	if (options === 'alphabetical') {
		return {
			isValid: true,
		};
	}

	// Otherwise, begin checking array options
	if (!Array.isArray(options)) {
		return {
			isValid: false,
			message: 'Should be an array',
		};
	}

	// Every item in the array must be a string
	if (!options.every((item) => isString(item))) {
		return {
			isValid: false,
			message: 'Array should contain strings only',
		};
	}

	return {
		isValid: true,
	};
}

function validateUnspecifiedPropertiesPosition(options) {
	const keywords = ['top', 'bottom', 'bottomAlphabetical'];

	if (isString(options) && keywords.includes(options)) {
		return {
			isValid: true,
		};
	}

	return {
		isValid: false,
		message: `Option should be one of the following values: ${keywordsList(keywords)}.`,
	};
}

function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}

function isObject(value) {
	return typeof value === 'object' && value !== null;
}
