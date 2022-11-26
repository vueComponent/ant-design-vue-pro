"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditFilePath = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
// Get path to recently edited commit message file
async function getEditFilePath(top, edit) {
    if (typeof edit === 'string') {
        return path_1.default.resolve(top, edit);
    }
    const dotgitPath = path_1.default.join(top, '.git');
    const dotgitStats = await fs_extra_1.default.lstat(dotgitPath);
    if (dotgitStats.isDirectory()) {
        return path_1.default.join(top, '.git/COMMIT_EDITMSG');
    }
    const gitFile = await fs_extra_1.default.readFile(dotgitPath, {
        encoding: 'utf-8',
    });
    const relativeGitPath = gitFile.replace('gitdir: ', '').replace('\n', '');
    return path_1.default.resolve(top, relativeGitPath, 'COMMIT_EDITMSG');
}
exports.getEditFilePath = getEditFilePath;
//# sourceMappingURL=get-edit-file-path.js.map