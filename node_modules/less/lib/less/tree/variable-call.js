"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var variable_1 = __importDefault(require("./variable"));
var ruleset_1 = __importDefault(require("./ruleset"));
var detached_ruleset_1 = __importDefault(require("./detached-ruleset"));
var less_error_1 = __importDefault(require("../less-error"));
var VariableCall = function (variable, index, currentFileInfo) {
    this.variable = variable;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.allowRoot = true;
};
VariableCall.prototype = new node_1.default();
VariableCall.prototype.eval = function (context) {
    var rules;
    var detachedRuleset = new variable_1.default(this.variable, this.getIndex(), this.fileInfo()).eval(context);
    var error = new less_error_1.default({ message: "Could not evaluate variable call " + this.variable });
    if (!detachedRuleset.ruleset) {
        if (detachedRuleset.rules) {
            rules = detachedRuleset;
        }
        else if (Array.isArray(detachedRuleset)) {
            rules = new ruleset_1.default('', detachedRuleset);
        }
        else if (Array.isArray(detachedRuleset.value)) {
            rules = new ruleset_1.default('', detachedRuleset.value);
        }
        else {
            throw error;
        }
        detachedRuleset = new detached_ruleset_1.default(rules);
    }
    if (detachedRuleset.ruleset) {
        return detachedRuleset.callEval(context);
    }
    throw error;
};
VariableCall.prototype.type = 'VariableCall';
exports.default = VariableCall;
//# sourceMappingURL=variable-call.js.map