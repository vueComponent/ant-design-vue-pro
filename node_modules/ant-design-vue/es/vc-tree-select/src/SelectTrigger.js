import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../_util/vue-types';

import Trigger from '../../vc-trigger';
import { createRef } from './util';
import classNames from 'classnames';

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    },
    ignoreShake: true
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    },
    ignoreShake: true
  }
};

var SelectTrigger = {
  name: 'SelectTrigger',
  props: {
    // Pass by outside user props
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    prefixCls: PropTypes.string,
    dropdownPopupAlign: PropTypes.object,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    transitionName: PropTypes.string,
    animation: PropTypes.string,
    getPopupContainer: PropTypes.func,

    dropdownMatchSelectWidth: PropTypes.bool,

    // Pass by Select
    isMultiple: PropTypes.bool,
    dropdownPrefixCls: PropTypes.string,
    dropdownVisibleChange: PropTypes.func,
    popupElement: PropTypes.node,
    open: PropTypes.bool
  },
  created: function created() {
    this.triggerRef = createRef();
  },

  methods: {
    getDropdownTransitionName: function getDropdownTransitionName() {
      var _$props = this.$props,
          transitionName = _$props.transitionName,
          animation = _$props.animation,
          dropdownPrefixCls = _$props.dropdownPrefixCls;

      if (!transitionName && animation) {
        return dropdownPrefixCls + '-' + animation;
      }
      return transitionName;
    },
    forcePopupAlign: function forcePopupAlign() {
      var $trigger = this.triggerRef.current;
      if ($trigger) {
        $trigger.forcePopupAlign();
      }
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var _$props2 = this.$props,
        disabled = _$props2.disabled,
        isMultiple = _$props2.isMultiple,
        dropdownPopupAlign = _$props2.dropdownPopupAlign,
        dropdownMatchSelectWidth = _$props2.dropdownMatchSelectWidth,
        dropdownClassName = _$props2.dropdownClassName,
        dropdownStyle = _$props2.dropdownStyle,
        dropdownVisibleChange = _$props2.dropdownVisibleChange,
        getPopupContainer = _$props2.getPopupContainer,
        dropdownPrefixCls = _$props2.dropdownPrefixCls,
        popupElement = _$props2.popupElement,
        open = _$props2.open;

    // TODO: [Legacy] Use new action when trigger fixed: https://github.com/react-component/trigger/pull/86

    // When false do nothing with the width
    // ref: https://github.com/ant-design/ant-design/issues/10927

    var stretch = void 0;
    if (dropdownMatchSelectWidth !== false) {
      stretch = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    }
    return h(
      Trigger,
      _mergeJSXProps([{
        directives: [{
          name: 'ant-ref',
          value: this.triggerRef
        }]
      }, {
        attrs: {
          action: disabled ? [] : ['click'],
          popupPlacement: 'bottomLeft',
          builtinPlacements: BUILT_IN_PLACEMENTS,
          popupAlign: dropdownPopupAlign,
          prefixCls: dropdownPrefixCls,
          popupTransitionName: this.getDropdownTransitionName(),

          popup: popupElement,
          popupVisible: open,
          getPopupContainer: getPopupContainer,
          stretch: stretch,
          popupClassName: classNames(dropdownClassName, (_classNames = {}, _defineProperty(_classNames, dropdownPrefixCls + '--multiple', isMultiple), _defineProperty(_classNames, dropdownPrefixCls + '--single', !isMultiple), _classNames)),
          popupStyle: dropdownStyle
        },
        on: {
          'popupVisibleChange': dropdownVisibleChange
        }
      }]),
      [this.$slots['default']]
    );
  }
};

export default SelectTrigger;