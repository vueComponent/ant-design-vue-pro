var Util = require('../util/index');

var Event = require('../event');

var EVENTS = ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'mouseenter', 'mouseout', 'mouseover', 'mousemove', 'mouseleave'];
var preShape = null;
var mousedown = null;
var dragging = null;
module.exports = {
  registerEvent: function registerEvent() {
    var self = this;
    var el = this.get('el');
    Util.each(EVENTS, function (evt) {
      el.addEventListener(evt, function (e) {
        self._triggerEvent(evt, e);
      }, false);
    }); // special cases

    el.addEventListener('touchstart', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);
    el.addEventListener('touchmove', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);
    el.addEventListener('touchend', function (e) {
      if (!Util.isEmpty(e.changedTouches)) {
        self._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
  },
  _getEmitter: function _getEmitter(element, event) {
    if (element) {
      if (Util.isEmpty(element._getEvents())) {
        var parent = element.get('parent');

        if (parent && !event.propagationStopped) {
          return this._getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  },
  _getEventObj: function _getEventObj(type, e, point, target) {
    var event = new Event(type, e, true, true);
    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent: function _triggerEvent(type, e) {
    var point = this.getPointByClient(e.clientX, e.clientY);
    var shape = this.getShape(point.x, point.y, e);
    var el = this.get('el'); // svg原生事件取不到dragover, dragout, drop等事件的对象。这边需要走数学拾取。

    if (dragging && this.getRenderer() === 'svg') {
      shape = this.getShape(point.x, point.y);
    }

    if (type === 'mousemove') {
      if (preShape && preShape !== shape) {
        this._emitEvent('mouseout', e, point, preShape);

        this._emitEvent('mouseleave', e, point, preShape);

        if (dragging) {
          this._emitEvent('dragleave', e, point, preShape);
        }

        if (!preShape.destroyed && !preShape.removed) {
          el.style.cursor = preShape.attr('cursor') || 'default';
        }
      } // 拖拽过程中不会触发mousemove事件


      if (dragging) {
        this._emitEvent('drag', e, point, dragging);
      }

      if (shape) {
        if (!dragging) {
          if (mousedown === shape) {
            dragging = shape;
            mousedown = null;

            this._emitEvent('dragstart', e, point, shape);
          } else {
            this._emitEvent('mousemove', e, point, shape);
          }
        }

        if (preShape !== shape) {
          this._emitEvent('mouseenter', e, point, shape);

          this._emitEvent('mouseover', e, point, shape);

          if (dragging) {
            this._emitEvent('dragenter', e, point, shape);
          }
        }
      } else {
        var canvasmousemove = this._getEventObj('mousemove', e, point, this);

        this.emit('mousemove', canvasmousemove);
      }

      preShape = shape;
    } else {
      this._emitEvent(type, e, point, shape || this);

      if (!dragging && type === 'mousedown') {
        mousedown = shape;
      }

      if (type === 'mouseup') {
        mousedown = null;

        if (dragging) {
          dragging._cfg.capture = true;

          this._emitEvent('dragend', e, point, dragging);

          dragging = null;

          this._emitEvent('drop', e, point, shape || this);
        }
      }
    }

    if (shape && !shape.destroyed) {
      el.style.cursor = shape.attr('cursor') || 'default';
    }
  },
  _emitEvent: function _emitEvent(type, evt, point, shape) {
    var event = this._getEventObj(type, evt, point, shape);

    var emitShape = this._getEmitter(shape, evt);

    emitShape && emitShape.emit(type, event);
    return emitShape;
  }
};