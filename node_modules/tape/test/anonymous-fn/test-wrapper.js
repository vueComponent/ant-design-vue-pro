'use strict';

function setUp() {
	// ... example ...
}

function tearDown() {
	// ... example ...
}

// Example of wrapper function that would invoke tape
module.exports = function (testCase) {
	return function (t) {
		setUp();
		testCase(t);
		tearDown();
	};
};
