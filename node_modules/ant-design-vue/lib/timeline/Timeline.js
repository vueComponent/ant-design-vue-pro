'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _TimelineItem = require('./TimelineItem');

var _TimelineItem2 = _interopRequireDefault(_TimelineItem);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TimelineProps = exports.TimelineProps = {
  prefixCls: _vueTypes2['default'].string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: _vueTypes2['default'].any,
  pendingDot: _vueTypes2['default'].string,
  reverse: _vueTypes2['default'].bool,
  mode: _vueTypes2['default'].oneOf(['left', 'alternate', 'right', ''])
};

exports['default'] = {
  name: 'ATimeline',
  props: (0, _propsUtil.initDefaultProps)(TimelineProps, {
    reverse: false,
    mode: ''
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        reverse = _getOptionProps.reverse,
        mode = _getOptionProps.mode,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'reverse', 'mode']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('timeline', customizePrefixCls);

    var pendingDot = (0, _propsUtil.getComponentFromProp)(this, 'pendingDot');
    var pending = (0, _propsUtil.getComponentFromProp)(this, 'pending');
    var pendingNode = typeof pending === 'boolean' ? null : pending;
    var classString = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-pending', !!pending), (0, _defineProperty3['default'])(_classNames, prefixCls + '-reverse', !!reverse), (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + mode, !!mode), _classNames));
    var children = (0, _propsUtil.filterEmpty)(this.$slots['default']);
    // // Remove falsy items
    // const falsylessItems = filterEmpty(this.$slots.default)
    // const items = falsylessItems.map((item, idx) => {
    //   return cloneElement(item, {
    //     props: {
    //       last: falsylessItems.length - 1 === idx,
    //     },
    //   })
    // })
    var pendingItem = pending ? h(
      _TimelineItem2['default'],
      {
        attrs: { pending: !!pending }
      },
      [h(
        'template',
        { slot: 'dot' },
        [pendingDot || h(_icon2['default'], {
          attrs: { type: 'loading' }
        })]
      ), pendingNode]
    ) : null;

    var timeLineItems = reverse ? [pendingItem].concat((0, _toConsumableArray3['default'])(children.reverse())) : [].concat((0, _toConsumableArray3['default'])(children), [pendingItem]);

    var getPositionCls = function getPositionCls(ele, idx) {
      var eleProps = (0, _propsUtil.getPropsData)(ele);
      if (mode === 'alternate') {
        if (eleProps.position === 'right') return prefixCls + '-item-right';
        if (eleProps.position === 'left') return prefixCls + '-item-left';
        return idx % 2 === 0 ? prefixCls + '-item-left' : prefixCls + '-item-right';
      }
      if (mode === 'left') return prefixCls + '-item-left';
      if (mode === 'right') return prefixCls + '-item-right';
      if (eleProps.position === 'right') return prefixCls + '-item-right';
      return '';
    };

    // Remove falsy items
    var truthyItems = timeLineItems.filter(function (item) {
      return !!item;
    });
    var itemsCount = truthyItems.length;
    var lastCls = prefixCls + '-item-last';
    var items = truthyItems.map(function (ele, idx) {
      var pendingClass = idx === itemsCount - 2 ? lastCls : '';
      var readyClass = idx === itemsCount - 1 ? lastCls : '';
      return (0, _vnode.cloneElement)(ele, {
        'class': (0, _classnames2['default'])([!reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
      });
    });

    var timelineProps = {
      props: (0, _extends3['default'])({}, restProps),
      'class': classString,
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      'ul',
      timelineProps,
      [items]
    );
  }
};