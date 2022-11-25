let stylelint = require('stylelint');
let ruleName = require('./ruleName');
let messages = require('./messages');

// eslint-disable-next-line max-params, consistent-return
module.exports = function checkOrder({
	firstNodeData,
	secondNodeData,
	allNodesData,
	isFixEnabled,
	result,
	unspecified,
}) {
	let firstNodeIsSpecified = Boolean(firstNodeData.expectedPosition);
	let secondNodeIsSpecified = Boolean(secondNodeData.expectedPosition);

	// If both nodes have their position
	if (firstNodeIsSpecified && secondNodeIsSpecified) {
		return firstNodeData.expectedPosition <= secondNodeData.expectedPosition;
	}

	if (!firstNodeIsSpecified && secondNodeIsSpecified) {
		// If first node is unspecified, look for a specified node before it
		// to compare to the current node
		let priorSpecifiedNodeData = allNodesData
			.slice(0, -1)
			.reverse()
			.find((node) => Boolean(node.expectedPosition));

		if (
			priorSpecifiedNodeData &&
			priorSpecifiedNodeData.expectedPosition &&
			priorSpecifiedNodeData.expectedPosition > secondNodeData.expectedPosition
		) {
			if (isFixEnabled) {
				// Don't go further, fix will be applied
				return false;
			}

			stylelint.utils.report({
				message: messages.expected(
					secondNodeData.description,
					priorSpecifiedNodeData.description
				),
				node: secondNodeData.node,
				result,
				ruleName,
			});

			// avoid logging another warning
			return true;
		}
	}

	if (!firstNodeIsSpecified && !secondNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'ignore' && (!firstNodeIsSpecified || !secondNodeIsSpecified)) {
		return true;
	}

	if (unspecified === 'top' && !firstNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'top' && !secondNodeIsSpecified) {
		return false;
	}

	if (unspecified === 'bottom' && !secondNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'bottom' && !firstNodeIsSpecified) {
		return false;
	}
};
