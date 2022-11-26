module.exports = function isString(str) {
	return str && typeof str.valueOf() === 'string';
};
