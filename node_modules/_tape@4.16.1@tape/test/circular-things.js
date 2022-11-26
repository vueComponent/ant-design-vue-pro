'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('circular test', function (assert) {
	var test = tape.createHarness({ exit: false });
	assert.plan(1);

	test.createStream().pipe(concat(function (body) {
		assert.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# circular',
			'not ok 1 should be equal',
			'  ---',
			'    operator: equal',
			'    expected: |-',
			'      {}',
			'    actual: |-',
			'      { circular: [Circular] }',
			'    at: Test.<anonymous> ($TEST/circular-things.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/circular-things.js:$LINE:$COL)',
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

	test('circular', function (t) {
		t.plan(1);
		var circular = {};
		circular.circular = circular;
		t.equal(circular, {});
	});
});
