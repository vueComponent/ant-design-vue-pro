'use strict';

var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function';

module.exports = (function () {
	var harness;

	function getHarness(opts) {
		if (!opts) { opts = {}; }
		opts.autoclose = !canEmitExit;
		// this override is here since tests fail via nyc if createHarness is moved upwards
		// eslint-disable-next-line no-use-before-define
		if (!harness) { harness = createExitHarness(opts); }
		return harness;
	}

	function lazyLoad() {
		// eslint-disable-next-line no-invalid-this
		return getHarness().apply(this, arguments);
	}

	lazyLoad.only = function () {
		return getHarness().only.apply(this, arguments);
	};

	lazyLoad.createStream = function (opts) {
		var options = opts || {};
		if (!harness) {
			var output = through();
			getHarness({ stream: output, objectMode: options.objectMode });
			return output;
		}
		return harness.createStream(options);
	};

	lazyLoad.onFinish = function () {
		return getHarness().onFinish.apply(this, arguments);
	};

	lazyLoad.onFailure = function () {
		return getHarness().onFailure.apply(this, arguments);
	};

	lazyLoad.getHarness = getHarness;

	return lazyLoad;
}());

function createHarness(conf_) {
	var results = createResult();
	if (!conf_ || conf_.autoclose !== false) {
		results.once('done', function () { results.close(); });
	}

	function test(name, conf, cb) {
		var t = new Test(name, conf, cb);
		test._tests.push(t);

		(function inspectCode(st) {
			st.on('test', function sub(st_) {
				inspectCode(st_);
			});
			st.on('result', function (r) {
				if (!r.todo && !r.ok && typeof r !== 'string') { test._exitCode = 1; }
			});
		}(t));

		results.push(t);
		return t;
	}
	test._results = results;

	test._tests = [];

	test.createStream = function (opts) {
		return results.createStream(opts);
	};

	test.onFinish = function (cb) {
		results.on('done', cb);
	};

	test.onFailure = function (cb) {
		results.on('fail', cb);
	};

	var only = false;
	test.only = function () {
		if (only) { throw new Error('there can only be one only test'); }
		if (conf_.noOnly) { throw new Error('`only` tests are prohibited'); }
		only = true;
		var t = test.apply(null, arguments);
		results.only(t);
		return t;
	};
	test._exitCode = 0;

	test.close = function () { results.close(); };

	return test;
}

function createExitHarness(conf) {
	var config = conf || {};
	var harness = createHarness({
		autoclose: defined(config.autoclose, false),
		noOnly: defined(conf.noOnly, defined(process.env.NODE_TAPE_NO_ONLY_TEST, false))
	});

	var stream = harness.createStream({ objectMode: conf.objectMode });
	var es = stream.pipe(conf.stream || createDefaultStream());
	if (canEmitExit) {
		// eslint-disable-next-line no-unused-vars
		es.on('error', function (err) { harness._exitCode = 1; });
	}

	var ended = false;
	stream.on('end', function () { ended = true; });

	if (config.exit === false) { return harness; }
	if (!canEmitExit || !canExit) { return harness; }

	process.on('exit', function (code) {
		// let the process exit cleanly.
		if (code !== 0) {
			return;
		}

		if (!ended) {
			var only = harness._results._only;
			for (var i = 0; i < harness._tests.length; i++) {
				var t = harness._tests[i];
				if (!only || t === only) {
					t._exit();
				}
			}
		}
		harness.close();
		process.exit(code || harness._exitCode); // eslint-disable-line no-process-exit
	});

	return harness;
}

module.exports.createHarness = createHarness;
module.exports.Test = Test;
module.exports.test = module.exports; // tap compat
module.exports.test.skip = Test.skip;
