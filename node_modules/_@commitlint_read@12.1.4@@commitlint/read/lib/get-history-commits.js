"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryCommits = void 0;
const git_raw_commits_1 = __importDefault(require("git-raw-commits"));
const stream_to_promise_1 = require("./stream-to-promise");
// Get commit messages from history
async function getHistoryCommits(options, opts = {}) {
    return stream_to_promise_1.streamToPromise(git_raw_commits_1.default(options, { cwd: opts.cwd }));
}
exports.getHistoryCommits = getHistoryCommits;
//# sourceMappingURL=get-history-commits.js.map