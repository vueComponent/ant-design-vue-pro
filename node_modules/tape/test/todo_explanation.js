'use strict';

var tap = require('tap');
var tape = require('../');
var concat = require('concat-stream');

var common = require('./common');
var stripFullStack = common.stripFullStack;

tap.test('tape todo test', { todo: process.versions.node.match(/0\.8\.\d+/) ? 'Fails on node 0.8' : false }, function (assert) {
	var test = tape.createHarness({ exit: false });
	assert.plan(1);

	test.createStream().pipe(concat(function (body) {
		assert.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# success',
			'ok 1 this test runs',
			'# TODO incomplete test1',
			'not ok 2 check output # TODO',
			'  ---',
			'    operator: equal',
			'    expected: false',
			'    actual:   true',
			'    at: Test.<anonymous> ($TEST/todo_explanation.js:$LINE:$COL)',
			'  ...',
			'not ok 3 check vars output # TODO name conflict',
			'  ---',
			'    operator: equal',
			'    expected: 0',
			'    actual:   1',
			'    at: Test.<anonymous> ($TEST/todo_explanation.js:$LINE:$COL)',
			'  ...',
			'# incomplete test2',
			'not ok 4 run openssl # TODO installer needs fix',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/todo_explanation.js:$LINE:$COL)',
			'  ...',
			'# TODO passing test',
			'',
			'1..4',
			'# tests 4',
			'# pass  4',
			'',
			'# ok',
			''
		]);
	}));

	test('success', function (t) {
		t.equal(true, true, 'this test runs');
		t.end();
	});

	test('incomplete test1', { todo: true }, function (t) {
		t.equal(true, false, 'check output');
		t.equal(1, 0, 'check vars output', { todo: 'name conflict' });
		t.end();
	});

	test('incomplete test2', function (t) {
		t.fail('run openssl', { todo: 'installer needs fix' });
		t.end();
	});

	test('passing test', { todo: 'yet incomplete' }, function (t) {
		t.end();
	});
});
