'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var common = require('./common');

var getDiag = common.getDiag;
var stripFullStack = common.stripFullStack;

tap.test('not equal failure', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat(function (body) {
		assert.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# not equal',
			'not ok 1 should not be equal',
			'  ---',
			'    operator: notEqual',
			'    expected: 2',
			'    actual:   2',
			'    at: Test.<anonymous> ($TEST/not-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should not be equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/not-equal-failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);

		assert.deepEqual(getDiag(body), {
			operator: 'notEqual',
			expected: '2',
			actual: '2'
		});
	}));

	parser.once('assert', function (data) {
		delete data.diag.stack;
		delete data.diag.at;
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should not be equal',
			diag: {
				operator: 'notEqual',
				expected: '2',
				actual: '2'
			}
		});
	});

	test('not equal', function (t) {
		t.plan(1);
		t.notEqual(2, 2);
	});
});
