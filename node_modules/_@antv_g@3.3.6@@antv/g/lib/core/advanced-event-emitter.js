var Util = require('../util/index');

var Event = require('../event');

var EventEmitter = require('./event-emitter');

var PROPOGATE_EVENTS = ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'mouseout', 'mouseover', 'mousemove', 'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave', 'drop'];

var AdvancedEE = function AdvancedEE() {};

Util.augment(AdvancedEE, EventEmitter, {
  emit: function emit(evt, e) {
    var args = arguments;
    EventEmitter.prototype.emit.apply(this, args);

    if (args.length >= 2 && args[1] instanceof Event && args[1].propagationStopped) {
      return;
    }

    if (PROPOGATE_EVENTS.indexOf(evt) >= 0 && e.target === this
    /* prevent bubbling multiple times */
    ) {
        var shape = this._cfg.parent;

        while (shape && !shape.get('destroyed')) {
          shape.emit.apply(shape, args);
          shape = shape._cfg.parent;
        }
      }
  }
});
module.exports = AdvancedEE;