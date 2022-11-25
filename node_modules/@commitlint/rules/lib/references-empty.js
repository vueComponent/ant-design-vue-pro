"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.referencesEmpty = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const referencesEmpty = (parsed, when = 'never') => {
    const negated = when === 'always';
    const notEmpty = parsed.references.length > 0;
    return [
        negated ? !notEmpty : notEmpty,
        message_1.default(['references', negated ? 'must' : 'may not', 'be empty']),
    ];
};
exports.referencesEmpty = referencesEmpty;
//# sourceMappingURL=references-empty.js.map