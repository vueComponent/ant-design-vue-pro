"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var media_1 = __importDefault(require("./media"));
var url_1 = __importDefault(require("./url"));
var quoted_1 = __importDefault(require("./quoted"));
var ruleset_1 = __importDefault(require("./ruleset"));
var anonymous_1 = __importDefault(require("./anonymous"));
var utils = __importStar(require("../utils"));
var less_error_1 = __importDefault(require("../less-error"));
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
var Import = function (path, features, options, index, currentFileInfo, visibilityInfo) {
    this.options = options;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.path = path;
    this.features = features;
    this.allowRoot = true;
    if (this.options.less !== undefined || this.options.inline) {
        this.css = !this.options.less || this.options.inline;
    }
    else {
        var pathValue = this.getPath();
        if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
            this.css = true;
        }
    }
    this.copyVisibilityInfo(visibilityInfo);
    this.setParent(this.features, this);
    this.setParent(this.path, this);
};
Import.prototype = new node_1.default();
Import.prototype.accept = function (visitor) {
    if (this.features) {
        this.features = visitor.visit(this.features);
    }
    this.path = visitor.visit(this.path);
    if (!this.options.isPlugin && !this.options.inline && this.root) {
        this.root = visitor.visit(this.root);
    }
};
Import.prototype.genCSS = function (context, output) {
    if (this.css && this.path._fileInfo.reference === undefined) {
        output.add('@import ', this._fileInfo, this._index);
        this.path.genCSS(context, output);
        if (this.features) {
            output.add(' ');
            this.features.genCSS(context, output);
        }
        output.add(';');
    }
};
Import.prototype.getPath = function () {
    return (this.path instanceof url_1.default) ?
        this.path.value.value : this.path.value;
};
Import.prototype.isVariableImport = function () {
    var path = this.path;
    if (path instanceof url_1.default) {
        path = path.value;
    }
    if (path instanceof quoted_1.default) {
        return path.containsVariables();
    }
    return true;
};
Import.prototype.evalForImport = function (context) {
    var path = this.path;
    if (path instanceof url_1.default) {
        path = path.value;
    }
    return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
};
Import.prototype.evalPath = function (context) {
    var path = this.path.eval(context);
    var fileInfo = this._fileInfo;
    if (!(path instanceof url_1.default)) {
        // Add the rootpath if the URL requires a rewrite
        var pathValue = path.value;
        if (fileInfo &&
            pathValue &&
            context.pathRequiresRewrite(pathValue)) {
            path.value = context.rewritePath(pathValue, fileInfo.rootpath);
        }
        else {
            path.value = context.normalizePath(path.value);
        }
    }
    return path;
};
Import.prototype.eval = function (context) {
    var result = this.doEval(context);
    if (this.options.reference || this.blocksVisibility()) {
        if (result.length || result.length === 0) {
            result.forEach(function (node) {
                node.addVisibilityBlock();
            });
        }
        else {
            result.addVisibilityBlock();
        }
    }
    return result;
};
Import.prototype.doEval = function (context) {
    var ruleset;
    var registry;
    var features = this.features && this.features.eval(context);
    if (this.options.isPlugin) {
        if (this.root && this.root.eval) {
            try {
                this.root.eval(context);
            }
            catch (e) {
                e.message = 'Plugin error during evaluation';
                throw new less_error_1.default(e, this.root.imports, this.root.filename);
            }
        }
        registry = context.frames[0] && context.frames[0].functionRegistry;
        if (registry && this.root && this.root.functions) {
            registry.addMultiple(this.root.functions);
        }
        return [];
    }
    if (this.skip) {
        if (typeof this.skip === 'function') {
            this.skip = this.skip();
        }
        if (this.skip) {
            return [];
        }
    }
    if (this.options.inline) {
        var contents = new anonymous_1.default(this.root, 0, {
            filename: this.importedFilename,
            reference: this.path._fileInfo && this.path._fileInfo.reference
        }, true, true);
        return this.features ? new media_1.default([contents], this.features.value) : [contents];
    }
    else if (this.css) {
        var newImport = new Import(this.evalPath(context), features, this.options, this._index);
        if (!newImport.css && this.error) {
            throw this.error;
        }
        return newImport;
    }
    else if (this.root) {
        ruleset = new ruleset_1.default(null, utils.copyArray(this.root.rules));
        ruleset.evalImports(context);
        return this.features ? new media_1.default(ruleset.rules, this.features.value) : ruleset.rules;
    }
    else {
        return [];
    }
};
Import.prototype.type = 'Import';
exports.default = Import;
//# sourceMappingURL=import.js.map