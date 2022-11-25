'use strict';

var tap = require('tap');
var tape = require('../');
var through = require('through');

tap.test('test.comment() in objectMode', function (assert) {
	var printer = through({ objectMode: true });
	var objects = [];
	printer.on('error', function (e) {
		assert.fail(e);
	});

	printer.write = function (obj) {
		objects.push(obj);
	};
	printer.end = function (obj) {
		if (obj) { objects.push(obj); }

		assert.equal(objects.length, 3);
		assert.deepEqual(objects, [
			{
				type: 'test',
				name: 'test.comment',
				id: 0,
				skip: false,
				todo: false
			},
			'message',
			{ type: 'end', test: 0 }
		]);
		assert.end();
	};

	tape.createStream({ objectMode: true }).pipe(printer);

	tape('test.comment', function (test) {
		test.comment('message');
		test.end();
	});
});
