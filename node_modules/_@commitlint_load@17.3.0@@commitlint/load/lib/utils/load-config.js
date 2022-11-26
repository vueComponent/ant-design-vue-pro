"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const cosmiconfig_typescript_loader_1 = require("cosmiconfig-typescript-loader");
const path_1 = __importDefault(require("path"));
async function loadConfig(cwd, configPath) {
    const moduleName = 'commitlint';
    const explorer = (0, cosmiconfig_1.cosmiconfig)(moduleName, {
        searchPlaces: [
            // cosmiconfig overrides default searchPlaces if any new search place is added (For e.g. `*.ts` files),
            // we need to manually merge default searchPlaces from https://github.com/davidtheclark/cosmiconfig#searchplaces
            'package.json',
            `.${moduleName}rc`,
            `.${moduleName}rc.json`,
            `.${moduleName}rc.yaml`,
            `.${moduleName}rc.yml`,
            `.${moduleName}rc.js`,
            `.${moduleName}rc.cjs`,
            `${moduleName}.config.js`,
            `${moduleName}.config.cjs`,
            // files supported by TypescriptLoader
            `.${moduleName}rc.ts`,
            `${moduleName}.config.ts`,
        ],
        loaders: {
            '.ts': (0, cosmiconfig_typescript_loader_1.TypeScriptLoader)(),
        },
    });
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