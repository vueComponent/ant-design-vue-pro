var Util = require('../util/common');

var slice = Array.prototype.slice;

function indexOfCallback(events, callback) {
  var i = events.length;

  while (i--) {
    if (events[i].callback === callback) {
      return i;
    }
  }

  return -1;
}

var EventEmitter = function EventEmitter() {};

Util.augment(EventEmitter, {
  on: function on(evt, callback, one) {
    var self = this;

    if (!Util.isFunction(callback)) {
      throw new TypeError('listener should be a function');
    }

    if (!self._cfg._events) {
      self._cfg._events = {};
    }

    if (!self._cfg._events[evt]) {
      self._cfg._events[evt] = [];
    }

    self._cfg._events[evt].push({
      callback: callback,
      one: one
    });

    return this;
  },
  one: function one(evt, callback) {
    this.on(evt, callback, true);
    return this;
  },
  emit: function emit(evt) {
    if (this.get('destroyed')) {
      return;
    }

    if (!this._cfg._events || Util.isEmpty(this._cfg._events)) {
      return;
    }

    var events = this._cfg._events[evt];

    if (Util.isEmpty(events)) {
      return;
    }

    var args = arguments;
    var arg = slice.call(args, 1);
    var length = events.length;

    for (var i = 0; i < length;) {
      events[i].callback.apply(this, arg);

      if (events[i].one) {
        events.splice(i, 1);
        length--;
      } else {
        i++;
      }
    }
  },
  trigger: function trigger() {
    this.emit.apply(this, arguments);
  },
  off: function off(evt, callback) {
    var events = this._cfg._events;

    if (!events || Util.isEmpty(events)) {
      return;
    }

    if (arguments.length === 0) {
      this._cfg._events = {};
      return this;
    }

    if (events[evt]) {
      var index = indexOfCallback(events[evt], callback);

      if (index >= 0) {
        events[evt].splice(index, 1);
      }

      if (events[evt].length === 0) {
        delete events[evt];
      }
    }
  },
  removeEvent: function removeEvent(evt) {
    if (typeof evt === 'undefined') {
      this._cfg._events = {};
    } else {
      delete this._cfg._events[evt];
    }

    return this;
  },
  _getEvents: function _getEvents() {
    return this._cfg._events || {};
  }
});
module.exports = EventEmitter;