'use strict';

var test = require('../');

var childRan = false;

test('parent', function (t) {
	t.test('child', function (st) {
		childRan = true;
		st.pass('child ran');
		st.end();
	});
	t.end();
});

test('uncle', function (t) {
	t.ok(childRan, 'Child should run before next top-level test');
	t.end();
});

var grandParentRan = false;
var parentRan = false;
var grandChildRan = false;
test('grandparent', function (t) {
	t.ok(!grandParentRan, 'grand parent ran twice');
	grandParentRan = true;
	t.test('parent', function (st) {
		st.ok(!parentRan, 'parent ran twice');
		parentRan = true;
		st.test('grandchild', function (s2t) {
			s2t.ok(!grandChildRan, 'grand child ran twice');
			grandChildRan = true;
			s2t.pass('grand child ran');
			s2t.end();
		});
		st.pass('parent ran');
		st.end();
	});
	t.test('other parent', function (st) {
		st.ok(parentRan, 'first parent runs before second parent');
		st.ok(grandChildRan, 'grandchild runs before second parent');
		st.end();
	});
	t.pass('grandparent ran');
	t.end();
});

test('second grandparent', function (t) {
	t.ok(grandParentRan, 'grandparent ran');
	t.ok(parentRan, 'parent ran');
	t.ok(grandChildRan, 'grandchild ran');
	t.pass('other grandparent ran');
	t.end();
});

// vim: set softtabstop=4 shiftwidth=4:
