'use strict';

var path = require('path');
var yaml = require('js-yaml');

module.exports.getDiag = function (body, includeStack) {
	var yamlStart = body.indexOf('  ---');
	var yamlEnd = body.indexOf('  ...\n');
	var diag = body.slice(yamlStart, yamlEnd).split('\n').map(function (line) {
		return line.slice(2);
	}).join('\n');

	// The stack trace and at variable will vary depending on where the code
	// is run, so just strip it out.
	var withStack = yaml.safeLoad(diag);
	if (!includeStack) {
		delete withStack.stack;
	}
	delete withStack.at;
	return withStack;
};

// There are three challenges associated with checking the stack traces included
// in errors:
// 1) The base checkout directory of tape might change. Because stack traces
//    include absolute paths, the stack traces will change depending on the
//    checkout path. We handle this by replacing the base test directory with a
//    placeholder $TEST variable and the package root with a placeholder
//    $TAPE variable.
// 2) Line positions within the file might change. We handle this by replacing
//    line and column markers with placeholder $LINE and $COL "variables"
//   a) node 0.8 does not provide nested eval line numbers, so we remove them
// 3) Stacks themselves change frequently with refactoring. We've even run into
//    issues with node library refactorings "breaking" stack traces. Most of
//    these changes are irrelevant to the tests themselves. To counter this, we
//    strip out all stack frames that aren't directly under our test directory,
//    and replace them with placeholders.

var stripChangingData = function (line) {
	var withoutTestDir = line.replace(__dirname, '$TEST');
	var withoutPackageDir = withoutTestDir.replace(path.dirname(__dirname), '$TAPE');
	var withoutPathSep = withoutPackageDir.replace(new RegExp('\\' + path.sep, 'g'), '/');
	var withoutLineNumbers = withoutPathSep.replace(/:\d+:\d+/g, ':$LINE:$COL');
	var withoutNestedLineNumbers = withoutLineNumbers.replace(/, <anonymous>:\$LINE:\$COL\)$/, ')');
	return withoutNestedLineNumbers;
};

module.exports.stripFullStack = function (output) {
	var stripped = '          [... stack stripped ...]';
	var withDuplicates = output.split(/\r?\n/g).map(stripChangingData).map(function (line) {
		var m = line.match(/[ ]{8}at .*\((.*)\)/);

		if (m && m[1].slice(0, 5) !== '$TEST') {
			return stripped;
		}
		return line;
	});

	var withoutInternals = withDuplicates.filter(function (line) {
		return !line.match(/ \(node:[^)]+\)$/);
	});

	var deduped = withoutInternals.filter(function (line, ix) {
		var hasPrior = line === stripped && withDuplicates[ix - 1] === stripped;
		return !hasPrior;
	});

	return deduped.join('\n').replace(
		// Handle stack trace variation in Node v0.8
		/at(:?) Test\.(?:module\.exports|tap\.test\.err\.code)/g,
		'at$1 Test.<anonymous>'
	).replace(
		// Handle stack trace variation in Node v0.8
		/at(:?) (Test\.)?tap\.test\.test\.skip/g,
		'at$1 $2<anonymous>'
	).replace(
		// Handle stack trace variation in Node v0.8
		/(\[\.\.\. stack stripped \.\.\.\]\r?\n *at) <anonymous> \(([^)]+)\)/g,
		'$1 $2'
	).split(/\r?\n/g);
};
