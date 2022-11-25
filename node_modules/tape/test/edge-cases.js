'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('edge cases', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# zeroes',
			'ok 1 0 equal to -0',
			'ok 2 -0 equal to 0',
			'not ok 3 0 notEqual to -0',
			'  ---',
			'    operator: notEqual',
			'    expected: |-',
			'      -0',
			'    actual: |-',
			'      0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: 0 notEqual to -0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 4 -0 notEqual to 0',
			'  ---',
			'    operator: notEqual',
			'    expected: |-',
			'      0',
			'    actual: |-',
			'      -0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: -0 notEqual to 0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 5 0 looseEqual to -0',
			'ok 6 -0 looseEqual to 0',
			'not ok 7 0 notLooseEqual to -0',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: |-',
			'      -0',
			'    actual: |-',
			'      0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: 0 notLooseEqual to -0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 8 -0 notLooseEqual to 0',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: |-',
			'      0',
			'    actual: |-',
			'      -0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: -0 notLooseEqual to 0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 9 0 strictEqual to -0',
			'ok 10 -0 strictEqual to 0',
			'not ok 11 0 notStrictEqual to -0',
			'  ---',
			'    operator: notEqual',
			'    expected: |-',
			'      -0',
			'    actual: |-',
			'      0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: 0 notStrictEqual to -0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 12 -0 notStrictEqual to 0',
			'  ---',
			'    operator: notEqual',
			'    expected: |-',
			'      0',
			'    actual: |-',
			'      -0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: -0 notStrictEqual to 0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 13 0 deepLooseEqual to -0',
			'ok 14 -0 deepLooseEqual to 0',
			'not ok 15 0 notDeepLooseEqual to -0',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: |-',
			'      -0',
			'    actual: |-',
			'      0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: 0 notDeepLooseEqual to -0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 16 -0 notDeepLooseEqual to 0',
			'  ---',
			'    operator: notDeepLooseEqual',
			'    expected: |-',
			'      0',
			'    actual: |-',
			'      -0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: -0 notDeepLooseEqual to 0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 17 0 deepEqual to -0',
			'  ---',
			'    operator: deepEqual',
			'    expected: |-',
			'      -0',
			'    actual: |-',
			'      0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: 0 deepEqual to -0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 18 -0 deepEqual to 0',
			'  ---',
			'    operator: deepEqual',
			'    expected: |-',
			'      0',
			'    actual: |-',
			'      -0',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: -0 deepEqual to 0',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 19 0 notDeepEqual to -0',
			'ok 20 -0 notDeepEqual to 0',
			'# NaNs',
			'not ok 21 NaN equal to NaN',
			'  ---',
			'    operator: equal',
			'    expected: NaN',
			'    actual:   NaN',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NaN equal to NaN',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 22 NaN notEqual to NaN',
			'not ok 23 NaN looseEqual to NaN',
			'  ---',
			'    operator: deepLooseEqual',
			'    expected: NaN',
			'    actual:   NaN',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NaN looseEqual to NaN',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 24 NaN notLooseEqual to NaN',
			'not ok 25 NaN strictEqual to NaN',
			'  ---',
			'    operator: equal',
			'    expected: NaN',
			'    actual:   NaN',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NaN strictEqual to NaN',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 26 NaN notStrictEqual to NaN',
			'not ok 27 NaN deepLooseEqual to NaN',
			'  ---',
			'    operator: deepLooseEqual',
			'    expected: NaN',
			'    actual:   NaN',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NaN deepLooseEqual to NaN',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 28 NaN notDeepLooseEqual to NaN',
			'ok 29 NaN deepEqual to NaN',
			'not ok 30 NaN notDeepEqual to NaN',
			'  ---',
			'    operator: notDeepEqual',
			'    expected: NaN',
			'    actual:   NaN',
			'    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NaN notDeepEqual to NaN',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..30',
			'# tests 30',
			'# pass  15',
			'# fail  15',
			''
		]);
	}));

	test('zeroes', function (t) {
		t.equal(0, -0, '0 equal to -0');
		t.equal(-0, 0, '-0 equal to 0');
		t.notEqual(0, -0, '0 notEqual to -0');
		t.notEqual(-0, 0, '-0 notEqual to 0');

		t.looseEqual(0, -0, '0 looseEqual to -0');
		t.looseEqual(-0, 0, '-0 looseEqual to 0');
		t.notLooseEqual(0, -0, '0 notLooseEqual to -0');
		t.notLooseEqual(-0, 0, '-0 notLooseEqual to 0');

		t.strictEqual(0, -0, '0 strictEqual to -0');
		t.strictEqual(-0, 0, '-0 strictEqual to 0');
		t.notStrictEqual(0, -0, '0 notStrictEqual to -0');
		t.notStrictEqual(-0, 0, '-0 notStrictEqual to 0');

		t.deepLooseEqual(0, -0, '0 deepLooseEqual to -0');
		t.deepLooseEqual(-0, 0, '-0 deepLooseEqual to 0');
		t.notDeepLooseEqual(0, -0, '0 notDeepLooseEqual to -0');
		t.notDeepLooseEqual(-0, 0, '-0 notDeepLooseEqual to 0');

		t.deepEqual(0, -0, '0 deepEqual to -0');
		t.deepEqual(-0, 0, '-0 deepEqual to 0');
		t.notDeepEqual(0, -0, '0 notDeepEqual to -0');
		t.notDeepEqual(-0, 0, '-0 notDeepEqual to 0');

		t.end();
	});

	test('NaNs', function (t) {
		t.equal(NaN, NaN, 'NaN equal to NaN');
		t.notEqual(NaN, NaN, 'NaN notEqual to NaN');

		t.looseEqual(NaN, NaN, 'NaN looseEqual to NaN');
		t.notLooseEqual(NaN, NaN, 'NaN notLooseEqual to NaN');

		t.strictEqual(NaN, NaN, 'NaN strictEqual to NaN');
		t.notStrictEqual(NaN, NaN, 'NaN notStrictEqual to NaN');

		t.deepLooseEqual(NaN, NaN, 'NaN deepLooseEqual to NaN');
		t.notDeepLooseEqual(NaN, NaN, 'NaN notDeepLooseEqual to NaN');

		t.deepEqual(NaN, NaN, 'NaN deepEqual to NaN');
		t.notDeepEqual(NaN, NaN, 'NaN notDeepEqual to NaN');

		t.end();
	});
});
