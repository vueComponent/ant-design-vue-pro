'use strict';

var tap = require('tap');
var tape = require('../');
var concat = require('concat-stream');

var common = require('./common');
var stripFullStack = common.stripFullStack;

tap.test('tape todo test', function (assert) {
	var test = tape.createHarness({ exit: false });
	assert.plan(1);

	test.createStream().pipe(concat(function (body) {
		assert.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# TODO failure',
			'not ok 1 should be equal # TODO',
			'  ---',
			'    operator: equal',
			'    expected: false',
			'    actual:   true',
			'    at: Test.<anonymous> ($TEST/todo_single.js:$LINE:$COL)',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			''
		]);
	}));

	test('failure', { todo: true }, function (t) {
		t.equal(true, false);
		t.end();
	});
});
