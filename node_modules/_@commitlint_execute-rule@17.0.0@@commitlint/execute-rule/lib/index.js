"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
exports.default = execute;
async function execute(rule) {
    if (!Array.isArray(rule)) {
        return null;
    }
    const [name, config] = rule;
    const fn = executable(config) ? config : async () => config;
    return [name, await fn()];
}
exports.execute = execute;
function executable(config) {
    return typeof config === 'function';
}
//# sourceMappingURL=index.js.map