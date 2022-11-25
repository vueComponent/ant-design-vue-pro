'use strict';

var test = require('../../');

test('first', function (t) {
	t.ok(true);
	t.end();
});

test('oops forgot end', function (t) {
	t.ok(true);
});
