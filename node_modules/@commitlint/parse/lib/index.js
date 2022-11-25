"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { sync } = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');
async function parse(message, parser = sync, parserOpts) {
    const defaultOpts = (await defaultChangelogOpts).parserOpts;
    const opts = Object.assign(Object.assign({}, defaultOpts), (parserOpts || {}));
    const parsed = parser(message, opts);
    parsed.raw = message;
    return parsed;
}
exports.default = parse;
//# sourceMappingURL=index.js.map