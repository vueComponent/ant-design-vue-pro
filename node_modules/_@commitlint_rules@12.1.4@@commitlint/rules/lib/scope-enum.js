"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeEnum = void 0;
const ensure = __importStar(require("@commitlint/ensure"));
const message_1 = __importDefault(require("@commitlint/message"));
const scopeEnum = (parsed, when = 'always', value = []) => {
    if (!parsed.scope) {
        return [true, ''];
    }
    // Scopes may contain slash or comma delimiters to separate them and mark them as individual segments.
    // This means that each of these segments should be tested separately with `ensure`.
    const delimiters = /\/|\\|,/g;
    const scopeSegments = parsed.scope.split(delimiters);
    const negated = when === 'never';
    const result = value.length === 0 ||
        scopeSegments.every((scope) => ensure.enum(scope, value));
    return [
        negated ? !result : result,
        message_1.default([
            `scope must`,
            negated ? `not` : null,
            `be one of [${value.join(', ')}]`,
        ]),
    ];
};
exports.scopeEnum = scopeEnum;
//# sourceMappingURL=scope-enum.js.map