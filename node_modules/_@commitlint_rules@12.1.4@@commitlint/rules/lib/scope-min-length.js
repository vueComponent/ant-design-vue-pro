"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const scopeMinLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.scope;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.minLength(input, value),
        `scope must not be shorter than ${value} characters`,
    ];
};
exports.scopeMinLength = scopeMinLength;
//# sourceMappingURL=scope-min-length.js.map