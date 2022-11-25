import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getPropsData, initDefaultProps, filterEmpty, getComponentFromProp, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import TimelineItem from './TimelineItem';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var TimelineProps = {
  prefixCls: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.string,
  reverse: PropTypes.bool,
  mode: PropTypes.oneOf(['left', 'alternate', 'right', ''])
};

export default {
  name: 'ATimeline',
  props: initDefaultProps(TimelineProps, {
    reverse: false,
    mode: ''
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        reverse = _getOptionProps.reverse,
        mode = _getOptionProps.mode,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'reverse', 'mode']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('timeline', customizePrefixCls);

    var pendingDot = getComponentFromProp(this, 'pendingDot');
    var pending = getComponentFromProp(this, 'pending');
    var pendingNode = typeof pending === 'boolean' ? null : pending;
    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-pending', !!pending), _defineProperty(_classNames, prefixCls + '-reverse', !!reverse), _defineProperty(_classNames, prefixCls + '-' + mode, !!mode), _classNames));
    var children = filterEmpty(this.$slots['default']);
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
      TimelineItem,
      {
        attrs: { pending: !!pending }
      },
      [h(
        'template',
        { slot: 'dot' },
        [pendingDot || h(Icon, {
          attrs: { type: 'loading' }
        })]
      ), pendingNode]
    ) : null;

    var timeLineItems = reverse ? [pendingItem].concat(_toConsumableArray(children.reverse())) : [].concat(_toConsumableArray(children), [pendingItem]);

    var getPositionCls = function getPositionCls(ele, idx) {
      var eleProps = getPropsData(ele);
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
      return cloneElement(ele, {
        'class': classNames([!reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
      });
    });

    var timelineProps = {
      props: _extends({}, restProps),
      'class': classString,
      on: getListeners(this)
    };
    return h(
      'ul',
      timelineProps,
      [items]
    );
  }
};