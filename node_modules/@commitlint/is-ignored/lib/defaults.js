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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildcards = void 0;
const semver = __importStar(require("semver"));
const isSemver = (c) => {
    const firstLine = c.split('\n').shift();
    if (typeof firstLine !== 'string') {
        return false;
    }
    const stripped = firstLine.replace(/^chore(\([^)]+\))?:/, '').trim();
    return semver.valid(stripped) !== null;
};
const test = (r) => r.test.bind(r);
exports.wildcards = [
    test(/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m),
    test(/^(R|r)evert (.*)/),
    test(/^(fixup|squash)!/),
    isSemver,
    test(/^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/),
    test(/^Merge remote-tracking branch(\s*)(.*)/),
    test(/^Automatic merge(.*)/),
    test(/^Auto-merged (.*?) into (.*)/),
];
//# sourceMappingURL=defaults.js.map