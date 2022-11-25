// 完整版下使用支持按照某个字段进行分组的 dodge
const mix = require('@antv/util/lib/mix');
const Adjust = require('./base');
const Dodge = require('./dodge');
const Stack = require('./stack');
const AdjustMixin = require('./mixin/adjust');
const DodgeMixin = require('./mixin/dodge');
const StackMixin = require('./mixin/stack');
mix(Adjust.prototype, AdjustMixin);
mix(Dodge.prototype, AdjustMixin, DodgeMixin);
mix(Stack.prototype, StackMixin);

Adjust.Jitter = require('./jitter');
Adjust.Symmetric = require('./symmetric');
Adjust.Dodge = Dodge;
Adjust.Stack = Stack;

module.exports = Adjust;
