"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (value, enums = []) => {
    if (value === undefined) {
        return false;
    }
    if (!Array.isArray(enums)) {
        return false;
    }
    return enums.indexOf(value) > -1;
};
//# sourceMappingURL=enum.js.map