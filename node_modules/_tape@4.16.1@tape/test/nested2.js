'use strict';

var test = require('../');

test(function (t) {
	var i = 0;
	t.test('setup', function (st) {
		process.nextTick(function () {
			st.equal(i, 0, 'called once');
			i++;
			st.end();
		});
	});

	t.test('teardown', function (st) {
		st.end();
	});

	t.end();
});
