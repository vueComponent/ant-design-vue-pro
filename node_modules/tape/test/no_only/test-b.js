'use strict';

var tape = require('../../');

tape.test('should pass', function (t) {
	t.plan(1);
	t.ok(1);
});

tape.test.only('should pass again', function (t) {
	t.plan(1);
	t.ok(1);
});

