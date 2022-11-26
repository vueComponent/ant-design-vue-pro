'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _copyToClipboard = require('copy-to-clipboard');

var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyToClipboardProps = {
  text: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    'default': function _default() {
      return null;
    }
  }
};

var CopyToClipboard = {
  name: 'VueCopyToClipboard',
  functional: true,
  props: CopyToClipboardProps,
  render: function render(h, ctx) {
    var props = ctx.props,
        onCopy = ctx.listeners.copy,
        children = ctx.children;

    var _ref = props || {},
        text = _ref.text,
        options = _ref.options;

    function handleClick(e) {
      // Bypass onClick if it was present
      e.preventDefault();
      e.stopPropagation();

      var result = (0, _copyToClipboard2.default)(text, options);

      if (onCopy) {
        onCopy(text, result);
      }
    }

    return h('span', { on: { 'click': handleClick } }, children);
  }
};

/* istanbul ignore next */
CopyToClipboard.install = function (Vue) {
  Vue.component(CopyToClipboard.name, CopyToClipboard);
};

exports.default = CopyToClipboard;
