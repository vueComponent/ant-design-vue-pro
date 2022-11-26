let request = require('../index');
let http = require('http');
let assert = require('assert');
let server = http.createServer(function (req, res) {
	if (req.url === "/redirect") {

		res.writeHead(302, { 'Location': 'http://localhost:8000' });
		res.end();
		return;
	}	
	if (req.url === "/redirect1") {

		res.writeHead(302, { 'Location': 'http://localhost:8000/redirect' });
		res.end();
		return;
	}

	res.writeHead(200, { 'Content-Type': 'text/plain', 'authorization': !!req.headers && req.headers.authorization ? req.headers.authorization : "" })
	res.end('Hello, world!\n');
});


describe('/GET', function () {
	before(function () {
		server.listen(8000);
	});


	describe('/', function () {
		it('should return 200', function (done) {
			request.get('http://localhost:8000/?hey=d', function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal(200, status);
				done();
			});
		});

		it('should say "Hello, world!"', function (done) {
			request.get("http://localhost:8000", function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('Hello, world!\n', data);	
				done();
			});
		});	

		it("should have content-type to 'text/plain'", function (done) {
			request.get("http://localhost:8000",function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('text/plain' , headers['content-type']);
				done();
			});
		});








	});

	describe('/redirect', function() {
		it("should throw an error'", function(done) {
			request.request(
				{url:"http://localhost:8000/redirect",
				method: 'GET',
				requestOptions: {followRedirect: false}

			}
				, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 0)
				assert.equal(302,status);
				done();
			});
		});
		it("should not throw an error'", function(done) {
			request.request(
				{url:"http://localhost:8000/redirect",
				method: 'GET',
				requestOptions: {followRedirect: true}

			}
				, function(err, data, status, headers) {
				assert.equal(200,status);
				done();
			});
		});

		it("should throw an error'", function(done) {
			request.request(
				{url:"http://localhost:8000/redirect1",
				method: 'GET',
				requestOptions: {maxRedirect: 1}

			}
				, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 1)
				assert.equal(302,status);
				done();
			});
		});

		it("should keep headers", function(done) {
			request.request({ url: "http://localhost:8000/redirect",
				method: 'GET',
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
				method: 'GET',
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
	after(function () {
		server.close();
	});
});

