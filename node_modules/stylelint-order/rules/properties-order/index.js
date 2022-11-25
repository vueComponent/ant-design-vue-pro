const stylelint = require('stylelint');
const { getContainingNode, isRuleWithNodes } = require('../../utils');
const { isNumber } = require('../../utils/validateType');
const checkNodeForOrder = require('./checkNodeForOrder');
const checkNodeForEmptyLines = require('./checkNodeForEmptyLines');
const createOrderInfo = require('./createOrderInfo');
const validatePrimaryOption = require('./validatePrimaryOption');

const ruleName = require('./ruleName');
const messages = require('./messages');

function rule(primaryOption, options = {}, context = {}) {
	return function ruleBody(root, result) {
		let validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: primaryOption,
				possible: validatePrimaryOption,
			},
			{
				actual: options,
				possible: {
					unspecified: ['top', 'bottom', 'ignore', 'bottomAlphabetical'],
					emptyLineBeforeUnspecified: ['always', 'never', 'threshold'],
					emptyLineMinimumPropertyThreshold: isNumber,
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		let isFixEnabled = context.fix;
		let expectedOrder = createOrderInfo(primaryOption);

		let processedParents = [];

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(input) {
			let node = getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				checkNodeForOrder({
					node,
					isFixEnabled,
					primaryOption,
					unspecified: options.unspecified || 'ignore',
					result,
					expectedOrder,
				});

				checkNodeForEmptyLines({
					node,
					context,
					emptyLineBeforeUnspecified: options.emptyLineBeforeUnspecified,
					emptyLineMinimumPropertyThreshold:
						options.emptyLineMinimumPropertyThreshold || 0,
					expectedOrder,
					isFixEnabled,
					primaryOption,
					result,
				});
			}
		});
	};
}

rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
