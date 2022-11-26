import copy from 'copy-to-clipboard';

const CopyToClipboardProps = {
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

const CopyToClipboard = {
  name: 'VueCopyToClipboard',
  functional: true,
  props: CopyToClipboardProps,
  render (h, ctx) {
    const { props, listeners: { copy: onCopy }, children } = ctx
    const { text, options } = props || {}

    function handleClick(e) {
      // Bypass onClick if it was present
      e.preventDefault()
      e.stopPropagation()

      const result = copy(text, options)

      if (onCopy) {
        onCopy(text, result)
      }
    }

    return h('span', { on: { 'click': handleClick }}, children);
  }
};

/* istanbul ignore next */
CopyToClipboard.install = function (Vue) {
  Vue.component(CopyToClipboard.name, CopyToClipboard)
};

export default CopyToClipboard;
