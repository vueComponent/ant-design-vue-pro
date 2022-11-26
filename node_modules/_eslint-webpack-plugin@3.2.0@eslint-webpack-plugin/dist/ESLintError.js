"use strict";

class ESLintError extends Error {
  /**
   * @param {string=} messages
   */
  constructor(messages) {
    super(`[eslint] ${messages}`);
    this.name = 'ESLintError';
    this.stack = '';
  }

}

module.exports = ESLintError;