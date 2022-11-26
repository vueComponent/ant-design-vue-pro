const validateOptions = require('./lib/validateOptions');
const isString = require('./lib/isString');
const getContainingNode = require('./lib/getContainingNode');
const sortNode = require('./lib/order/sortNode');
const sortNodeProperties = require('./lib/properties-order/sortNodeProperties');

module.exports = (opts) => {
	return {
		postcssPlugin: 'postcss-sorting',
		Root(css) {
			plugin(css, opts);
		},
	};
};

module.exports.postcss = true;

function plugin(css, opts) {
	const validatedOptions = validateOptions(opts);

	if (validatedOptions !== true) {
		const throwValidateErrors = (opts && opts['throw-validate-errors']) || false;

		if (throwValidateErrors) {
			if (isString(validatedOptions)) {
				throw new Error(validatedOptions);
			}

			throw new Error(`postcss-sorting: Invalid config.`);
		} else {
			// eslint-disable-next-line no-console
			if (console && console.warn && isString(validatedOptions)) {
				console.warn(validatedOptions); // eslint-disable-line no-console
			}

			return;
		}
	}

	if (opts.order) {
		css.walk((input) => {
			const node = getContainingNode(input);

			sortNode(node, opts.order);
		});
	}

	if (opts['properties-order']) {
		css.walk((input) => {
			const node = getContainingNode(input);

			sortNodeProperties(node, {
				order: opts['properties-order'],
				unspecifiedPropertiesPosition: opts['unspecified-properties-position'] || 'bottom',
			});
		});
	}
}
