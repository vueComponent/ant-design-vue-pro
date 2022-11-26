let Express = require('express')
let request = require('../index');
let assert = require('assert');
let bodyParser = require('body-parser')

const app = Express();
const port = 3006;

let server;


describe('/POST-Express', function() {
	before(function() {
		server = app.listen(port, () => {
			app.use(bodyParser.json())
			app.use(bodyParser.urlencoded({ extended: false }))
			console.log("Test are running on port : " + port);
			app.post("/", function(req, res) {
				res.append('Content-Type', 'text/html');
				res.append('authorization', req.headers.authorization || "");
				res.send(req.body)
			})

			app.post('/redirect', function(req, res) {
				res.redirect('/')
			})		
			app.post('/redirect1', function(req, res) {
				res.redirect('/redirect')
			})
		});
	});


	describe('/', function() {
		it('should return 200', function(done) {
			request.post('http://localhost:3006/', function(err, data, status) {
				assert.ifError(err);
				assert.equal(200, status);
				done();
			});
		});

		it('should say "Hello, world!" inside a JSON object', function(done) {
			request.post("http://localhost:3006", { hello: 'Hello, world!' }, function(err, data) {
				assert.ifError(err);
				assert.deepEqual({ hello: 'Hello, world!' }, JSON.parse(data));
				done();
			});
		});

		it("should have content-type to 'text/html'", function(done) {
			request.post("http://localhost:3006", function(err, data, status, headers) {
				assert.ifError(err);
				assert.equal('text/html; charset=utf-8', headers['content-type']);
				done();
			});
		});

	});

	describe('/redirect', function() {
		it("should be redirected correctly'", function(done) {
			request.post("http://localhost:3006/redirect", function(err, data, status, headers) {
				assert.equal(status, 200);
				assert.equal('text/html; charset=utf-8', headers['content-type']);
				done();
			});
		});

		it("should throw an error'", function(done) {
			request.request({ url: "http://localhost:3006/redirect",
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
			request.request({ url: "http://localhost:3006/redirect",
				method: 'POST',
				requestOptions: { followRedirect: true }

			}
			, function(err, data, status, headers) {
				assert.equal(200, status);
				done();
			});
		});

		it("should keep headers", function(done) {
			request.request({ url: "http://localhost:3006/redirect",
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
			request.request({ url: "http://localhost:3006/redirect",
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
			request.request({ url: "http://localhost:3006/redirect1",
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

