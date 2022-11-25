'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('./vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('./vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Portal',
  props: {
    getContainer: _vueTypes2['default'].func.isRequired,
    children: _vueTypes2['default'].any.isRequired,
    didUpdate: _vueTypes2['default'].func
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
      return (0, _vnode.cloneElement)(this.$props.children, {
        directives: [{
          name: 'ant-portal',
          value: this._container
        }]
      });
    }
    return null;
  }
};