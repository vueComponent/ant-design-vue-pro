module.exports = intersperse;

function intersperse(arr, obj) {
	if (!arr.length) return [];
	if (arr.length === 1) return arr.slice(0);

	var items = [arr[0]];
	for (var i = 1, len = arr.length; i < len; ++i) {
		items.push(obj, arr[i]);
	}

	return items;
}