"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var call_1 = __importDefault(require("./call"));
var Variable = function (name, index, currentFileInfo) {
    this.name = name;
    this._index = index;
    this._fileInfo = currentFileInfo;
};
Variable.prototype = new node_1.default();
Variable.prototype.eval = function (context) {
    var variable;
    var name = this.name;
    if (name.indexOf('@@') === 0) {
        name = "@" + new Variable(name.slice(1), this.getIndex(), this.fileInfo()).eval(context).value;
    }
    if (this.evaluating) {
        throw { type: 'Name', message: "Recursive variable definition for " + name, filename: this.fileInfo().filename,
            index: this.getIndex() };
    }
    this.evaluating = true;
    variable = this.find(context.frames, function (frame) {
        var v = frame.variable(name);
        if (v) {
            if (v.important) {
                var importantScope = context.importantScope[context.importantScope.length - 1];
                importantScope.important = v.important;
            }
            // If in calc, wrap vars in a function call to cascade evaluate args first
            if (context.inCalc) {
                return (new call_1.default('_SELF', [v.value])).eval(context);
            }
            else {
                return v.value.eval(context);
            }
        }
    });
    if (variable) {
        this.evaluating = false;
        return variable;
    }
    else {
        throw { type: 'Name', message: "variable " + name + " is undefined", filename: this.fileInfo().filename,
            index: this.getIndex() };
    }
};
Variable.prototype.find = function (obj, fun) {
    for (var i = 0, r = void 0; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);
        if (r) {
            return r;
        }
    }
    return null;
};
Variable.prototype.type = 'Variable';
exports.default = Variable;
//# sourceMappingURL=variable.js.map