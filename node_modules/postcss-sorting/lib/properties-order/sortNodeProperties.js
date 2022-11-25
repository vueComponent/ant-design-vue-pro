let createExpectedPropertiesOrder = require('./createExpectedPropertiesOrder');
let getComments = require('../getComments');
let getPropertiesOrderData = require('./getPropertiesOrderData');
let isCustomProperty = require('../isCustomProperty');
let isRuleWithNodes = require('../isRuleWithNodes');
let isStandardSyntaxProperty = require('../isStandardSyntaxProperty');
let sortDeclarations = require('./sortDeclarations');
let sortDeclarationsAlphabetically = require('./sortDeclarationsAlphabetically');
let vendor = require('./vendor');

module.exports = function sortNodeProperties(node, { order, unspecifiedPropertiesPosition }) {
	if (!isRuleWithNodes(node)) {
		return;
	}

	let isAlphabetical = order === 'alphabetical';
	let expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(order);

	let allRuleNodes = [];
	let declarations = [];

	node.each((childNode, index) => {
		if (
			childNode.type === 'decl' &&
			isStandardSyntaxProperty(childNode.prop) &&
			!isCustomProperty(childNode.prop)
		) {
			let unprefixedPropName = vendor.unprefixed(childNode.prop);

			// Hack to allow -moz-osx-font-smoothing to be understood
			// just like -webkit-font-smoothing
			if (unprefixedPropName.indexOf('osx-') === 0) {
				unprefixedPropName = unprefixedPropName.slice(4);
			}

			let propData = {
				name: childNode.prop,
				unprefixedName: unprefixedPropName,
				orderData: isAlphabetical
					? null
					: getPropertiesOrderData(expectedOrder, unprefixedPropName),
				node: childNode,
				initialIndex: index,
				unspecifiedPropertiesPosition,
			};

			// add a marker
			childNode.sortProperty = true;

			// If comment on separate line before node, use node's indexes for comment
			let commentsBefore = getComments.beforeDeclaration([], childNode.prev(), propData);

			// If comment on same line with the node and node, use node's indexes for comment
			let commentsAfter = getComments.afterDeclaration([], childNode.next(), propData);

			declarations = declarations.concat(commentsBefore, propData, commentsAfter);
		}
	});

	if (isAlphabetical) {
		declarations.sort(sortDeclarationsAlphabetically);
	} else {
		declarations.sort(sortDeclarations);
	}

	let foundDeclarations = false;

	node.each((childNode) => {
		if (childNode.sortProperty) {
			if (!foundDeclarations) {
				foundDeclarations = true;

				declarations.forEach((item) => {
					allRuleNodes.push(item.node);
				});
			}
		} else {
			allRuleNodes.push(childNode);
		}
	});

	node.removeAll();
	node.append(allRuleNodes);
};
