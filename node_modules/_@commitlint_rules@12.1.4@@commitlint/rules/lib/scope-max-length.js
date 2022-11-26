"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const scopeMaxLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.scope;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLength(input, value),
        `scope must not be longer than ${value} characters`,
    ];
};
exports.scopeMaxLength = scopeMaxLength;
//# sourceMappingURL=scope-max-length.js.map