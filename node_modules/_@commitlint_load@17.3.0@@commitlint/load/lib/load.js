"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execute_rule_1 = __importDefault(require("@commitlint/execute-rule"));
const resolve_extends_1 = __importDefault(require("@commitlint/resolve-extends"));
const config_validator_1 = require("@commitlint/config-validator");
const lodash_isplainobject_1 = __importDefault(require("lodash.isplainobject"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const path_1 = __importDefault(require("path"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const load_config_1 = require("./utils/load-config");
const load_parser_opts_1 = require("./utils/load-parser-opts");
const load_plugin_1 = __importDefault(require("./utils/load-plugin"));
async function load(seed = {}, options = {}) {
    const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
    const loaded = await (0, load_config_1.loadConfig)(cwd, options.file);
    const base = loaded && loaded.filepath ? path_1.default.dirname(loaded.filepath) : cwd;
    let config = {};
    if (loaded) {
        (0, config_validator_1.validateConfig)(loaded.filepath || '', loaded.config);
        config = loaded.config;
    }
    // Merge passed config with file based options
    config = (0, lodash_merge_1.default)({
        extends: [],
        plugins: [],
        rules: {},
    }, config, seed);
    // Resolve parserPreset key
    if (typeof config.parserPreset === 'string') {
        const resolvedParserPreset = (0, resolve_from_1.default)(base, config.parserPreset);
        config.parserPreset = {
            name: config.parserPreset,
            path: resolvedParserPreset,
            parserOpts: require(resolvedParserPreset),
        };
    }
    // Resolve extends key
    const extended = (0, resolve_extends_1.default)(config, {
        prefix: 'commitlint-config',
        cwd: base,
        parserPreset: config.parserPreset,
    });
    if (!extended.formatter || typeof extended.formatter !== 'string') {
        extended.formatter = '@commitlint/format';
    }
    let plugins = {};
    if (Array.isArray(extended.plugins)) {
        (0, lodash_uniq_1.default)(extended.plugins || []).forEach((plugin) => {
            if (typeof plugin === 'string') {
                plugins = (0, load_plugin_1.default)(plugins, plugin, process.env.DEBUG === 'true');
            }
            else {
                plugins.local = plugin;
            }
        });
    }
    const rules = (await Promise.all(Object.entries(extended.rules || {}).map((entry) => (0, execute_rule_1.default)(entry)))).reduce((registry, item) => {
        // type of `item` can be null, but Object.entries always returns key pair
        const [key, value] = item;
        registry[key] = value;
        return registry;
    }, {});
    const helpUrl = typeof extended.helpUrl === 'string'
        ? extended.helpUrl
        : typeof config.helpUrl === 'string'
            ? config.helpUrl
            : 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';
    const prompt = extended.prompt && (0, lodash_isplainobject_1.default)(extended.prompt) ? extended.prompt : {};
    return {
        extends: Array.isArray(extended.extends)
            ? extended.extends
            : typeof extended.extends === 'string'
                ? [extended.extends]
                : [],
        // Resolve config-relative formatter module
        formatter: resolve_from_1.default.silent(base, extended.formatter) || extended.formatter,
        // Resolve parser-opts from preset
        parserPreset: await (0, load_parser_opts_1.loadParserOpts)(extended.parserPreset),
        ignores: extended.ignores,
        defaultIgnores: extended.defaultIgnores,
        plugins: plugins,
        rules: rules,
        helpUrl: helpUrl,
        prompt,
    };
}
exports.default = load;
//# sourceMappingURL=load.js.map