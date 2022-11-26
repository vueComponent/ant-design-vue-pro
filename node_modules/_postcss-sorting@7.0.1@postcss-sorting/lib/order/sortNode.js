const createExpectedOrder = require('./createExpectedOrder');
const isRuleWithNodes = require('../isRuleWithNodes');
const processLastComments = require('./processLastComments');
const processMostNodes = require('./processMostNodes');
const sortByIndexes = require('./sortByIndexes');

module.exports = function sortNode(node, optsOrder) {
	if (!isRuleWithNodes(node)) {
		return;
	}

	const expectedOrder = createExpectedOrder(optsOrder);

	// Nodes for sorting
	let processed = [];

	// Add indexes to nodes
	node.each((childNode, index) => {
		processed = processMostNodes(childNode, index, expectedOrder, processed);
	});

	// Add last comments in the rule. Need this because last comments are not belonging to anything
	node.each((childNode, index) => {
		processed = processLastComments(childNode, index, processed);
	});

	// Sort declarations saved for sorting
	processed.sort(sortByIndexes);

	// Enforce semicolon for the last node
	node.raws.semicolon = true;

	// Replace rule content with sorted one
	node.removeAll();
	node.append(processed);
};
