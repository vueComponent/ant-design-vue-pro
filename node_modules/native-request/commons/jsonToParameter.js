function jsonToParameter(jsonBody) {
	let keys = Object.keys(jsonBody);

	let formated = keys.map(function(k) {
		let val = jsonBody[k];
	    return k + '=' + val;
	}).join('; ')

	return formated;
}



module.exports = jsonToParameter;