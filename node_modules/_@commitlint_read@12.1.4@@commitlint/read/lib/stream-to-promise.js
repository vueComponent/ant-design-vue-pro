"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToPromise = void 0;
function streamToPromise(stream) {
    const data = [];
    return new Promise((resolve, reject) => stream
        .on('data', (chunk) => data.push(chunk.toString('utf-8')))
        .on('error', reject)
        .on('end', () => resolve(data)));
}
exports.streamToPromise = streamToPromise;
//# sourceMappingURL=stream-to-promise.js.map