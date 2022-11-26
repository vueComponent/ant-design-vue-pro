"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const typeMaxLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.type;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLength(input, value),
        `type must not be longer than ${value} characters`,
    ];
};
exports.typeMaxLength = typeMaxLength;
//# sourceMappingURL=type-max-length.js.map