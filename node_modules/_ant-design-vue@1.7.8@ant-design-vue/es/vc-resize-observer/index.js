// based on rc-resize-observer 0.1.3
import ResizeObserver from 'resize-observer-polyfill';

// Still need to be compatible with React 15, we use class component here
var VueResizeObserver = {
  name: 'ResizeObserver',
  props: {
    disabled: Boolean
  },
  data: function data() {
    this.currentElement = null;
    this.resizeObserver = null;
    return {
      width: 0,
      height: 0
    };
  },
  mounted: function mounted() {
    this.onComponentUpdated();
  },
  updated: function updated() {
    this.onComponentUpdated();
  },
  beforeDestroy: function beforeDestroy() {
    this.destroyObserver();
  },

  methods: {
    onComponentUpdated: function onComponentUpdated() {
      var disabled = this.$props.disabled;

      // Unregister if disabled

      if (disabled) {
        this.destroyObserver();
        return;
      }

      // Unregister if element changed
      var element = this.$el;
      var elementChanged = element !== this.currentElement;
      if (elementChanged) {
        this.destroyObserver();
        this.currentElement = element;
      }

      if (!this.resizeObserver && element) {
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(element);
      }
    },
    onResize: function onResize(entries) {
      var target = entries[0].target;

      var _target$getBoundingCl = target.getBoundingClientRect(),
          width = _target$getBoundingCl.width,
          height = _target$getBoundingCl.height;
      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about element size,
       * let's use `boundary` instead of `contentRect` here to avoid shaking.
       */


      var fixedWidth = Math.floor(width);
      var fixedHeight = Math.floor(height);

      if (this.width !== fixedWidth || this.height !== fixedHeight) {
        var size = { width: fixedWidth, height: fixedHeight };
        this.width = fixedWidth;
        this.height = fixedHeight;
        this.$emit('resize', size);
      }
    },
    destroyObserver: function destroyObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    }
  },

  render: function render() {
    return this.$slots['default'][0];
  }
};

export default VueResizeObserver;