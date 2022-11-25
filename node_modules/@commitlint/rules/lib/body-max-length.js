"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const bodyMaxLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.body;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLength(input, value),
        `body must not be longer than ${value} characters`,
    ];
};
exports.bodyMaxLength = bodyMaxLength;
//# sourceMappingURL=body-max-length.js.map