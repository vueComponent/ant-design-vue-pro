'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTrigger = require('../../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _util = require('./util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
    disabled: _vueTypes2['default'].bool,
    showSearch: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string,
    dropdownPopupAlign: _vueTypes2['default'].object,
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].object,
    transitionName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func,

    dropdownMatchSelectWidth: _vueTypes2['default'].bool,

    // Pass by Select
    isMultiple: _vueTypes2['default'].bool,
    dropdownPrefixCls: _vueTypes2['default'].string,
    dropdownVisibleChange: _vueTypes2['default'].func,
    popupElement: _vueTypes2['default'].node,
    open: _vueTypes2['default'].bool
  },
  created: function created() {
    this.triggerRef = (0, _util.createRef)();
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
      _vcTrigger2['default'],
      (0, _babelHelperVueJsxMergeProps2['default'])([{
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
          popupClassName: (0, _classnames2['default'])(dropdownClassName, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, dropdownPrefixCls + '--multiple', isMultiple), (0, _defineProperty3['default'])(_classNames, dropdownPrefixCls + '--single', !isMultiple), _classNames)),
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

exports['default'] = SelectTrigger;