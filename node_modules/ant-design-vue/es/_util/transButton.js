import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import KeyCode from './KeyCode';
import PropTypes from './vue-types';

var inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block'
};

var TransButton = {
  props: {
    noStyle: PropTypes.bool
  },

  methods: {
    onKeyDown: function onKeyDown(event) {
      var keyCode = event.keyCode;

      if (keyCode === KeyCode.ENTER) {
        event.preventDefault();
      }
    },
    onKeyUp: function onKeyUp(event) {
      var keyCode = event.keyCode;

      if (keyCode === KeyCode.ENTER) {
        this.$emit('click', event);
      }
    },
    setRef: function setRef(btn) {
      this.div = btn;
    },
    focus: function focus() {
      if (this.div) {
        this.div.focus();
      }
    },
    blur: function blur() {
      if (this.div) {
        this.div.blur();
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var noStyle = this.$props.noStyle;


    return h(
      'div',
      _mergeJSXProps([{
        attrs: {
          role: 'button',
          tabIndex: 0
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.setRef
        }],
        on: _extends({}, this.$listeners, {
          keydown: this.onKeyDown,
          keyup: this.onKeyUp
        })
      }, {
        style: _extends({}, !noStyle ? inlineStyle : null)
      }]),
      [this.$slots['default']]
    );
  }
};

export default TransButton;