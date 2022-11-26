const stylelint = require('stylelint');
const ruleName = require('./ruleName');

module.exports = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});
