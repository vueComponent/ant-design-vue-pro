'use strict';

var test = require('../');

test('parent', function (t) {
	t.plan(3);

	var firstChildRan = false;

	t.pass('assertion in parent');

	t.test('first child', function (st) {
		st.plan(1);
		st.pass('pass first child');
		firstChildRan = true;
	});

	t.test('second child', function (st) {
		st.plan(2);
		st.ok(firstChildRan, 'first child ran first');
		st.pass('pass second child');
	});
});
