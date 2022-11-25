import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from './vue-types';
import { getOptionProps, getListeners } from './props-util';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}
export default function wrapWithConnect(WrappedComponent) {
  var tempProps = WrappedComponent.props || {};
  var methods = WrappedComponent.methods || {};
  var props = {};
  Object.keys(tempProps).forEach(function (k) {
    props[k] = _extends({}, tempProps[k], { required: false });
  });
  WrappedComponent.props.__propsSymbol__ = PropTypes.any;
  WrappedComponent.props.children = PropTypes.array.def([]);
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

      var props = getOptionProps(this);
      var wrapProps = {
        props: _extends({}, props, {
          __propsSymbol__: Symbol(),
          componentWillReceiveProps: _extends({}, props),
          children: $slots['default'] || props.children || []
        }),
        on: getListeners(this)
      };
      if (Object.keys($scopedSlots).length) {
        wrapProps.scopedSlots = $scopedSlots;
      }
      var slotsKey = Object.keys($slots);
      return h(
        WrappedComponent,
        _mergeJSXProps([wrapProps, { ref: 'wrappedInstance' }]),
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