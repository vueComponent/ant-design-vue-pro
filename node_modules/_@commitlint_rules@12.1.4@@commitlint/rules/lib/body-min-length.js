"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const bodyMinLength = (parsed, _when = undefined, value = 0) => {
    if (!parsed.body) {
        return [true];
    }
    return [
        ensure_1.minLength(parsed.body, value),
        `body must not be shorter than ${value} characters`,
    ];
};
exports.bodyMinLength = bodyMinLength;
//# sourceMappingURL=body-min-length.js.map