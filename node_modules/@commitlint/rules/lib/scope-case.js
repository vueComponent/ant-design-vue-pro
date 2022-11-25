"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeCase = void 0;
const ensure_1 = require("@commitlint/ensure");
const message_1 = __importDefault(require("@commitlint/message"));
const negated = (when) => when === 'never';
const scopeCase = (parsed, when = 'always', value = []) => {
    const { scope } = parsed;
    if (!scope) {
        return [true];
    }
    const checks = (Array.isArray(value) ? value : [value]).map((check) => {
        if (typeof check === 'string') {
            return {
                when: 'always',
                case: check,
            };
        }
        return check;
    });
    // Scopes may contain slash or comma delimiters to separate them and mark them as individual segments.
    // This means that each of these segments should be tested separately with `ensure`.
    const delimiters = /\/|\\|,/g;
    const scopeSegments = scope.split(delimiters);
    const result = checks.some((check) => {
        const r = scopeSegments.every((segment) => delimiters.test(segment) || ensure_1.case(segment, check.case));
        return negated(check.when) ? !r : r;
    });
    const list = checks.map((c) => c.case).join(', ');
    return [
        negated(when) ? !result : result,
        message_1.default([`scope must`, negated(when) ? `not` : null, `be ${list}`]),
    ];
};
exports.scopeCase = scopeCase;
//# sourceMappingURL=scope-case.js.map