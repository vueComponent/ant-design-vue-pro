const url = require('url');
const http = require('http');
const https = require('https');
const jsonToURL = require('../commons/jsonToParameter');
function getProtocol(path) {
	return url.parse(path).protocol === "http:" ? http : https;
}

const Request = function() {

	let _options = {};
	let _requestOptions = {
		followRedirect: true,
		maxRedirect: 3,
		trustRedirect: true
	};
	let _parsedUrl;
	let _originalPath; //String
	let _postData; //String
	let _callback = ()=>{};

	this._handleResponse = function(response, callback) {
		let body = '';
		const status = response.statusCode;
		const hasError = status >= 300;
		response.setEncoding('utf8');
		response.on('data', function(data) {
			body += data;
		});
		response.on('end', () => {

			//used to manage 3xx calls
			if (status >= 300 && status < 400 && !!response.headers && !!response.headers.location) {

				if (!_requestOptions.followRedirect) {
					callback(JSON.stringify({code: 0, message: "ForwardRedirect is disabled"}),null, response.statusCode, response.headers)
					return;
				}
				if (!!_requestOptions.currentRedirect) {
					if (_requestOptions.currentRedirect == _requestOptions.maxRedirect) {
						callback(JSON.stringify({code: 1, message: "Max redirects exceeded"}),null, response.statusCode, response.headers)
						return;
					}
					_requestOptions.currentRedirect +=1
				} else {
					_requestOptions.currentRedirect = 1;
				}
				if (!_requestOptions.trustRedirect) {
					_options.headers = {};
				}
				this._parsePath(response.headers.location);
				this.sendRequest();
				return;
			}
			callback(hasError ? body : null, hasError ? null : body, response.statusCode, response.headers);
		});
	}

	this.setCookies = function(body) {
		if (!body) {
			return;
		}

		if (typeof body == "object") {
			body = jsonToURL(body);
		} 
 
		if (!_options.headers) {
			_options.headers = {};
		}


		_options.headers.Cookie = body;
	}

	this._parsePath = function(path) {
		if (!!_parsedUrl && !!path && path.indexOf('http') == -1) {
 			path = _parsedUrl.protocol + "//" + _parsedUrl.host + path;
		}
		_originalPath = path;
		_parsedUrl = url.parse(path);
		_options.hostname = _parsedUrl.hostname;
		_options.port = _parsedUrl.port;
		_options.path = _parsedUrl.pathname + (!!_parsedUrl.search ? _parsedUrl.search : '');
	}

	this.sendRequest = function() {

		if (!!_options.headers && (!_options.headers['content-type'] && !_options.headers['Content-Type'])) {
			_options.headers['content-type'] = 'application/json';
		}
		const req = getProtocol(_originalPath).request(_options, (response) => {
			this._handleResponse(response, _callback);
		});
		req.on('error', function(error) {
			_callback(error);
		});
		// Write data to request body
		if (_options.method !== "GET")
			req.write(_postData);
		req.end();
	}

	/**
	 * Send a custom request
	 * @param path is the url endpoint
	 * @param headers of the request
	 * @param callback contains (error, statusCode, data)
	 * @param data a JSON Object or a string
	 * @param method is the protocol used like POST GET DELETE PUT etc...
	 */
	this.createRequest = function(path, method, data, headers = {}, requestOptions = {}, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = '';
		} else if (typeof headers === 'function') {
			callback = headers;
			headers = {};
		} else if (typeof requestOptions === 'function') {
			callback = requestOptions;
		}

		const postData = typeof data === "object" ? JSON.stringify(data) : data;
		_options = {
			method: method,
			headers: headers
		};


		this._parsePath(path);
		_postData = postData;
		
		for (const key of Object.keys(_requestOptions)) {
		    if (key in requestOptions) {
		        _requestOptions[key] = requestOptions[key];
		    }
		}

		_callback = callback;

	}
}

module.exports = Request;