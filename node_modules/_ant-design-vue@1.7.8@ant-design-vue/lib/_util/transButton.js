'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _vueTypes = require('./vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
var inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block'
};

var TransButton = {
  props: {
    noStyle: _vueTypes2['default'].bool
  },

  methods: {
    onKeyDown: function onKeyDown(event) {
      var keyCode = event.keyCode;

      if (keyCode === _KeyCode2['default'].ENTER) {
        event.preventDefault();
      }
    },
    onKeyUp: function onKeyUp(event) {
      var keyCode = event.keyCode;

      if (keyCode === _KeyCode2['default'].ENTER) {
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
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          role: 'button',
          tabIndex: 0
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.setRef
        }],
        on: (0, _extends3['default'])({}, this.$listeners, {
          keydown: this.onKeyDown,
          keyup: this.onKeyUp
        })
      }, {
        style: (0, _extends3['default'])({}, !noStyle ? inlineStyle : null)
      }]),
      [this.$slots['default']]
    );
  }
};

exports['default'] = TransButton;