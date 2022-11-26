"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditCommit = void 0;
const top_level_1 = __importDefault(require("@commitlint/top-level"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const get_edit_file_path_1 = require("./get-edit-file-path");
// Get recently edited commit message
async function getEditCommit(cwd, edit) {
    const top = await top_level_1.default(cwd);
    if (typeof top !== 'string') {
        throw new TypeError(`Could not find git root from ${cwd}`);
    }
    const editFilePath = await get_edit_file_path_1.getEditFilePath(top, edit);
    const editFile = await fs_extra_1.default.readFile(editFilePath);
    return [`${editFile.toString('utf-8')}\n`];
}
exports.getEditCommit = getEditCommit;
//# sourceMappingURL=get-edit-commit.js.map