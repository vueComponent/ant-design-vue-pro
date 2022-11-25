'use strict';

var tap = require('tap');
var test = require('../');
var concat = require('concat-stream');
var stripFullStack = require('./common').stripFullStack;

tap.test('test skip explanations', function (assert) {
	assert.plan(1);

	var verify = function (output) {
		assert.same(stripFullStack(output.toString('utf8')), [
			'TAP version 13',
			'# SKIP (this skips)',
			'# some tests might skip',
			'ok 1 this runs',
			'ok 2 failing assert is skipped # SKIP',
			'ok 3 this runs',
			'# incomplete test',
			'ok 4 run sh',
			'ok 5 run openssl # SKIP',
			'# incomplete test with explanation',
			'ok 6 run sh (conditional skip) # SKIP',
			'ok 7 run openssl # SKIP can\'t run on windows platforms',
			'ok 8 this runs',
			'# too much explanation',
			'ok 9 run openssl # SKIP Installer cannot work on windows and fails to add to PATH Err: (2401) denied',
			'',
			'1..9',
			'# tests 9',
			'# pass  9',
			'',
			'# ok',
			''
		]);
	};

	var tapeTest = test.createHarness();
	tapeTest.createStream().pipe(concat(verify));

	tapeTest('(this skips)', { skip: true }, function (t) {
		t.fail('doesn\'t run');
		t.fail('this doesn\'t run too', { skip: false });
		t.end();
	});

	tapeTest('some tests might skip', function (t) {
		t.pass('this runs');
		t.fail('failing assert is skipped', { skip: true });
		t.pass('this runs');
		t.end();
	});

	tapeTest('incomplete test', function (t) {
		// var platform = process.platform; something like this needed
		var platform = 'win32';

		t.pass('run sh', { skip: platform !== 'win32' });
		t.pass('run openssl', { skip: platform === 'win32' });
		t.end();
	});

	tapeTest('incomplete test with explanation', function (t) {
		// var platform = process.platform; something like this needed
		var platform = 'win32';

		t.fail('run sh (conditional skip)', { skip: platform === 'win32' });
		t.fail('run openssl', { skip: platform === 'win32' && 'can\'t run on windows platforms' });
		t.pass('this runs');
		t.end();
	});

	tapeTest('too much explanation', function (t) {
		// var platform = process.platform; something like this needed
		var platform = 'win32';

		t.fail(
			'run openssl',
			{ skip: platform === 'win32' && 'Installer cannot work on windows\nand fails to add to PATH\n\n Err: (2401) denied' }
		);
		t.end();
	});
});

// vim: set softtabstop=4 shiftwidth=4:
