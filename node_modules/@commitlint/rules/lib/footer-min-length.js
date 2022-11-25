"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const footerMinLength = (parsed, _when = undefined, value = 0) => {
    if (!parsed.footer) {
        return [true];
    }
    return [
        ensure_1.minLength(parsed.footer, value),
        `footer must not be shorter than ${value} characters`,
    ];
};
exports.footerMinLength = footerMinLength;
//# sourceMappingURL=footer-min-length.js.map