let request = require('../index');
let http = require('http');
let assert = require('assert');




const server = http.createServer(function(request, response) {
	var body = ''
	request.on('data', function(data) {
		body += data
	})
	request.on('end', function() {

		if (request.url === "/cookies") {
			response.writeHead(200, { 'Set-Cookie': request.headers.cookie || "" });
			response.end();
			return;
		}

		if (request.url === "/cookies-redirect") {
			response.writeHead(302, { 'Location': 'http://localhost:8000/cookies' });
			response.end();
			return;
		}

		response.writeHead(200, { 'Content-Type': 'text/html', 'authorization': request.headers.authorization || "" })
		response.end(body)
	})
});


describe('/GET-Cookies', function() {
	before(function() {
		server.listen(8000);
	});


	describe('/cookies', function() {
		it("should send me back the cookies", function(done) {
			request.request({ url: "http://localhost:8000/cookies",
				method: 'GET',
				Cookies: { john: "doe", human: true },

			}
			, function(err, data, status, headers) {
				assert.equal(headers['set-cookie'], 'john=doe; human=true');
				assert.equal(200, status);
				done();
			});
		});

		it("should not send me back the cookies", function(done) {
			request.request({ url: "http://localhost:8000/cookies-redirect",
				method: 'GET',
				Cookies: { john: "doe", human: true },
				requestOptions: { trustRedirect: false },

			}
			, function(err, data, status, headers) {
				assert.equal(headers['set-cookie'], "");
				assert.equal(200, status);
				done();
			});
		});
	});

	after(function() {
		server.close();
	});
});

