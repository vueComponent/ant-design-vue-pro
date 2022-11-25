const Util = require('./util/index');

const Event = function(type, event, bubbles, cancelable) {
  this.type = type;  // 事件类型
  this.target = null; // 目标
  this.currentTarget = null; // 当前目标
  this.bubbles = bubbles; // 冒泡
  this.cancelable = cancelable; // 是否能够阻止
  this.timeStamp = (new Date()).getTime(); // 时间戳
  this.defaultPrevented = false; // 阻止默认
  this.propagationStopped = false; // 阻止冒泡
  this.removed = false; // 是否被移除
  this.event = event; // 触发的原生事件
};


Util.augment(Event, {
  preventDefault() {
    this.defaultPrevented = this.cancelable && true;
  },
  stopPropagation() {
    this.propagationStopped = true;
  },
  remove() {
    this.remove = true;
  },
  clone() {
    return Util.clone(this);
  },
  toString() {
    return '[Event (type=' + this.type + ')]';
  }
});

module.exports = Event;
