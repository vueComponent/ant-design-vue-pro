"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_history_commits_1 = require("./get-history-commits");
const get_edit_commit_1 = require("./get-edit-commit");
// Get commit messages
async function getCommitMessages(settings) {
    const { cwd, from, to, edit } = settings;
    if (edit) {
        return get_edit_commit_1.getEditCommit(cwd, edit);
    }
    return get_history_commits_1.getHistoryCommits({ from, to }, { cwd });
}
exports.default = getCommitMessages;
//# sourceMappingURL=read.js.map