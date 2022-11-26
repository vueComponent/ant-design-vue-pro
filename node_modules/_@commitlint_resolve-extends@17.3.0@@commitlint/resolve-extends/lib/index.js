"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require("resolve-global");
const resolve_from_1 = __importDefault(require("resolve-from"));
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
const config_validator_1 = require("@commitlint/config-validator");
const importFresh = require('import-fresh');
function resolveExtends(config = {}, context = {}) {
    const { extends: e } = config;
    const extended = loadExtends(config, context);
    extended.push(config);
    return extended.reduce((r, _a) => {
        var { extends: _ } = _a, c = __rest(_a, ["extends"]);
        return (0, lodash_mergewith_1.default)(r, c, (objValue, srcValue, key) => {
            if (key === 'plugins') {
                if (Array.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
            else if (Array.isArray(objValue)) {
                return srcValue;
            }
        });
    }, e ? { extends: e } : {});
}
exports.default = resolveExtends;
function loadExtends(config = {}, context = {}) {
    const { extends: e } = config;
    const ext = e ? (Array.isArray(e) ? e : [e]) : [];
    return ext.reduce((configs, raw) => {
        const load = context.require || require;
        const resolved = resolveConfig(raw, context);
        const c = load(resolved);
        const cwd = path_1.default.dirname(resolved);
        const ctx = Object.assign(Object.assign({}, context), { cwd });
        // Resolve parser preset if none was present before
        if (!context.parserPreset &&
            typeof c === 'object' &&
            typeof c.parserPreset === 'string') {
            const resolvedParserPreset = (0, resolve_from_1.default)(cwd, c.parserPreset);
            const parserPreset = {
                name: c.parserPreset,
                path: `./${path_1.default.relative(process.cwd(), resolvedParserPreset)}`
                    .split(path_1.default.sep)
                    .join('/'),
                parserOpts: require(resolvedParserPreset),
            };
            ctx.parserPreset = parserPreset;
            config.parserPreset = parserPreset;
        }
        (0, config_validator_1.validateConfig)(resolved, config);
        return [...configs, ...loadExtends(c, ctx), c];
    }, []);
}
function getId(raw = '', prefix = '') {
    const first = raw.charAt(0);
    const scoped = first === '@';
    const relative = first === '.';
    const absolute = path_1.default.isAbsolute(raw);
    if (scoped) {
        return raw.includes('/') ? raw : [raw, prefix].filter(String).join('/');
    }
    return relative || absolute ? raw : [prefix, raw].filter(String).join('-');
}
function resolveConfig(raw, context = {}) {
    const resolve = context.resolve || resolveId;
    const id = getId(raw, context.prefix);
    try {
        return resolve(id, context);
    }
    catch (err) {
        const legacy = getId(raw, 'conventional-changelog-lint-config');
        const resolved = resolve(legacy, context);
        console.warn(`Resolving ${raw} to legacy config ${legacy}. To silence this warning raise an issue at 'npm repo ${legacy}' to rename to ${id}.`);
        return resolved;
    }
}
function resolveId(id, context = {}) {
    const cwd = context.cwd || process.cwd();
    const localPath = resolveFromSilent(cwd, id);
    if (typeof localPath === 'string') {
        return localPath;
    }
    const resolveGlobal = context.resolveGlobal || resolveGlobalSilent;
    const globalPath = resolveGlobal(id);
    if (typeof globalPath === 'string') {
        return globalPath;
    }
    const err = new Error(`Cannot find module "${id}" from "${cwd}"`);
    err.code = 'MODULE_NOT_FOUND';
    throw err;
}
function resolveFromSilent(cwd, id) {
    try {
        return (0, resolve_from_1.default)(cwd, id);
    }
    catch (err) { }
}
function resolveGlobalSilent(id) {
    try {
        const resolveGlobal = importFresh('resolve-global');
        return resolveGlobal(id);
    }
    catch (err) { }
}
//# sourceMappingURL=index.js.map