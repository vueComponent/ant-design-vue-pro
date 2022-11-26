var Util = require('../../util/index');

var Event = require('../../event');

var EVENTS = ['mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseout', 'mouseover', 'mousemove', 'mouseleave']; // 获取当前时间

var getNowTime = function getNowTime() {
  var now = new Date();
  return now.getTime();
};

var CLICK_OFFSET = 40;
var LEFT_BTN_CODE = 0;
var preShape = null;
var mousedownShape = null;
var mousedownOffset = {};
var dragging = null;
var clickTimestamp = 0;
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
    el.addEventListener('contextmenu', function (e) {
      self._triggerEvent('contextmenu', e);

      e.preventDefault();
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
    var event = new Event(type, e, true, true); // 事件的x,y应该是基于画布左上角的，与canvas的matrix无关

    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent: function _triggerEvent(type, e) {
    var self = this;
    var point = self.getPointByEvent(e);
    var shape = self.getShape(point.x, point.y, e);
    var el = self.get('el'); // svg原生事件取不到dragover, dragout, drop等事件的对象。这边需要走数学拾取。

    if (dragging && self.getRenderer() === 'svg') {
      shape = self.getShape(point.x, point.y);
    }

    if (type === 'mousemove') {
      if (preShape && preShape !== shape) {
        self._emitEvent('mouseout', e, point, preShape);

        self._emitEvent('mouseleave', e, point, preShape);

        if (dragging) {
          self._emitEvent('dragleave', e, point, preShape);
        } // 当 mouseleave 触发时，如果拾取到其他 shape 的 mouseenter ，鼠标样式会正常
        // 当鼠标移出 shape 但是移动到画布上时，没有shape，就不恢复样式。这里判断一下，直接重置


        if (!shape || shape.destroyed) {
          el.style.cursor = 'default';
        }
      }

      if (dragging) {
        self._emitEvent('drag', e, point, dragging);
        /**
         * H5原生事件中drag同时不会触发mousemove
         * 但是在上层具有嵌套关系的item事件计算中需要用到drag时的mousemove
         * 才能计算dragenter etc.
         */


        self._emitEvent('mousemove', e, point, shape);
      }

      if (shape) {
        if (!dragging) {
          if (mousedownShape === shape) {
            var now = getNowTime();
            var timeWindow = now - clickTimestamp;
            var dx = mousedownOffset.x - e.clientX;
            var dy = mousedownOffset.y - e.clientY;
            var dist = dx * dx + dy * dy;

            if (timeWindow > 120 || dist > CLICK_OFFSET) {
              dragging = shape;
              mousedownShape = null;

              this._emitEvent('dragstart', e, point, shape);
            } else {
              self._emitEvent('mousemove', e, point, shape);
            }
          } else {
            self._emitEvent('mousemove', e, point, shape);
          }
        }

        if (preShape !== shape) {
          self._emitEvent('mouseenter', e, point, shape);

          self._emitEvent('mouseover', e, point, shape);

          if (dragging) {
            self._emitEvent('dragenter', e, point, shape);
          }
        }
      } else {
        var canvasmousemove = self._getEventObj('mousemove', e, point, self);

        self.emit('mousemove', canvasmousemove);
      }

      preShape = shape;
    } else {
      this._emitEvent(type, e, point, shape || this); // e.button === 0 保证按下左键，防止点击右键触发click


      if (!dragging && type === 'mousedown' && e.button === LEFT_BTN_CODE) {
        mousedownShape = shape;
        mousedownOffset = {
          x: e.clientX,
          y: e.clientY
        };
        clickTimestamp = getNowTime();
      }

      if (type === 'mouseup' && e.button === LEFT_BTN_CODE) {
        var _dx = mousedownOffset.x - e.clientX;

        var _dy = mousedownOffset.y - e.clientY;

        var _dist = _dx * _dx + _dy * _dy;

        var _now = getNowTime();

        var _timeWindow = _now - clickTimestamp;

        if (_dist < CLICK_OFFSET || _timeWindow < 200) {
          clickTimestamp = 0;

          this._emitEvent('click', e, point, mousedownShape || this);
        }

        if (dragging) {
          dragging._cfg.capture = true;

          this._emitEvent('dragend', e, point, dragging);

          dragging = null;

          this._emitEvent('drop', e, point, shape || this);
        }

        mousedownShape = null;
      }
    }

    if (shape && !shape.get('destroyed')) {
      el.style.cursor = shape.attr('cursor') || 'default';
    }
  },
  _emitEvent: function _emitEvent(type, evt, point, shape) {
    var event = this._getEventObj(type, evt, point, shape);

    var emitShape = this._getEmitter(shape, evt);

    emitShape && !emitShape.get('destroyed') && emitShape.emit(type, event);
    return emitShape;
  }
};