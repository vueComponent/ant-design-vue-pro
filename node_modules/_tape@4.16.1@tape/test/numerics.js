'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('numerics', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# numeric strings',
			'not ok 1 number equal to string',
			'  ---',
			'    operator: equal',
			'    expected: \'3\'',
			'    actual:   3',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: number equal to string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 2 string equal to number',
			'  ---',
			'    operator: equal',
			'    expected: 3',
			'    actual:   \'3\'',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string equal to number',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 3 number notEqual to string',
			'ok 4 string notEqual to number',
			'ok 5 number looseEqual to string',
			'ok 6 string looseEqual to number',
			'not ok 7 number notLooseEqual to string',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: \'3\'',
			'    actual:   3',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: number notLooseEqual to string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 8 string notLooseEqual to number',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: 3',
			'    actual:   \'3\'',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string notLooseEqual to number',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 9 number strictEqual to string',
			'  ---',
			'    operator: equal',
			'    expected: \'3\'',
			'    actual:   3',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: number strictEqual to string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 10 string strictEqual to number',
			'  ---',
			'    operator: equal',
			'    expected: 3',
			'    actual:   \'3\'',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string strictEqual to number',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 11 number notStrictEqual to string',
			'ok 12 string notStrictEqual to number',
			'ok 13 number deepLooseEqual to string',
			'ok 14 string deepLooseEqual to number',
			'not ok 15 number notDeepLooseEqual to string',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: \'3\'',
			'    actual:   3',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: number notDeepLooseEqual to string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 16 string notDeepLooseEqual to number',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: 3',
			'    actual:   \'3\'',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string notDeepLooseEqual to number',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 17 number deepEqual to string',
			'  ---',
			'    operator: deepEqual',
			'    expected: \'3\'',
			'    actual:   3',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: number deepEqual to string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 18 string deepEqual to number',
			'  ---',
			'    operator: deepEqual',
			'    expected: 3',
			'    actual:   \'3\'',
			'    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string deepEqual to number',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 19 number notDeepEqual to string',
			'ok 20 string notDeepEqual to number',
			'',
			'1..20',
			'# tests 20',
			'# pass  10',
			'# fail  10',
			''
		]);
	}));

	test('numeric strings', function (t) {
		t.equal(3, '3', 'number equal to string');
		t.equal('3', 3, 'string equal to number');
		t.notEqual(3, '3', 'number notEqual to string');
		t.notEqual('3', 3, 'string notEqual to number');

		t.looseEqual(3, '3', 'number looseEqual to string');
		t.looseEqual('3', 3, 'string looseEqual to number');
		t.notLooseEqual(3, '3', 'number notLooseEqual to string');
		t.notLooseEqual('3', 3, 'string notLooseEqual to number');

		t.strictEqual(3, '3', 'number strictEqual to string');
		t.strictEqual('3', 3, 'string strictEqual to number');
		t.notStrictEqual(3, '3', 'number notStrictEqual to string');
		t.notStrictEqual('3', 3, 'string notStrictEqual to number');

		t.deepLooseEqual(3, '3', 'number deepLooseEqual to string');
		t.deepLooseEqual('3', 3, 'string deepLooseEqual to number');
		t.notDeepLooseEqual(3, '3', 'number notDeepLooseEqual to string');
		t.notDeepLooseEqual('3', 3, 'string notDeepLooseEqual to number');

		t.deepEqual(3, '3', 'number deepEqual to string');
		t.deepEqual('3', 3, 'string deepEqual to number');
		t.notDeepEqual(3, '3', 'number notDeepEqual to string');
		t.notDeepEqual('3', 3, 'string notDeepEqual to number');

		t.end();
	});
});
