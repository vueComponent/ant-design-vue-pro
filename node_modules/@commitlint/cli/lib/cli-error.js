"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliError = void 0;
class CliError extends Error {
    constructor(message, type) {
        super(message);
        this.__proto__ = Error;
        this.type = type;
        Object.setPrototypeOf(this, CliError.prototype);
    }
}
exports.CliError = CliError;
//# sourceMappingURL=cli-error.js.map