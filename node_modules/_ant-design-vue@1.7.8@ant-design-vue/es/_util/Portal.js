import PropTypes from './vue-types';
import { cloneElement } from './vnode';

export default {
  name: 'Portal',
  props: {
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    didUpdate: PropTypes.func
  },
  mounted: function mounted() {
    this.createContainer();
  },
  updated: function updated() {
    var _this = this;

    var didUpdate = this.$props.didUpdate;

    if (didUpdate) {
      this.$nextTick(function () {
        didUpdate(_this.$props);
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.removeContainer();
  },

  methods: {
    createContainer: function createContainer() {
      this._container = this.$props.getContainer();
      this.$forceUpdate();
    },
    removeContainer: function removeContainer() {
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
    }
  },

  render: function render() {
    if (this._container) {
      return cloneElement(this.$props.children, {
        directives: [{
          name: 'ant-portal',
          value: this._container
        }]
      });
    }
    return null;
  }
};