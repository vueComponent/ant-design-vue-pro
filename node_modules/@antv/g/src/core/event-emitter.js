const Util = require('../util/common');

const slice = Array.prototype.slice;

function indexOfCallback(events, callback) {
  let i = events.length;
  while (i--) {
    if (events[i].callback === callback) {
      return i;
    }
  }
  return -1;
}

const EventEmitter = function() {};

Util.augment(EventEmitter, {
  on(evt, callback, one) {
    const self = this;
    if (!Util.isFunction(callback)) {
      throw new TypeError('listener should be a function');
    }
    if (!self._cfg._events) {
      self._cfg._events = {};
    }
    if (!self._cfg._events[evt]) {
      self._cfg._events[evt] = [];
    }
    self._cfg._events[evt].push({ callback, one });
    return this;
  },
  one(evt, callback) {
    this.on(evt, callback, true);
    return this;
  },
  emit(evt) {
    if (this.get('destroyed')) {
      return;
    }
    if (!this._cfg._events || Util.isEmpty(this._cfg._events)) {
      return;
    }
    const events = this._cfg._events[evt];
    if (Util.isEmpty(events)) {
      return;
    }
    const args = arguments;
    const arg = slice.call(args, 1);
    let length = events.length;
    for (let i = 0; i < length;) {
      if (!events[i]) {
        continue;
      }
      events[i].callback.apply(this, arg);
      if (events[i] && events[i].one) {
        events.splice(i, 1);
        length--;
      } else {
        i++;
      }
    }
  },
  trigger() {
    this.emit.apply(this, arguments);
  },
  off(evt, callback) {
    const events = this._cfg._events;
    if (!events || Util.isEmpty(events)) {
      return;
    }
    if (arguments.length === 0) {
      this._cfg._events = {};
      return this;
    }
    if (events[evt]) {
      const index = indexOfCallback(events[evt], callback);
      if (index >= 0) {
        events[evt].splice(index, 1);
      }
      if (events[evt].length === 0) {
        delete events[evt];
      }
    }
  },
  removeEvent(evt) {
    if (typeof evt === 'undefined') {
      this._cfg._events = {};
    } else {
      delete this._cfg._events[evt];
    }
    return this;
  },
  _getEvents() {
    return this._cfg._events || {};
  }
});

module.exports = EventEmitter;
