let Express = require('express')
let request = require('../index');
let assert = require('assert');
let bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

const app = Express();
const port = 3006;

let server;


describe('/POST-Cookies', function() {
	before(function() {
		server = app.listen(port, () => {
			''
			console.log("Test are running on port : " + port);
			app.use(cookieParser())

			app.post("/", function(req, res) {
				res.append('Content-Type', 'text/html');
				res.append('authorization', req.headers.authorization || "");

				res.send(req.query)
			})

			app.post('/cookies', function(req, res) {
				res.cookie('john', 'doe')
				res.cookie('human', 'true')
				res.send('')
			})		
			app.post('/cookies-redirect', function(req, res) {
				res.redirect('/cookies')
			})
		});
	});


	describe('/cookies', function() {
		it("should send me back the cookies", function(done) {
			request.request({ url: "http://localhost:3006/cookies",
				method: 'POST',
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

