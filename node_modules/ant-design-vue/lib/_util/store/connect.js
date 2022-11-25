'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = connect;

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _propsUtil = require('../props-util');

var _vueTypes = require('../vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _proxyComponent = require('../proxyComponent');

var _proxyComponent2 = _interopRequireDefault(_proxyComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

var defaultMapStateToProps = function defaultMapStateToProps() {
  return {};
};
function connect(mapStateToProps) {
  var shouldSubscribe = !!mapStateToProps;
  var finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    var tempProps = (0, _omit2['default'])(WrappedComponent.props || {}, ['store']);
    var props = {
      __propsSymbol__: _vueTypes2['default'].any
    };
    Object.keys(tempProps).forEach(function (k) {
      props[k] = (0, _extends3['default'])({}, tempProps[k], { required: false });
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
        this.preProps = (0, _omit2['default'])((0, _propsUtil.getOptionProps)(this), ['__propsSymbol__']);
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
          var props = (0, _omit2['default'])((0, _propsUtil.getOptionProps)(this), ['__propsSymbol__']);
          var nextSubscribed = finalMapStateToProps(this.store.getState(), props);
          if (!(0, _shallowequal2['default'])(this.preProps, props) || !(0, _shallowequal2['default'])(this.subscribed, nextSubscribed)) {
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

        var props = (0, _propsUtil.getOptionProps)(this);
        this.preProps = (0, _extends3['default'])({}, (0, _omit2['default'])(props, ['__propsSymbol__']));
        var wrapProps = {
          props: (0, _extends3['default'])({}, props, subscribed, {
            store: store
          }),
          on: (0, _propsUtil.getListeners)(this),
          scopedSlots: $scopedSlots
        };
        return h(
          WrappedComponent,
          (0, _babelHelperVueJsxMergeProps2['default'])([wrapProps, { ref: 'wrappedInstance' }]),
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
    return (0, _proxyComponent2['default'])(Connect);
  };
}