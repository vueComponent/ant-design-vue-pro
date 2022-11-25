'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('failures', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# error',
			'not ok 1 Error: this is a message',
			'  ---',
			'    operator: error',
			'    expected: |-',
			'      undefined',
			'    actual: |-',
			'      [Error: this is a message]',
			'    at: Test.<anonymous> ($TEST/error.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: this is a message',
			'          at Test.<anonymous> ($TEST/error.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);
	}));

	test('error', function (t) {
		t.plan(1);
		t.error(new Error('this is a message'));
	});
});
