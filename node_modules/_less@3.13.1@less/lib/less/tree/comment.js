"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var debug_info_1 = __importDefault(require("./debug-info"));
var Comment = function (value, isLineComment, index, currentFileInfo) {
    this.value = value;
    this.isLineComment = isLineComment;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.allowRoot = true;
};
Comment.prototype = new node_1.default();
Comment.prototype.genCSS = function (context, output) {
    if (this.debugInfo) {
        output.add(debug_info_1.default(context, this), this.fileInfo(), this.getIndex());
    }
    output.add(this.value);
};
Comment.prototype.isSilent = function (context) {
    var isCompressed = context.compress && this.value[2] !== '!';
    return this.isLineComment || isCompressed;
};
Comment.prototype.type = 'Comment';
exports.default = Comment;
//# sourceMappingURL=comment.js.map