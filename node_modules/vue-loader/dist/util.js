"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTemplateTSOptions = void 0;
function resolveTemplateTSOptions(descriptor, options) {
    var _a, _b, _c;
    if (options.enableTsInTemplate === false)
        return null;
    const lang = ((_a = descriptor.script) === null || _a === void 0 ? void 0 : _a.lang) || ((_b = descriptor.scriptSetup) === null || _b === void 0 ? void 0 : _b.lang);
    const isTS = !!(lang && /tsx?$/.test(lang));
    let expressionPlugins = ((_c = options === null || options === void 0 ? void 0 : options.compilerOptions) === null || _c === void 0 ? void 0 : _c.expressionPlugins) || [];
    if (isTS && !expressionPlugins.includes('typescript')) {
        expressionPlugins = [...expressionPlugins, 'typescript'];
    }
    return {
        isTS,
        expressionPlugins,
    };
}
exports.resolveTemplateTSOptions = resolveTemplateTSOptions;
