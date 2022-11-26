const Util = require('../../util/index');
const Event = require('../../event');
const EVENTS = [
  'mousedown',
  'mouseup',
  'dblclick',
  'mouseenter',
  'mouseout',
  'mouseover',
  'mousemove',
  'mouseleave'
];

// 获取当前时间
const getNowTime = () => {
  const now = new Date();
  return now.getTime();
};

const CLICK_OFFSET = 40;
const LEFT_BTN_CODE = 0;

let preShape = null;
let mousedownShape = null;
let mousedownOffset = {};
let dragging = null;
let clickTimestamp = 0;

module.exports = {
  registerEvent() {
    const self = this;

    const el = this.get('el');

    Util.each(EVENTS, evt => {
      el.addEventListener(evt, e => {
        self._triggerEvent(evt, e);
      }, false);
    });
    // special cases
    el.addEventListener('touchstart', e => {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchmove', e => {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchend', e => {
      if (!Util.isEmpty(e.changedTouches)) {
        self._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
    el.addEventListener('contextmenu', e => {
      self._triggerEvent('contextmenu', e);
      e.preventDefault();
    }, false);
  },
  _getEmitter(element, event) {
    if (element) {
      if (Util.isEmpty(element._getEvents())) {
        const parent = element.get('parent');
        if (parent && !event.propagationStopped) {
          return this._getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  },
  _getEventObj(type, e, point, target) {
    const event = new Event(type, e, true, true);
    // 事件的x,y应该是基于画布左上角的，与canvas的matrix无关
    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent(type, e) {

    const self = this;
    const point = self.getPointByEvent(e);
    let shape = self.getShape(point.x, point.y, e);
    const el = self.get('el');
    // svg原生事件取不到dragover, dragout, drop等事件的对象。这边需要走数学拾取。
    if (dragging && self.getRenderer() === 'svg') {
      shape = self.getShape(point.x, point.y);
    }
    if (type === 'mousemove') {
      if (preShape && preShape !== shape) {
        self._emitEvent('mouseout', e, point, preShape);
        self._emitEvent('mouseleave', e, point, preShape);
        if (dragging) {
          self._emitEvent('dragleave', e, point, preShape);
        }
        // 当 mouseleave 触发时，如果拾取到其他 shape 的 mouseenter ，鼠标样式会正常
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
            const now = getNowTime();
            const timeWindow = now - clickTimestamp;
            const dx = mousedownOffset.x - e.clientX;
            const dy = mousedownOffset.y - e.clientY;
            const dist = dx * dx + dy * dy;

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
        const canvasmousemove = self._getEventObj('mousemove', e, point, self);
        self.emit('mousemove', canvasmousemove);
      }
      preShape = shape;
    } else {
      this._emitEvent(type, e, point, shape || this);
      // e.button === 0 保证按下左键，防止点击右键触发click
      if (!dragging && type === 'mousedown' && e.button === LEFT_BTN_CODE) {
        mousedownShape = shape;
        mousedownOffset = { x: e.clientX, y: e.clientY };
        clickTimestamp = getNowTime();
      }
      if (type === 'mouseup' && e.button === LEFT_BTN_CODE) {
        const dx = mousedownOffset.x - e.clientX;
        const dy = mousedownOffset.y - e.clientY;
        const dist = dx * dx + dy * dy;
        const now = getNowTime();
        const timeWindow = now - clickTimestamp;
        if (dist < CLICK_OFFSET || timeWindow < 200) {
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
  _emitEvent(type, evt, point, shape) {
    const event = this._getEventObj(type, evt, point, shape);
    const emitShape = this._getEmitter(shape, evt);
    emitShape && !emitShape.get('destroyed') && emitShape.emit(type, event);
    return emitShape;
  }
};
