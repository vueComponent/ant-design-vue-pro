"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const kebabCase_1 = __importDefault(require("lodash/kebabCase"));
const snakeCase_1 = __importDefault(require("lodash/snakeCase"));
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
const startCase_1 = __importDefault(require("lodash/startCase"));
exports.default = ensureCase;
function ensureCase(raw = '', target = 'lowercase') {
    // We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
    // We need trim string because content with quotes can be at the beginning or end of a line
    const input = String(raw)
        .replace(/`.*?`|".*?"|'.*?'/g, '')
        .trim();
    const transformed = toCase(input, target);
    if (transformed === '' || transformed.match(/^\d/)) {
        return true;
    }
    return transformed === input;
}
function toCase(input, target) {
    switch (target) {
        case 'camel-case':
            return camelCase_1.default(input);
        case 'kebab-case':
            return kebabCase_1.default(input);
        case 'snake-case':
            return snakeCase_1.default(input);
        case 'pascal-case':
            return upperFirst_1.default(camelCase_1.default(input));
        case 'start-case':
            return startCase_1.default(input);
        case 'upper-case':
        case 'uppercase':
            return input.toUpperCase();
        case 'sentence-case':
        case 'sentencecase':
            return input.charAt(0).toUpperCase() + input.slice(1);
        case 'lower-case':
        case 'lowercase':
        case 'lowerCase': // Backwards compat config-angular v4
            return input.toLowerCase();
        default:
            throw new TypeError(`ensure-case: Unknown target case "${target}"`);
    }
}
//# sourceMappingURL=case.js.map