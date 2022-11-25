let stylelint = require('stylelint');
let sortNodeProperties = require('postcss-sorting/lib/properties-order/sortNodeProperties');
let { namespace, getContainingNode, isRuleWithNodes } = require('../../utils');
let checkNode = require('./checkNode');

let ruleName = namespace('properties-alphabetical-order');

let messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(actual, options, context = {}) {
	return function ruleBody(root, result) {
		let validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual,
			possible: Boolean,
		});

		if (!validOptions) {
			return;
		}

		let processedParents = [];

		root.walk(function processRulesAndAtrules(input) {
			let node = getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				if (context.fix) {
					sortNodeProperties(node, { order: 'alphabetical' });
				} else {
					checkNode(node, result, ruleName, messages);
				}
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
