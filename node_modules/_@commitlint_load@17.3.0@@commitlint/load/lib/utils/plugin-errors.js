"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingPluginError = exports.WhitespacePluginError = void 0;
class WhitespacePluginError extends Error {
    constructor(pluginName, data = {}) {
        super(`Whitespace found in plugin name '${pluginName}'`);
        this.__proto__ = Error;
        this.messageTemplate = 'whitespace-found';
        this.messageData = {};
        this.messageData = data;
        Object.setPrototypeOf(this, WhitespacePluginError.prototype);
    }
}
exports.WhitespacePluginError = WhitespacePluginError;
class MissingPluginError extends Error {
    constructor(pluginName, errorMessage = '', data = {}) {
        super(`Failed to load plugin ${pluginName}: ${errorMessage}`);
        this.__proto__ = Error;
        this.messageTemplate = 'plugin-missing';
        this.messageData = data;
        Object.setPrototypeOf(this, MissingPluginError.prototype);
    }
}
exports.MissingPluginError = MissingPluginError;
//# sourceMappingURL=plugin-errors.js.map