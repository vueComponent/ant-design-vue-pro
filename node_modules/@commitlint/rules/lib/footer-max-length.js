"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const footerMaxLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.footer;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLength(input, value),
        `footer must not be longer than ${value} characters`,
    ];
};
exports.footerMaxLength = footerMaxLength;
//# sourceMappingURL=footer-max-length.js.map