"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommitMesage = void 0;
const buildCommitMesage = ({ header, body, footer, }) => {
    let message = header;
    message = body ? `${message}\n\n${body}` : message;
    message = footer ? `${message}\n\n${footer}` : message;
    return message;
};
exports.buildCommitMesage = buildCommitMesage;
//# sourceMappingURL=commit-message.js.map