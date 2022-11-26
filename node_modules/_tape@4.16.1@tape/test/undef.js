'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('array test', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# undef',
			'not ok 1 should be equivalent',
			'  ---',
			'    operator: deepEqual',
			'    expected: |-',
			'      { beep: undefined }',
			'    actual: |-',
			'      {}',
			'    at: Test.<anonymous> ($TEST/undef.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be equivalent',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/undef.js:$LINE:$COL)',
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

	test('undef', function (t) {
		t.plan(1);
		t.deepEqual({}, { beep: undefined });
	});
});
