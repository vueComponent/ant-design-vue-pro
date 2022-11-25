import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import shallowEqual from 'shallowequal';
import omit from 'omit.js';
import { getOptionProps, getListeners } from '../props-util';
import PropTypes from '../vue-types';
import proxyComponent from '../proxyComponent';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

var defaultMapStateToProps = function defaultMapStateToProps() {
  return {};
};
export default function connect(mapStateToProps) {
  var shouldSubscribe = !!mapStateToProps;
  var finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    var tempProps = omit(WrappedComponent.props || {}, ['store']);
    var props = {
      __propsSymbol__: PropTypes.any
    };
    Object.keys(tempProps).forEach(function (k) {
      props[k] = _extends({}, tempProps[k], { required: false });
    });
    var Connect = {
      name: 'Connect_' + getDisplayName(WrappedComponent),
      props: props,
      inject: {
        storeContext: { 'default': function _default() {
            return {};
          } }
      },
      data: function data() {
        this.store = this.storeContext.store;
        this.preProps = omit(getOptionProps(this), ['__propsSymbol__']);
        return {
          subscribed: finalMapStateToProps(this.store.getState(), this.$props)
        };
      },

      watch: {
        __propsSymbol__: function __propsSymbol__() {
          if (mapStateToProps && mapStateToProps.length === 2) {
            this.subscribed = finalMapStateToProps(this.store.getState(), this.$props);
          }
        }
      },
      mounted: function mounted() {
        this.trySubscribe();
      },
      beforeDestroy: function beforeDestroy() {
        this.tryUnsubscribe();
      },

      methods: {
        handleChange: function handleChange() {
          if (!this.unsubscribe) {
            return;
          }
          var props = omit(getOptionProps(this), ['__propsSymbol__']);
          var nextSubscribed = finalMapStateToProps(this.store.getState(), props);
          if (!shallowEqual(this.preProps, props) || !shallowEqual(this.subscribed, nextSubscribed)) {
            this.subscribed = nextSubscribed;
          }
        },
        trySubscribe: function trySubscribe() {
          if (shouldSubscribe) {
            this.unsubscribe = this.store.subscribe(this.handleChange);
            this.handleChange();
          }
        },
        tryUnsubscribe: function tryUnsubscribe() {
          if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
          }
        },
        getWrappedInstance: function getWrappedInstance() {
          return this.$refs.wrappedInstance;
        }
      },
      render: function render() {
        var h = arguments[0];
        var _$slots = this.$slots,
            $slots = _$slots === undefined ? {} : _$slots,
            $scopedSlots = this.$scopedSlots,
            subscribed = this.subscribed,
            store = this.store;

        var props = getOptionProps(this);
        this.preProps = _extends({}, omit(props, ['__propsSymbol__']));
        var wrapProps = {
          props: _extends({}, props, subscribed, {
            store: store
          }),
          on: getListeners(this),
          scopedSlots: $scopedSlots
        };
        return h(
          WrappedComponent,
          _mergeJSXProps([wrapProps, { ref: 'wrappedInstance' }]),
          [Object.keys($slots).map(function (name) {
            return h(
              'template',
              { slot: name },
              [$slots[name]]
            );
          })]
        );
      }
    };
    return proxyComponent(Connect);
  };
}