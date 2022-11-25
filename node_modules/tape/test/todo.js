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
			'# success',
			'ok 1 this test runs',
			'# TODO failure',
			'not ok 2 should never happen # TODO',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/todo.js:$LINE:$COL)',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  2',
			'',
			'# ok',
			''
		]);
	}));

	test('success', function (t) {
		t.equal(true, true, 'this test runs');
		t.end();
	});

	test('failure', { todo: true }, function (t) {
		t.fail('should never happen');
		t.end();
	});
});
