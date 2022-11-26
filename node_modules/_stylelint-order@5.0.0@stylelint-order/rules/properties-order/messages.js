const stylelint = require('stylelint');
const ruleName = require('./ruleName');

module.exports = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second, groupName) =>
		`Expected "${first}" to come before "${second}"${
			groupName ? ` in group "${groupName}"` : ''
		}`,
	expectedEmptyLineBefore: (property) => `Expected an empty line before property "${property}"`,
	rejectedEmptyLineBefore: (property) => `Unexpected empty line before property "${property}"`,
});
