'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _KeyCode = require('../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var sentinelStyle = { width: 0, height: 0, overflow: 'hidden', position: 'absolute' };
exports['default'] = {
  name: 'Sentinel',
  props: {
    setRef: _vueTypes2['default'].func,
    prevElement: _vueTypes2['default'].any,
    nextElement: _vueTypes2['default'].any
  },
  methods: {
    onKeyDown: function onKeyDown(_ref) {
      var target = _ref.target,
          which = _ref.which,
          shiftKey = _ref.shiftKey;
      var _$props = this.$props,
          nextElement = _$props.nextElement,
          prevElement = _$props.prevElement;

      if (which !== _KeyCode2['default'].TAB || document.activeElement !== target) return;

      // Tab next
      if (!shiftKey && nextElement) {
        nextElement.focus();
      }

      // Tab prev
      if (shiftKey && prevElement) {
        prevElement.focus();
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    var setRef = this.$props.setRef;


    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          tabIndex: 0
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: setRef
        }]
      }, {
        style: sentinelStyle,
        on: {
          'keydown': this.onKeyDown
        },
        attrs: {
          role: 'presentation'
        }
      }]),
      [this.$slots['default']]
    );
  }
};