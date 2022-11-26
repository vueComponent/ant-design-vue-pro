'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var common = require('./common');

var getDiag = common.getDiag;

function stripAt(body) {
	return body.replace(/^\s*at:\s+Test.*$\n/m, '');
}

tap.test('preserves stack trace with newlines', function (tt) {
	tt.plan(3);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());
	var stackTrace = 'foo\n  bar';

	parser.once('assert', function (data) {
		delete data.diag.at;
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'Error: Preserve stack',
			diag: {
				stack: stackTrace,
				operator: 'error',
				expected: 'undefined',
				actual: '[Error: Preserve stack]'
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [].concat(
			'TAP version 13',
			'# multiline stack trace',
			'not ok 1 Error: Preserve stack',
			'  ---',
			'    operator: error',
			'    expected: |-',
			'      undefined',
			'    actual: |-',
			'      [Error: Preserve stack]',
			'    stack: |-',
			'      foo',
			'        bar',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		));

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stackTrace,
			operator: 'error',
			expected: 'undefined',
			actual: '[Error: Preserve stack]'
		});
	}));

	test('multiline stack trace', function (t) {
		t.plan(1);
		var err = new Error('Preserve stack');
		err.stack = stackTrace;
		t.error(err);
	});
});

tap.test('parses function info from original stack', function (tt) {
	tt.plan(4);

	var test = tape.createHarness();
	test.createStream();

	test._results._watch = function (t) {
		t.on('result', function (res) {
			tt.equal('Test.testFunctionNameParsing', res.functionName);
			tt.match(res.file, /stackTrace.js/i);
			tt.ok(Number(res.line) > 0);
			tt.ok(Number(res.column) > 0);
		});
	};

	test('t.equal stack trace', function testFunctionNameParsing(t) {
		t.equal(true, false, 'true should be false');
		t.end();
	});
});

tap.test('parses function info from original stack for anonymous function', function (tt) {
	tt.plan(4);

	var test = tape.createHarness();
	test.createStream();

	test._results._watch = function (t) {
		t.on('result', function (res) {
			tt.equal('Test.<anonymous>', res.functionName);
			tt.match(res.file, /stackTrace.js/i);
			tt.ok(Number(res.line) > 0);
			tt.ok(Number(res.column) > 0);
		});
	};

	test('t.equal stack trace', function (t) {
		t.equal(true, false, 'true should be false');
		t.end();
	});
});

if (typeof Promise === 'function' && typeof Promise.resolve === 'function') {

	tap.test('parses function info from original stack for Promise scenario', function (tt) {
		tt.plan(4);

		var test = tape.createHarness();
		test.createStream();

		test._results._watch = function (t) {
			t.on('result', function (res) {
				tt.equal('onfulfilled', res.functionName);
				tt.match(res.file, /stackTrace.js/i);
				tt.ok(Number(res.line) > 0);
				tt.ok(Number(res.column) > 0);
			});
		};

		test('t.equal stack trace', function testFunctionNameParsing(t) {
			new Promise(function (resolve) {
				resolve();
			}).then(function onfulfilled() {
				t.equal(true, false, 'true should be false');
				t.end();
			});
		});
	});

	tap.test('parses function info from original stack for Promise scenario with anonymous function', function (tt) {
		tt.plan(4);

		var test = tape.createHarness();
		test.createStream();

		test._results._watch = function (t) {
			t.on('result', function (res) {
				tt.equal('<anonymous>', res.functionName);
				tt.match(res.file, /stackTrace.js/i);
				tt.ok(Number(res.line) > 0);
				tt.ok(Number(res.column) > 0);
			});
		};

		test('t.equal stack trace', function testFunctionNameParsing(t) {
			new Promise(function (resolve) {
				resolve();
			}).then(function () {
				t.equal(true, false, 'true should be false');
				t.end();
			});
		});
	});

}

tap.test('preserves stack trace for failed assertions', function (tt) {
	tt.plan(6);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());

	var stack = '';
	parser.once('assert', function (data) {
		tt.equal(typeof data.diag.at, 'string');
		tt.equal(typeof data.diag.stack, 'string');
		var at = data.diag.at || '';
		stack = data.diag.stack || '';
		tt.ok((/^Error: true should be false(\n {4}at .+)+/).exec(stack), 'stack should be a stack');
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'true should be false',
			diag: {
				at: at,
				stack: stack,
				operator: 'equal',
				expected: false,
				actual: true
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [].concat(
			'TAP version 13',
			'# t.equal stack trace',
			'not ok 1 true should be false',
			'  ---',
			'    operator: equal',
			'    expected: false',
			'    actual:   true',
			'    stack: |-',
			('\n' + stack).replace(/\n/g, '\n      ').split('\n').slice(1),
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		));

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stack,
			operator: 'equal',
			expected: false,
			actual: true
		});
	}));

	test('t.equal stack trace', function (t) {
		t.plan(1);
		t.equal(true, false, 'true should be false');
	});
});

tap.test('preserves stack trace for failed assertions where actual===falsy', function (tt) {
	tt.plan(6);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());

	var stack = '';
	parser.once('assert', function (data) {
		tt.equal(typeof data.diag.at, 'string');
		tt.equal(typeof data.diag.stack, 'string');
		var at = data.diag.at || '';
		stack = data.diag.stack || '';
		tt.ok((/^Error: false should be true(\n {4}at .+)+/).exec(stack), 'stack should be a stack');
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'false should be true',
			diag: {
				at: at,
				stack: stack,
				operator: 'equal',
				expected: true,
				actual: false
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [].concat(
			'TAP version 13',
			'# t.equal stack trace',
			'not ok 1 false should be true',
			'  ---',
			'    operator: equal',
			'    expected: true',
			'    actual:   false',
			'    stack: |-',
			('\n' + stack).replace(/\n/g, '\n      ').split('\n').slice(1),
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		));

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stack,
			operator: 'equal',
			expected: true,
			actual: false
		});
	}));

	test('t.equal stack trace', function (t) {
		t.plan(1);
		t.equal(false, true, 'false should be true');
	});
});
