`use strict`
const Request = require('./lib/Request');

/**
 * Send a get request
 * @return a @Request object
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, body, status, headers)
 */
function get(path, headers, callback) {
 	const request = new Request();
 	request.createRequest(path, "GET", null, headers, callback);

 	request.sendRequest();

 	return request;
}

/**
 * Send a post request
 * @return a @Request object
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, body, status, headers)
 * @param data a JSON Object or a string
 */
function post(path, data, headers, callback) {
 	const request = new Request();
 	request.createRequest(path, "POST", data, headers, callback);

 	request.sendRequest();

 	return request;
}


/**
 * Send a post request
 * @return a @Request object
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, body, status, headers)
 * @param data a JSON Object or a string
 * @param requestOptions a JSON Object or a string
 */
function request(options, callback) {

 	const request = new Request();
 	request.createRequest(options.url, options.method, options.data || {}, options.headers || {}, options.requestOptions, callback);

 	request.setCookies(options.Cookies);
 	request.sendRequest();

 	return request;
}




module.exports = {
	get,
	request,
	post
};
