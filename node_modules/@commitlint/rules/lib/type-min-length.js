"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const typeMinLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.type;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.minLength(input, value),
        `type must not be shorter than ${value} characters`,
    ];
};
exports.typeMinLength = typeMinLength;
//# sourceMappingURL=type-min-length.js.map