const { isString } = require('../../utils/validateType');

module.exports = function createFlatOrder(order) {
	const flatOrder = [];

	appendGroup(order);

	function appendGroup(items) {
		items.forEach((item) => appendItem(item));
	}

	function appendItem(item) {
		if (isString(item)) {
			flatOrder.push(item);

			return;
		}

		appendGroup(item.properties);
	}

	return flatOrder;
};
