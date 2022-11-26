"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const path_1 = __importDefault(require("path"));
const cosmiconfig_1 = require("cosmiconfig");
async function loadConfig(cwd, configPath) {
    const explorer = cosmiconfig_1.cosmiconfig('commitlint');
    const explicitPath = configPath ? path_1.default.resolve(cwd, configPath) : undefined;
    const explore = explicitPath ? explorer.load : explorer.search;
    const searchPath = explicitPath ? explicitPath : cwd;
    const local = await explore(searchPath);
    if (local) {
        return local;
    }
    return null;
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=load-config.js.map