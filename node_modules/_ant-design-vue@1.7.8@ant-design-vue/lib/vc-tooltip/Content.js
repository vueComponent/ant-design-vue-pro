'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: {
    prefixCls: _vueTypes2['default'].string,
    overlay: _vueTypes2['default'].any,
    trigger: _vueTypes2['default'].any
  },
  updated: function updated() {
    var trigger = this.trigger;

    if (trigger) {
      trigger.forcePopupAlign();
    }
  },
  render: function render() {
    var h = arguments[0];
    var overlay = this.overlay,
        prefixCls = this.prefixCls;

    return h(
      'div',
      { 'class': prefixCls + '-inner', attrs: { role: 'tooltip' }
      },
      [typeof overlay === 'function' ? overlay() : overlay]
    );
  }
};