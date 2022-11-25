"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResult = exports.format = void 0;
const chalk_1 = __importDefault(require("chalk"));
const DEFAULT_SIGNS = [' ', '⚠', '✖'];
const DEFAULT_COLORS = ['white', 'yellow', 'red'];
function format(report = {}, options = {}) {
    const { results = [] } = report;
    const fi = (result) => formatInput(result, options);
    const fr = (result) => formatResult(result, options);
    return results
        .filter((r) => Array.isArray(r.warnings) || Array.isArray(r.errors))
        .map((result) => [...fi(result), ...fr(result)])
        .reduce((acc, item) => (Array.isArray(item) ? [...acc, ...item] : [...acc, item]), [])
        .join('\n');
}
exports.format = format;
function formatInput(result, options = {}) {
    const { color: enabled = true } = options;
    const { errors = [], warnings = [], input = '' } = result;
    if (!input) {
        return [''];
    }
    const sign = '⧗';
    const decoration = enabled ? chalk_1.default.gray(sign) : sign;
    const commitText = errors.length > 0 ? input : input.split('\n')[0];
    const decoratedInput = enabled ? chalk_1.default.bold(commitText) : commitText;
    const hasProblems = errors.length > 0 || warnings.length > 0;
    return options.verbose || hasProblems
        ? [`${decoration}   input: ${decoratedInput}`]
        : [];
}
function formatResult(result = {}, options = {}) {
    const { signs = DEFAULT_SIGNS, colors = DEFAULT_COLORS, color: enabled = true, } = options;
    const { errors = [], warnings = [] } = result;
    const problems = [...errors, ...warnings].map((problem) => {
        const sign = signs[problem.level] || '';
        const color = colors[problem.level] || 'white';
        const decoration = enabled ? chalk_1.default[color](sign) : sign;
        const name = enabled
            ? chalk_1.default.grey(`[${problem.name}]`)
            : `[${problem.name}]`;
        return `${decoration}   ${problem.message} ${name}`;
    });
    const sign = selectSign(result);
    const color = selectColor(result);
    const deco = enabled ? chalk_1.default[color](sign) : sign;
    const el = errors.length;
    const wl = warnings.length;
    const hasProblems = problems.length > 0;
    const summary = options.verbose || hasProblems
        ? `${deco}   found ${el} problems, ${wl} warnings`
        : undefined;
    const fmtSummary = enabled && typeof summary === 'string' ? chalk_1.default.bold(summary) : summary;
    const help = hasProblems ? `ⓘ   Get help: ${options.helpUrl}` : undefined;
    return [
        ...problems,
        hasProblems ? '' : undefined,
        fmtSummary,
        help,
        help ? '' : undefined,
    ].filter((line) => typeof line === 'string');
}
exports.formatResult = formatResult;
exports.default = format;
function selectSign(result) {
    if ((result.errors || []).length > 0) {
        return '✖';
    }
    return (result.warnings || []).length ? '⚠' : '✔';
}
function selectColor(result) {
    if ((result.errors || []).length > 0) {
        return 'red';
    }
    return (result.warnings || []).length ? 'yellow' : 'green';
}
//# sourceMappingURL=format.js.map