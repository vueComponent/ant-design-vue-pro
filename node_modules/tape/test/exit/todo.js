'use strict';

var test = require('../../');

test('todo pass', { todo: true }, function (t) {
	t.plan(1);
	t.ok(true);
});
