'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = wrapWithConnect;

var _vueTypes = require('./vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('./props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}
function wrapWithConnect(WrappedComponent) {
  var tempProps = WrappedComponent.props || {};
  var methods = WrappedComponent.methods || {};
  var props = {};
  Object.keys(tempProps).forEach(function (k) {
    props[k] = (0, _extends3['default'])({}, tempProps[k], { required: false });
  });
  WrappedComponent.props.__propsSymbol__ = _vueTypes2['default'].any;
  WrappedComponent.props.children = _vueTypes2['default'].array.def([]);
  var ProxyWrappedComponent = {
    props: props,
    model: WrappedComponent.model,
    name: 'Proxy_' + getDisplayName(WrappedComponent),
    methods: {
      getProxyWrappedInstance: function getProxyWrappedInstance() {
        return this.$refs.wrappedInstance;
      }
    },
    render: function render() {
      var h = arguments[0];
      var _$slots = this.$slots,
          $slots = _$slots === undefined ? {} : _$slots,
          $scopedSlots = this.$scopedSlots;

      var props = (0, _propsUtil.getOptionProps)(this);
      var wrapProps = {
        props: (0, _extends3['default'])({}, props, {
          __propsSymbol__: Symbol(),
          componentWillReceiveProps: (0, _extends3['default'])({}, props),
          children: $slots['default'] || props.children || []
        }),
        on: (0, _propsUtil.getListeners)(this)
      };
      if (Object.keys($scopedSlots).length) {
        wrapProps.scopedSlots = $scopedSlots;
      }
      var slotsKey = Object.keys($slots);
      return h(
        WrappedComponent,
        (0, _babelHelperVueJsxMergeProps2['default'])([wrapProps, { ref: 'wrappedInstance' }]),
        [slotsKey.length ? slotsKey.map(function (name) {
          return h(
            'template',
            { slot: name },
            [$slots[name]]
          );
        }) : null]
      );
    }
  };
  Object.keys(methods).map(function (m) {
    ProxyWrappedComponent.methods[m] = function () {
      var _getProxyWrappedInsta;

      return (_getProxyWrappedInsta = this.getProxyWrappedInstance())[m].apply(_getProxyWrappedInsta, arguments);
    };
  });
  return ProxyWrappedComponent;
}