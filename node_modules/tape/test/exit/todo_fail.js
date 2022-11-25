'use strict';

var test = require('../../');

test('todo fail', { todo: true }, function (t) {
	t.plan(1);
	t.ok(false);
});
