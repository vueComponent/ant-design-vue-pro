"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const headerMinLength = (parsed, _when = undefined, value = 0) => {
    return [
        ensure_1.minLength(parsed.header, value),
        `header must not be shorter than ${value} characters, current length is ${parsed.header.length}`,
    ];
};
exports.headerMinLength = headerMinLength;
//# sourceMappingURL=header-min-length.js.map