"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const plugin_naming_1 = require("./plugin-naming");
const plugin_errors_1 = require("./plugin-errors");
function loadPlugin(plugins, pluginName, debug = false) {
    const longName = (0, plugin_naming_1.normalizePackageName)(pluginName);
    const shortName = (0, plugin_naming_1.getShorthandName)(longName);
    let plugin = null;
    if (pluginName.match(/\s+/u)) {
        throw new plugin_errors_1.WhitespacePluginError(pluginName, {
            pluginName: longName,
        });
    }
    const pluginKey = longName === pluginName ? shortName : pluginName;
    if (!plugins[pluginKey]) {
        try {
            plugin = require(longName);
        }
        catch (pluginLoadErr) {
            try {
                // Check whether the plugin exists
                require.resolve(longName);
            }
            catch (error) {
                // If the plugin can't be resolved, display the missing plugin error (usually a config or install error)
                console.error(chalk_1.default.red(`Failed to load plugin ${longName}.`));
                const message = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred';
                throw new plugin_errors_1.MissingPluginError(pluginName, message, {
                    pluginName: longName,
                    commitlintPath: path_1.default.resolve(__dirname, '../..'),
                });
            }
            // Otherwise, the plugin exists and is throwing on module load for some reason, so print the stack trace.
            throw pluginLoadErr;
        }
        // This step is costly, so skip if debug is disabled
        if (debug) {
            const resolvedPath = require.resolve(longName);
            let version = null;
            try {
                version = require(`${longName}/package.json`).version;
            }
            catch (e) {
                // Do nothing
            }
            const loadedPluginAndVersion = version
                ? `${longName}@${version}`
                : `${longName}, version unknown`;
            console.log(chalk_1.default.blue(`Loaded plugin ${pluginName} (${loadedPluginAndVersion}) (from ${resolvedPath})`));
        }
        plugins[pluginKey] = plugin;
    }
    return plugins;
}
exports.default = loadPlugin;
//# sourceMappingURL=load-plugin.js.map