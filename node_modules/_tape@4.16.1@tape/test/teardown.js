'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var forEach = require('for-each');
var v = require('es-value-fixtures');
var inspect = require('object-inspect');
var flatMap = require('array.prototype.flatmap');

var stripFullStack = require('./common').stripFullStack;

tap.test('teardowns', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [].concat(
			'TAP version 13',
			'# success',
			'ok 1 should be truthy',
			'# success teardown',
			'# success teardown 2',
			'# success (async)',
			'ok 2 should be truthy',
			'# success (async) teardown',
			'# success (async) teardown 2',
			'# nested teardowns',
			'# nested success',
			'ok 3 should be truthy',
			'# nested teardown (nested success level)',
			'# nested teardown (nested success level) 2',
			'# nested failure',
			'not ok 4 nested failure!',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: nested failure!',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# nested teardown (nested fail level)',
			'# nested teardown (nested fail level) 2',
			'# nested teardown (top level)',
			'# nested teardown (top level) 2',
			'# fail',
			'not ok 5 failure!',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: failure!',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# failure teardown',
			'# failure teardown 2',
			'# teardown errors do not stop the next teardown fn from running',
			'ok 6 should be truthy',
			'not ok 7 SyntaxError: teardown error!',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: SyntaxError: teardown error!',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 8 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 1',
			'    actual:   2',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# teardown runs after teardown error',
			'# teardown given non-function fails the test',
			'ok 9 should be truthy',
			flatMap(v.nonFunctions, function (nonFunction, i) {
				var offset = 10;
				return [].concat(
					'not ok ' + (offset + (i > 0 ? i + 1 : i)) + ' teardown: ' + inspect(nonFunction) + ' is not a function',
					'  ---',
					'    operator: fail',
					'    at: <anonymous> ($TEST/teardown.js:$LINE:$COL)',
					'    stack: |-',
					'      Error: teardown: ' + inspect(nonFunction) + ' is not a function',
					'          [... stack stripped ...]',
					'          at $TEST/teardown.js:$LINE:$COL',
					'          [... stack stripped ...]',
					'          at Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
					'          [... stack stripped ...]',
					'  ...',
					i > 0 ? [] : [
						'not ok ' + (offset + 1) + ' plan != count',
						'  ---',
						'    operator: fail',
						'    expected: 1',
						'    actual:   2',
						'    at: <anonymous> ($TEST/teardown.js:$LINE:$COL)',
						'    stack: |-',
						'      Error: plan != count',
						'          [... stack stripped ...]',
						'          at $TEST/teardown.js:$LINE:$COL',
						'          [... stack stripped ...]',
						'          at Test.<anonymous> ($TEST/teardown.js:$LINE:$COL)',
						'          [... stack stripped ...]',
						'  ...'
					]
				);
			}),
			typeof Promise === 'function' ? [
				'# success (promise)',
				'ok ' + (11 + v.nonFunctions.length) + ' should be truthy',
				'# success (promise) teardown: 1',
				'# success (promise) teardown: 2',
				'# success (promise) teardown: 3'
			] : [
				'# SKIP success (promise)'
			],
			[
				'',
				'1..' + ((typeof Promise === 'function' ? 1 : 0) + 10 + v.nonFunctions.length),
				'# tests ' + ((typeof Promise === 'function' ? 1 : 0) + 10 + v.nonFunctions.length),
				'# pass  ' + ((typeof Promise === 'function' ? 1 : 0) + 5),
				'# fail  ' + (5 + v.nonFunctions.length),
				''
			]
		));
	}));

	test('success', function (t) {
		t.plan(1);
		t.teardown(function () {
			t.comment('success teardown');
		});
		t.teardown(function () {
			t.comment('success teardown 2');
		});
		t.ok('success!');
	});

	test('success (async)', function (t) {
		t.plan(1);
		t.teardown(function () {
			t.comment('success (async) teardown');
		});
		t.teardown(function () {
			t.comment('success (async) teardown 2');
		});
		setTimeout(function () {
			t.ok('success!');
		}, 10);
	});

	test('nested teardowns', function (t) {
		t.plan(2);

		t.teardown(function () {
			t.comment('nested teardown (top level)');
		});
		t.teardown(function () {
			t.comment('nested teardown (top level) 2');
		});

		t.test('nested success', function (st) {
			st.teardown(function () {
				st.comment('nested teardown (nested success level)');
			});
			st.teardown(function () {
				st.comment('nested teardown (nested success level) 2');
			});

			st.ok('nested success!');
			st.end();
		});

		t.test('nested failure', function (st) {
			st.plan(1);

			st.teardown(function () {
				st.comment('nested teardown (nested fail level)');
			});
			st.teardown(function () {
				st.comment('nested teardown (nested fail level) 2');
			});

			st.fail('nested failure!');
		});
	});

	test('fail', function (t) {
		t.plan(1);

		t.teardown(function () {
			t.comment('failure teardown');
		});
		t.teardown(function () {
			t.comment('failure teardown 2');
		});

		t.fail('failure!');
	});

	test('teardown errors do not stop the next teardown fn from running', function (t) {
		t.plan(1);

		t.ok('teardown error test');

		t.teardown(function () {
			throw new SyntaxError('teardown error!');
		});
		t.teardown(function () {
			t.comment('teardown runs after teardown error');
		});
	});

	test('teardown given non-function fails the test', function (t) {
		t.plan(1);

		t.ok('non-function test');

		forEach(v.nonFunctions, function (nonFunction) {
			t.teardown(nonFunction);
		});
	});

	test('success (promise)', { skip: typeof Promise !== 'function' }, function (t) {
		t.plan(1);

		t.teardown(function () {
			return new Promise(function (resolve) {
				t.comment('success (promise) teardown: 1');
				setTimeout(resolve, 10);
			}).then(function () {
				t.comment('success (promise) teardown: 2');
			});
		});
		t.teardown(function () {
			t.comment('success (promise) teardown: 3');
		});

		setTimeout(function () {
			t.ok('success!');
		}, 10);
	});
});

tap.test('teardown with promise', { skip: typeof Promise !== 'function', timeout: 1e3 }, function (tt) {
	tt.plan(2);
	tape('dummy test', function (t) {
		var resolved = false;
		t.teardown(function () {
			tt.pass('tape teardown');
			var p = Promise.resolve();
			p.then(function () {
				resolved = true;
			});
			return p;
		});
		t.on('end', function () {
			tt.is(resolved, true);
		});
		t.end();
	});
});
