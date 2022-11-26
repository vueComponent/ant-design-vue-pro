const stylelint = require('stylelint');
const sortNode = require('postcss-sorting/lib/order/sortNode');
const checkOrder = require('./checkOrder');
const getOrderData = require('./getOrderData');
const ruleName = require('./ruleName');
const messages = require('./messages');

module.exports = function checkNode({
	node,
	isFixEnabled,
	orderInfo,
	primaryOption,
	result,
	unspecified,
}) {
	if (isFixEnabled) {
		let shouldFix = false;
		let allNodesData = [];

		node.each(function processEveryNode(child) {
			// return early if we know there is a violation and auto fix should be applied
			if (shouldFix) {
				return;
			}

			let { shouldSkip, isCorrectOrder } = handleCycle(child, allNodesData);

			if (shouldSkip) {
				return;
			}

			if (!isCorrectOrder) {
				shouldFix = true;
			}
		});

		if (shouldFix) {
			sortNode(node, primaryOption);
		}
	}

	let allNodesData = [];

	node.each(function processEveryNode(child) {
		let { shouldSkip, isCorrectOrder, nodeData, previousNodeData } = handleCycle(
			child,
			allNodesData
		);

		if (shouldSkip) {
			return;
		}

		if (isCorrectOrder) {
			return;
		}

		stylelint.utils.report({
			message: messages.expected(nodeData.description, previousNodeData.description),
			node: child,
			result,
			ruleName,
		});
	});

	function handleCycle(child, allNodes) {
		// Skip comments
		if (child.type === 'comment') {
			return {
				shouldSkip: true,
			};
		}

		// Receive node description and expectedPosition
		let nodeOrderData = getOrderData(orderInfo, child);

		let nodeData = {
			node: child,
			description: nodeOrderData.description,
			expectedPosition: nodeOrderData.expectedPosition,
		};

		allNodes.push(nodeData);

		let previousNodeData = allNodes[allNodes.length - 2];

		// Skip first node
		if (!previousNodeData) {
			return {
				shouldSkip: true,
			};
		}

		return {
			isCorrectOrder: checkOrder({
				firstNodeData: previousNodeData,
				secondNodeData: nodeData,
				allNodesData: allNodes,
				isFixEnabled,
				result,
				unspecified,
			}),
			nodeData,
			previousNodeData,
		};
	}
};
