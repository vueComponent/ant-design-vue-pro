let Express = require('express')
let request = require('../index');
let assert = require('assert');
var cookieParser = require('cookie-parser')

const app = Express();
const port = 3005;

let server;


describe('/GET-Cookies', function() {
	before(function() {
		server = app.listen(port, () => {
			''
			console.log("Test are running on port : " + port);
			app.use(cookieParser())

			app.get("/", function(req, res) {
				res.append('Content-Type', 'text/html');
				res.append('authorization', req.headers.authorization || "");

				res.send(req.query)
			})

			app.get('/cookies', function(req, res) {
				res.cookie('john', 'doe')
				res.cookie('human', 'true')
				res.send('')
			})		
			app.get('/cookies-redirect', function(req, res) {
				res.redirect('/cookies')
			})
		});
	});


	describe('/cookies', function() {
		it("should send me back the cookies", function(done) {
			request.request({ url: "http://localhost:3005/cookies",
				method: 'GET',
				Cookies: { john: "doe", human: true },

			}
			, function(err, data, status, headers) {
				assert.deepEqual(headers['set-cookie'], [ 'john=doe; Path=/', 'human=true; Path=/' ]);
				assert.equal(200, status);
				done();
			});
		});

	});

	after(function() {
		server.close();
	});
});

