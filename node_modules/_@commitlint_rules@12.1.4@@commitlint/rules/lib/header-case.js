"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerCase = void 0;
const ensure_1 = require("@commitlint/ensure");
const message_1 = __importDefault(require("@commitlint/message"));
const negated = (when) => when === 'never';
const headerCase = (parsed, when = 'always', value = []) => {
    const { header } = parsed;
    if (typeof header !== 'string' || !header.match(/^[a-z]/i)) {
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
    const result = checks.some((check) => {
        const r = ensure_1.case(header, check.case);
        return negated(check.when) ? !r : r;
    });
    const list = checks.map((c) => c.case).join(', ');
    return [
        negated(when) ? !result : result,
        message_1.default([`header must`, negated(when) ? `not` : null, `be ${list}`]),
    ];
};
exports.headerCase = headerCase;
//# sourceMappingURL=header-case.js.map