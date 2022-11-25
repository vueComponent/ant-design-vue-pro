const { isProperty, vendor } = require('../../utils');

module.exports = function getNodeData(node, expectedOrder) {
	if (isProperty(node)) {
		let { prop } = node;
		let unprefixedName = vendor.unprefixed(prop);

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedName.startsWith('osx-')) {
			unprefixedName = unprefixedName.slice(4);
		}

		return {
			node,
			name: prop,
			unprefixedName,
			orderData: expectedOrder[unprefixedName],
		};
	}

	return {
		node,
	};
};
