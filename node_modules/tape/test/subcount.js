'use strict';

var test = require('../');

test('parent test', function (t) {
	t.plan(2);
	t.test('first child', function (st) {
		st.plan(1);
		st.pass('pass first child');
	});

	t.test(function (st) {
		st.plan(1);
		st.pass('pass second child');
	});
});
