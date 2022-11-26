"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execute_rule_1 = __importDefault(require("@commitlint/execute-rule"));
const resolve_extends_1 = __importDefault(require("@commitlint/resolve-extends"));
const isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
const merge_1 = __importDefault(require("lodash/merge"));
const mergeWith_1 = __importDefault(require("lodash/mergeWith"));
const pick_1 = __importDefault(require("lodash/pick"));
const union_1 = __importDefault(require("lodash/union"));
const path_1 = __importDefault(require("path"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const load_config_1 = require("./utils/load-config");
const load_parser_opts_1 = require("./utils/load-parser-opts");
const load_plugin_1 = __importDefault(require("./utils/load-plugin"));
const pick_config_1 = require("./utils/pick-config");
const w = (_, b) => Array.isArray(b) ? b : undefined;
async function load(seed = {}, options = {}) {
    const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
    const loaded = await load_config_1.loadConfig(cwd, options.file);
    const base = loaded && loaded.filepath ? path_1.default.dirname(loaded.filepath) : cwd;
    // TODO: validate loaded.config against UserConfig type
    // Might amount to breaking changes, defer until 9.0.0
    // Merge passed config with file based options
    const config = pick_config_1.pickConfig(merge_1.default({}, loaded ? loaded.config : null, seed));
    const opts = merge_1.default({ extends: [], rules: {}, formatter: '@commitlint/format' }, pick_1.default(config, 'extends', 'plugins', 'ignores', 'defaultIgnores'));
    // Resolve parserPreset key
    if (typeof config.parserPreset === 'string') {
        const resolvedParserPreset = resolve_from_1.default(base, config.parserPreset);
        config.parserPreset = {
            name: config.parserPreset,
            path: resolvedParserPreset,
            parserOpts: require(resolvedParserPreset),
        };
    }
    // Resolve extends key
    const extended = resolve_extends_1.default(opts, {
        prefix: 'commitlint-config',
        cwd: base,
        parserPreset: config.parserPreset,
    });
    const preset = pick_config_1.pickConfig(mergeWith_1.default(extended, config, w));
    preset.plugins = {};
    // TODO: check if this is still necessary with the new factory based conventional changelog parsers
    // config.extends = Array.isArray(config.extends) ? config.extends : [];
    // Resolve parser-opts from preset
    if (typeof preset.parserPreset === 'object') {
        preset.parserPreset.parserOpts = await load_parser_opts_1.loadParserOpts(preset.parserPreset.name, 
        // TODO: fix the types for factory based conventional changelog parsers
        preset.parserPreset);
    }
    // Resolve config-relative formatter module
    if (typeof config.formatter === 'string') {
        preset.formatter =
            resolve_from_1.default.silent(base, config.formatter) || config.formatter;
    }
    // Read plugins from extends
    if (Array.isArray(extended.plugins)) {
        config.plugins = union_1.default(config.plugins, extended.plugins || []);
    }
    // resolve plugins
    if (Array.isArray(config.plugins)) {
        config.plugins.forEach((plugin) => {
            if (typeof plugin === 'string') {
                load_plugin_1.default(preset.plugins, plugin, process.env.DEBUG === 'true');
            }
            else {
                preset.plugins.local = plugin;
            }
        });
    }
    const rules = preset.rules ? preset.rules : {};
    const qualifiedRules = (await Promise.all(Object.entries(rules || {}).map((entry) => execute_rule_1.default(entry)))).reduce((registry, item) => {
        const [key, value] = item;
        registry[key] = value;
        return registry;
    }, {});
    const helpUrl = typeof config.helpUrl === 'string'
        ? config.helpUrl
        : 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';
    const prompt = preset.prompt && isPlainObject_1.default(preset.prompt) ? preset.prompt : {};
    return {
        extends: preset.extends,
        formatter: preset.formatter,
        parserPreset: preset.parserPreset,
        ignores: preset.ignores,
        defaultIgnores: preset.defaultIgnores,
        plugins: preset.plugins,
        rules: qualifiedRules,
        helpUrl,
        prompt,
    };
}
exports.default = load;
//# sourceMappingURL=load.js.map