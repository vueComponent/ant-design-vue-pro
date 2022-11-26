"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var selector_1 = __importDefault(require("./selector"));
var ruleset_1 = __importDefault(require("./ruleset"));
var anonymous_1 = __importDefault(require("./anonymous"));
var AtRule = function (name, value, rules, index, currentFileInfo, debugInfo, isRooted, visibilityInfo) {
    var i;
    this.name = name;
    this.value = (value instanceof node_1.default) ? value : (value ? new anonymous_1.default(value) : value);
    if (rules) {
        if (Array.isArray(rules)) {
            this.rules = rules;
        }
        else {
            this.rules = [rules];
            this.rules[0].selectors = (new selector_1.default([], null, null, index, currentFileInfo)).createEmptySelectors();
        }
        for (i = 0; i < this.rules.length; i++) {
            this.rules[i].allowImports = true;
        }
        this.setParent(this.rules, this);
    }
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.debugInfo = debugInfo;
    this.isRooted = isRooted || false;
    this.copyVisibilityInfo(visibilityInfo);
    this.allowRoot = true;
};
AtRule.prototype = new node_1.default();
AtRule.prototype.accept = function (visitor) {
    var value = this.value;
    var rules = this.rules;
    if (rules) {
        this.rules = visitor.visitArray(rules);
    }
    if (value) {
        this.value = visitor.visit(value);
    }
};
AtRule.prototype.isRulesetLike = function () {
    return this.rules || !this.isCharset();
};
AtRule.prototype.isCharset = function () {
    return '@charset' === this.name;
};
AtRule.prototype.genCSS = function (context, output) {
    var value = this.value;
    var rules = this.rules;
    output.add(this.name, this.fileInfo(), this.getIndex());
    if (value) {
        output.add(' ');
        value.genCSS(context, output);
    }
    if (rules) {
        this.outputRuleset(context, output, rules);
    }
    else {
        output.add(';');
    }
};
AtRule.prototype.eval = function (context) {
    var mediaPathBackup;
    var mediaBlocksBackup;
    var value = this.value;
    var rules = this.rules;
    // media stored inside other atrule should not bubble over it
    // backpup media bubbling information
    mediaPathBackup = context.mediaPath;
    mediaBlocksBackup = context.mediaBlocks;
    // deleted media bubbling information
    context.mediaPath = [];
    context.mediaBlocks = [];
    if (value) {
        value = value.eval(context);
    }
    if (rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        rules = [rules[0].eval(context)];
        rules[0].root = true;
    }
    // restore media bubbling information
    context.mediaPath = mediaPathBackup;
    context.mediaBlocks = mediaBlocksBackup;
    return new AtRule(this.name, value, rules, this.getIndex(), this.fileInfo(), this.debugInfo, this.isRooted, this.visibilityInfo());
};
AtRule.prototype.variable = function (name) {
    if (this.rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return ruleset_1.default.prototype.variable.call(this.rules[0], name);
    }
};
AtRule.prototype.find = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this.rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return ruleset_1.default.prototype.find.apply(this.rules[0], args);
    }
};
AtRule.prototype.rulesets = function () {
    if (this.rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return ruleset_1.default.prototype.rulesets.apply(this.rules[0]);
    }
};
AtRule.prototype.outputRuleset = function (context, output, rules) {
    var ruleCnt = rules.length;
    var i;
    context.tabLevel = (context.tabLevel | 0) + 1;
    // Compressed
    if (context.compress) {
        output.add('{');
        for (i = 0; i < ruleCnt; i++) {
            rules[i].genCSS(context, output);
        }
        output.add('}');
        context.tabLevel--;
        return;
    }
    // Non-compressed
    var tabSetStr = "\n" + Array(context.tabLevel).join('  ');
    var tabRuleStr = tabSetStr + "  ";
    if (!ruleCnt) {
        output.add(" {" + tabSetStr + "}");
    }
    else {
        output.add(" {" + tabRuleStr);
        rules[0].genCSS(context, output);
        for (i = 1; i < ruleCnt; i++) {
            output.add(tabRuleStr);
            rules[i].genCSS(context, output);
        }
        output.add(tabSetStr + "}");
    }
    context.tabLevel--;
};
AtRule.prototype.type = 'AtRule';
exports.default = AtRule;
//# sourceMappingURL=atrule.js.map