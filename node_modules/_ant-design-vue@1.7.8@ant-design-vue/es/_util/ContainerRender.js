import PropTypes from './vue-types';

export default {
  props: {
    autoMount: PropTypes.bool.def(true),
    autoDestroy: PropTypes.bool.def(true),
    visible: PropTypes.bool,
    forceRender: PropTypes.bool.def(false),
    parent: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  },

  mounted: function mounted() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  updated: function updated() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.autoDestroy) {
      this.removeContainer();
    }
  },

  methods: {
    removeContainer: function removeContainer() {
      if (this.container) {
        this._component && this._component.$destroy();
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this._component = null;
      }
    },
    renderComponent: function renderComponent() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ready = arguments[1];
      var visible = this.visible,
          forceRender = this.forceRender,
          getContainer = this.getContainer,
          parent = this.parent;

      var self = this;
      if (visible || parent._component || parent.$refs._component || forceRender) {
        var el = this.componentEl;
        if (!this.container) {
          this.container = getContainer();
          el = document.createElement('div');
          this.componentEl = el;
          this.container.appendChild(el);
        }
        // self.getComponent 不要放在 render 中，会因为响应式数据问题导致，多次触发 render
        var com = { component: self.getComponent(props) };
        if (!this._component) {
          this._component = new this.$root.constructor({
            el: el,
            parent: self,
            data: {
              _com: com
            },
            mounted: function mounted() {
              this.$nextTick(function () {
                if (ready) {
                  ready.call(self);
                }
              });
            },
            updated: function updated() {
              this.$nextTick(function () {
                if (ready) {
                  ready.call(self);
                }
              });
            },

            methods: {
              setComponent: function setComponent(_com) {
                this.$data._com = _com;
              }
            },
            render: function render() {
              return this.$data._com.component;
            }
          });
        } else {
          this._component.setComponent(com);
        }
      }
    }
  },

  render: function render() {
    return this.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer
    });
  }
};