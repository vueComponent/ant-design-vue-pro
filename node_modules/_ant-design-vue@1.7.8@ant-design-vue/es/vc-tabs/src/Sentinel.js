import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../../_util/vue-types';
import KeyCode from '../../_util/KeyCode';

var sentinelStyle = { width: 0, height: 0, overflow: 'hidden', position: 'absolute' };
export default {
  name: 'Sentinel',
  props: {
    setRef: PropTypes.func,
    prevElement: PropTypes.any,
    nextElement: PropTypes.any
  },
  methods: {
    onKeyDown: function onKeyDown(_ref) {
      var target = _ref.target,
          which = _ref.which,
          shiftKey = _ref.shiftKey;
      var _$props = this.$props,
          nextElement = _$props.nextElement,
          prevElement = _$props.prevElement;

      if (which !== KeyCode.TAB || document.activeElement !== target) return;

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
      _mergeJSXProps([{
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