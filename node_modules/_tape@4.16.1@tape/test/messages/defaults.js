'use strict';

var test = require('../../');

test('default messages', function (t) {
	t.plan(12);

	t.ok(true);
	t.notOk(false);

	t.equal(true, true);
	t.notEqual(true, false);

	t.looseEqual(true, true);
	t.notLooseEqual(true, false);

	t.strictEqual(true, true);
	t.notStrictEqual(true, false);

	t.deepEqual(true, true);
	t.notDeepEqual(true, true);

	t.deepLooseEqual(true, true);
	t.notDeepLooseEqual(true, false);
});
