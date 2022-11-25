const stylelint = require('stylelint');
const { getContainingNode, isRuleWithNodes } = require('../../utils');
const checkNode = require('./checkNode');
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
					unspecified: ['top', 'bottom', 'ignore'],
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		let unspecified = options.unspecified || 'ignore';
		let orderInfo = createOrderInfo(primaryOption);

		let processedParents = [];

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(originalNode) {
			let node = getContainingNode(originalNode);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				checkNode({
					node,
					isFixEnabled: context.fix,
					orderInfo,
					primaryOption,
					result,
					unspecified,
				});
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.primaryOptionArray = true;

module.exports = rule;
