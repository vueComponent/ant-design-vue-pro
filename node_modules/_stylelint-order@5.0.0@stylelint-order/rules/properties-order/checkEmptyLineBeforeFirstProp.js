const stylelint = require('stylelint');
const { isString } = require('../../utils/validateType');
const ruleName = require('./ruleName');
const messages = require('./messages');
const hasEmptyLineBefore = require('./hasEmptyLineBefore');
const removeEmptyLinesBefore = require('./removeEmptyLinesBefore');

module.exports = function checkEmptyLineBeforeFirstProp({
	propData,
	primaryOption,
	emptyLineBeforeUnspecified,
	isFixEnabled,
	context,
	result,
}) {
	let emptyLineBefore = false;

	if (propData.orderData) {
		// Get an array of just the property groups, remove any solo properties
		let groups = primaryOption.filter((item) => !isString(item));

		emptyLineBefore =
			groups[propData.orderData.separatedGroup - 2] &&
			groups[propData.orderData.separatedGroup - 2].emptyLineBefore;
	} else if (emptyLineBeforeUnspecified) {
		emptyLineBefore = true;
	}

	if (emptyLineBefore && hasEmptyLineBefore(propData.node)) {
		if (isFixEnabled) {
			removeEmptyLinesBefore(propData.node, context.newline);
		} else {
			stylelint.utils.report({
				message: messages.rejectedEmptyLineBefore(propData.name),
				node: propData.node,
				result,
				ruleName,
			});
		}
	}
};
