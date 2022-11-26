let Express = require('express')
let request = require('../index');
let assert = require('assert');

const app = Express();
const port = 3005;

let server;





describe('/GET-Express', function() {
	before(function() {
		server = app.listen(port, () => {
			''
			console.log("Test are running on port : " + port);
			app.get("/", function(req, res) {
				res.append('Content-Type', 'text/plain');
				res.append('authorization', req.headers.authorization || "");

				res.send("Hello, world!\n")
			})

			app.get('/redirect', function(req, res) {
				res.redirect('/')
			})		
			app.get('/redirect1', function(req, res) {
				res.redirect('/redirect')
			})
		});
	});


	describe('/', function() {
		it('should return 200', function(done) {
			request.get('http://localhost:3005/?hey=d', function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal(200, status);
				done();
			});
		});

		it('should say "Hello, world!"', function(done) {
			request.get("http://localhost:3005", function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('Hello, world!\n', data);
				done();
			});
		});

		it("should have content-type to 'text/plain'", function(done) {
			request.get("http://localhost:3005", function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('text/plain; charset=utf-8', headers['content-type']);
				done();
			});
		});








	});

	describe('/redirect', function() {
		it("should throw an error (no redirect allowed)'", function(done) {
			request.request({ url: "http://localhost:3005/redirect",
				method: 'GET',
				requestOptions: { followRedirect: false }

			}
			, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 0)
				assert.equal(302, status);
				done();
			});
		});
		it("should not throw an error'", function(done) {
			request.request({ url: "http://localhost:3005/redirect",
				method: 'GET',
				requestOptions: { followRedirect: true }

			}
			, function(err, data, status, headers) {
				console.log(err, data);
				assert.equal(200, status);
				done();
			});
		});

		it("should throw an error'", function(done) {
			request.request({ url: "http://localhost:3005/redirect1",
				method: 'GET',
				requestOptions: { maxRedirect: 1 }

			}
			, function(err, data, status, headers) {
				assert.equal(JSON.parse(err).code, 1)
				assert.equal(302, status);
				done();
			});
		});

		it("should keep headers", function(done) {
			request.request({ url: "http://localhost:3005/redirect",
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
			request.request({ url: "http://localhost:3005/redirect",
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

