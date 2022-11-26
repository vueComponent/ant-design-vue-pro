let stylelint = require('stylelint');
let checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
let { isStandardSyntaxProperty, isCustomProperty, vendor } = require('../../utils');

// eslint-disable-next-line max-params
module.exports = function checkNode(node, result, ruleName, messages) {
	let allPropData = [];

	node.each(function processEveryNode(child) {
		if (child.type !== 'decl') {
			return;
		}

		let { prop } = child;

		if (!isStandardSyntaxProperty(prop)) {
			return;
		}

		if (isCustomProperty(prop)) {
			return;
		}

		let unprefixedPropName = vendor.unprefixed(prop);

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedPropName.startsWith('osx-')) {
			unprefixedPropName = unprefixedPropName.slice(4);
		}

		let propData = {
			name: prop,
			unprefixedName: unprefixedPropName,
			index: allPropData.length,
			node: child,
		};

		let previousPropData = allPropData[allPropData.length - 1];

		allPropData.push(propData);

		// Skip first decl
		if (!previousPropData) {
			return;
		}

		let isCorrectOrder = checkAlphabeticalOrder(previousPropData, propData);

		if (isCorrectOrder) {
			return;
		}

		stylelint.utils.report({
			message: messages.expected(propData.name, previousPropData.name),
			node: child,
			result,
			ruleName,
		});
	});
};
