"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const headerMaxLength = (parsed, _when = undefined, value = 0) => {
    return [
        ensure_1.maxLength(parsed.header, value),
        `header must not be longer than ${value} characters, current length is ${parsed.header.length}`,
    ];
};
exports.headerMaxLength = headerMaxLength;
//# sourceMappingURL=header-max-length.js.map