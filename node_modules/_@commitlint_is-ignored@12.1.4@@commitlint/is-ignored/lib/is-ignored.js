"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./defaults");
function isIgnored(commit = '', opts = {}) {
    const ignores = typeof opts.ignores === 'undefined' ? [] : opts.ignores;
    if (!Array.isArray(ignores)) {
        throw new Error(`ignores must be of type array, received ${ignores} of type ${typeof ignores}`);
    }
    const invalids = ignores.filter((c) => typeof c !== 'function');
    if (invalids.length > 0) {
        throw new Error(`ignores must be array of type function, received items of type: ${invalids
            .map((i) => typeof i)
            .join(', ')}`);
    }
    const base = opts.defaults === false ? [] : defaults_1.wildcards;
    return [...base, ...ignores].some((w) => w(commit));
}
exports.default = isIgnored;
//# sourceMappingURL=is-ignored.js.map