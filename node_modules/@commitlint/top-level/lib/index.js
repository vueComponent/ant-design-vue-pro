"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const find_up_1 = __importDefault(require("find-up"));
exports.default = toplevel;
/**
 * Find the next git root
 */
async function toplevel(cwd) {
    const found = await searchDotGit(cwd);
    if (typeof found !== 'string') {
        return found;
    }
    return path_1.default.join(found, '..');
}
/**
 * Search .git, the '.git' can be a file(submodule), also can be a directory(normal)
 */
async function searchDotGit(cwd) {
    const foundFile = await find_up_1.default('.git', { cwd, type: 'file' });
    const foundDir = await find_up_1.default('.git', { cwd, type: 'directory' });
    return foundFile || foundDir;
}
//# sourceMappingURL=index.js.map