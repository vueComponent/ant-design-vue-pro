"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toLines(input) {
    if (typeof input !== 'string') {
        return [];
    }
    return input.split(/(?:\r?\n)/);
}
exports.default = toLines;
//# sourceMappingURL=index.js.map