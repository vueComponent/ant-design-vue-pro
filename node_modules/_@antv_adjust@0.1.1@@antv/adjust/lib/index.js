// 完整版下使用支持按照某个字段进行分组的 dodge
var mix = require('@antv/util/lib/mix');

var Adjust = require('./base');

var Dodge = require('./dodge');

var Stack = require('./stack');

var AdjustMixin = require('./mixin/adjust');

var DodgeMixin = require('./mixin/dodge');

var StackMixin = require('./mixin/stack');

mix(Adjust.prototype, AdjustMixin);
mix(Dodge.prototype, AdjustMixin, DodgeMixin);
mix(Stack.prototype, StackMixin);
Adjust.Jitter = require('./jitter');
Adjust.Symmetric = require('./symmetric');
Adjust.Dodge = Dodge;
Adjust.Stack = Stack;
module.exports = Adjust;