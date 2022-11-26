'use strict';

var tap = require('tap');
var tape = require('../');
var forEach = require('for-each');
var through = require('through');

tap.test('object results', function (assert) {
	var printer = through({ objectMode: true });
	var objects = [];

	printer.write = function (obj) {
		objects.push(obj);
	};

	printer.end = function (obj) {
		if (obj) { objects.push(obj); }

		var todos = 0;
		var skips = 0;
		var testIds = [];
		var endIds = [];
		var asserts = 0;

		assert.equal(objects.length, 13);

		forEach(objects, function (object) {
			if (object.type === 'assert') {
				asserts++;
			} else if (object.type === 'test') {
				testIds.push(object.id);

				if (object.skip) {
					skips++;
				} else if (object.todo) {
					todos++;
				}
			} else if (object.type === 'end') {
				endIds.push(object.text);
				// test object should exist
				assert.notEqual(testIds.indexOf(object.test), -1);
			}
		});

		assert.equal(asserts, 5);
		assert.equal(skips, 1);
		assert.equal(todos, 2);
		assert.equal(testIds.length, endIds.length);
		assert.end();
	};

	tape.createStream({ objectMode: true }).pipe(printer);

	tape('parent', function (t1) {
		t1.equal(true, true);
		t1.test('child1', { skip: true }, function (t2) {
			t2.equal(true, true);
			t2.equal(true, false);
			t2.end();
		});
		t1.test('child2', { todo: true }, function (t3) {
			t3.equal(true, false);
			t3.equal(true, true);
			t3.end();
		});
		t1.test('child3', { todo: true });
		t1.equal(true, true);
		t1.equal(true, true);
		t1.end();
	});
});
