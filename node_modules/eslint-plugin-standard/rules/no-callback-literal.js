/**
 * Ensures that the callback pattern is followed properly
 * with an Error object (or undefined or null) in the first position.
 */

'use strict'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Determine if a node has a possiblity to be an Error object
 * @param  {ASTNode}  node  ASTNode to check
 * @returns {boolean}       True if there is a chance it contains an Error obj
 */
function couldBeError (node) {
  let exprs
  switch (node.type) {
    case 'Identifier':
    case 'CallExpression':
    case 'NewExpression':
    case 'MemberExpression':
    case 'TaggedTemplateExpression':
    case 'YieldExpression':
      return true // possibly an error object.

    case 'AssignmentExpression':
      return couldBeError(node.right)

    case 'SequenceExpression':
      exprs = node.expressions
      return exprs.length !== 0 && couldBeError(exprs[exprs.length - 1])

    case 'LogicalExpression':
      return couldBeError(node.left) || couldBeError(node.right)

    case 'ConditionalExpression':
      return couldBeError(node.consequent) || couldBeError(node.alternate)

    default:
      return node.value === null
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://github.com/standard/eslint-plugin-standard#rules-explanations'
    }
  },

  create: function (context) {
    const callbackNames = context.options[0] || ['callback', 'cb']

    function isCallback (name) {
      return callbackNames.indexOf(name) > -1
    }

    return {

      CallExpression: function (node) {
        const errorArg = node.arguments[0]
        const calleeName = node.callee.name

        if (errorArg && !couldBeError(errorArg) && isCallback(calleeName)) {
          context.report(node, 'Unexpected literal in error position of callback.')
        }
      }
    }
  }
}
