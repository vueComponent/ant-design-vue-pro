"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var _noSpaceCombinators = {
    '': true,
    ' ': true,
    '|': true
};
var Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
        this.emptyOrWhitespace = true;
    }
    else {
        this.value = value ? value.trim() : '';
        this.emptyOrWhitespace = this.value === '';
    }
};
Combinator.prototype = new node_1.default();
Combinator.prototype.genCSS = function (context, output) {
    var spaceOrEmpty = (context.compress || _noSpaceCombinators[this.value]) ? '' : ' ';
    output.add(spaceOrEmpty + this.value + spaceOrEmpty);
};
Combinator.prototype.type = 'Combinator';
exports.default = Combinator;
//# sourceMappingURL=combinator.js.map