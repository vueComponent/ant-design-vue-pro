let request = require('../index');
let http = require('http');
let assert = require('assert');




const server = http.createServer(function(request, response) {
	var body = ''
	request.on('data', function(data) {
		body += data
	})
	request.on('end', function() {

		if (request.url === "/redirect") {
			response.writeHead(302, { 'Location': 'http://localhost:8000' });
			response.end();
			return;
		}
		if (request.url === "/redirect1") {

			response.writeHead(302, { 'Location': 'http://localhost:8000/redirect' });
			response.end();
			return;
		}



		response.writeHead(200, { 'Content-Type': 'text/html', 'authorization': request.headers.authorization || "" })
		response.end(body)
	})
});


describe('/POST', function() {
	before(function() {
		server.listen(8000);
	});


	describe('/', function() {
		it('should return 200', function(done) {
			request.post('http://localhost:8000/', function(err, data, status) {
				assert.ifError(err);
				assert.equal(200, status);
				done();
			});
		});

		it('should say "Hello, world!" inside a JSON object', function(done) {
			request.post("http://localhost:8000", { hello: 'Hello, world!' }, function(err, data) {
				assert.ifError(err);
				assert.deepEqual({ hello: 'Hello, world!' }, JSON.parse(data));
				done();
			});
		});

		it("should have content-type to 'text/html'", function(done) {
			request.post("http://localhost:8000", function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('text/html', headers['content-type']);
				done();
			});
		});

	});

	describe('/redirect', function() {
		it("should be redirected correctly'", function(done) {
			request.post("http://localhost:8000/redirect", function(err, data, status, headers) {
				assert.equal(status, 200);
				assert.equal('text/html', headers['content-type']);
				done();
			});
		});

		it("should throw an error'", function(done) {
			request.request({ url: "http://localhost:8000/redirect",
				method: 'POST',
				requestOptions: { followRedirect: false }

			}
			, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 0)
				assert.equal(302, status);
				done();
			});
		});
		it("should not throw an error'", function(done) {
			request.request({ url: "http://localhost:8000/redirect",
				method: 'POST',
				requestOptions: { followRedirect: true }

			}
			, function(err, data, status, headers) {
				assert.equal(200, status);
				done();
			});
		});

		it("should keep headers", function(done) {
			request.request({ url: "http://localhost:8000/redirect",
				method: 'POST',
				requestOptions: { },
				headers: {
					authorization: "Yo Zaral !"
				}

			}
			, function(err, data, status, headers) {
				assert.equal(headers.authorization, "Yo Zaral !")
				assert.equal(200, status);
				done();
			});
		});

		it("should not keep headers", function(done) {
			request.request({ url: "http://localhost:8000/redirect",
				method: 'POST',
				requestOptions: { trustRedirect: false },
				headers: {
					authorization: "Yo Zaral !"
				}

			}
			, function(err, data, status, headers) {
				assert.equal(headers.authorization, "")
				assert.equal(200, status);
				done();
			});
		});
	});
	describe('/redirect x2', function() {

		it("should throw an error'", function(done) {
			request.request({ url: "http://localhost:8000/redirect1",
				method: 'POST',
				requestOptions: { maxRedirect: 1 }

			}
			, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 1)
				assert.equal(302, status);
				done();
			});
		});
	});



	after(function() {
		server.close();
	});
});

