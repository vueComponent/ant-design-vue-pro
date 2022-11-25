'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('match', function (tt) {
	tt.plan(1);

	var test = tape.createHarness({ exit: false });
	var tc = function (rows) {
		tt.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# match',
			'not ok 1 The "regexp" argument must be an instance of RegExp. Received type string (\'string\')',
			'  ---',
			'    operator: match',
			'    expected: \'[object RegExp]\'',
			'    actual:   \'[object String]\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The "regexp" argument must be an instance of RegExp. Received type string (\'string\')',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 2 regex arg must not be a string',
			'  ---',
			'    operator: match',
			'    expected: \'[object RegExp]\'',
			'    actual:   \'[object String]\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: regex arg must not be a string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 3 The "string" argument must be of type string. Received type object ({ abc: 123 })',
			'  ---',
			'    operator: match',
			'    expected: \'string\'',
			'    actual:   \'object\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The "string" argument must be of type string. Received type object ({ abc: 123 })',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 4 string arg must not be an object',
			'  ---',
			'    operator: match',
			'    expected: \'string\'',
			'    actual:   \'object\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string arg must not be an object',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 5 The input did not match the regular expression /abc/. Input: \'string\'',
			'  ---',
			'    operator: match',
			'    expected: /abc/',
			'    actual:   \'string\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The input did not match the regular expression /abc/. Input: \'string\'',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 6 "string" does not match /abc/',
			'  ---',
			'    operator: match',
			'    expected: /abc/',
			'    actual:   \'string\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: "string" does not match /abc/',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 7 The input matched the regular expression /pass$/. Input: \'I will pass\'',
			'ok 8 "I will pass" matches /pass$/',
			'',
			'1..8',
			'# tests 8',
			'# pass  2',
			'# fail  6',
			''
		]);
	};

	test.createStream().pipe(concat(tc));

	test('match', function (t) {
		t.plan(8);

		t.match(/abc/, 'string');
		t.match(/abc/, 'string', 'regex arg must not be a string');

		t.match({ abc: 123 }, /abc/);
		t.match({ abc: 123 }, /abc/, 'string arg must not be an object');

		t.match('string', /abc/);
		t.match('string', /abc/, '"string" does not match /abc/');

		t.match('I will pass', /pass$/);
		t.match('I will pass', /pass$/, '"I will pass" matches /pass$/');

		t.end();
	});
});

tap.test('doesNotMatch', function (tt) {
	tt.plan(1);

	var test = tape.createHarness({ exit: false });
	var tc = function (rows) {
		tt.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# doesNotMatch',
			'not ok 1 The "regexp" argument must be an instance of RegExp. Received type string (\'string\')',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: \'[object RegExp]\'',
			'    actual:   \'[object String]\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The "regexp" argument must be an instance of RegExp. Received type string (\'string\')',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 2 regex arg must not be a string',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: \'[object RegExp]\'',
			'    actual:   \'[object String]\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: regex arg must not be a string',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 3 The "string" argument must be of type string. Received type object ({ abc: 123 })',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: \'string\'',
			'    actual:   \'object\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The "string" argument must be of type string. Received type object ({ abc: 123 })',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 4 string arg must not be an object',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: \'string\'',
			'    actual:   \'object\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: string arg must not be an object',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 5 The input was expected to not match the regular expression /string/. Input: \'string\'',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: /string/',
			'    actual:   \'string\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The input was expected to not match the regular expression /string/. Input: \'string\'',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 6 "string" should not match /string/',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: /string/',
			'    actual:   \'string\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: "string" should not match /string/',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 7 The input was expected to not match the regular expression /pass$/. Input: \'I will pass\'',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: /pass$/',
			'    actual:   \'I will pass\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: The input was expected to not match the regular expression /pass$/. Input: \'I will pass\'',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 8 "I will pass" should not match /pass$/',
			'  ---',
			'    operator: doesNotMatch',
			'    expected: /pass$/',
			'    actual:   \'I will pass\'',
			'    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: "I will pass" should not match /pass$/',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 9 The input did not match the regular expression /pass$/. Input: \'I will fail\'',
			'ok 10 "I will fail" does not match /pass$/',
			'',
			'1..10',
			'# tests 10',
			'# pass  2',
			'# fail  8',
			''
		]);
	};

	test.createStream().pipe(concat(tc));

	test('doesNotMatch', function (t) {
		t.plan(10);

		t.doesNotMatch(/abc/, 'string');
		t.doesNotMatch(/abc/, 'string', 'regex arg must not be a string');

		t.doesNotMatch({ abc: 123 }, /abc/);
		t.doesNotMatch({ abc: 123 }, /abc/, 'string arg must not be an object');

		t.doesNotMatch('string', /string/);
		t.doesNotMatch('string', /string/, '"string" should not match /string/');

		t.doesNotMatch('I will pass', /pass$/);
		t.doesNotMatch('I will pass', /pass$/, '"I will pass" should not match /pass$/');

		t.doesNotMatch('I will fail', /pass$/);
		t.doesNotMatch('I will fail', /pass$/, '"I will fail" does not match /pass$/');

		t.end();
	});
});
