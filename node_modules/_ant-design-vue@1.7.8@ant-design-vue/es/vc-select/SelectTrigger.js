import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classnames from 'classnames';
import raf from 'raf';
import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import DropdownMenu from './DropdownMenu';
import { isSingleMode, saveRef } from './util';
import BaseMixin from '../_util/BaseMixin';
import { getListeners } from '../_util/props-util';

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

export default {
  name: 'SelectTrigger',
  mixins: [BaseMixin],
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: PropTypes.bool,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    empty: PropTypes.bool,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    value: PropTypes.array,
    // children: PropTypes.any,
    showAction: PropTypes.arrayOf(PropTypes.string),
    combobox: PropTypes.bool,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    backfillValue: PropTypes.any,
    menuItemSelectedIcon: PropTypes.any,
    dropdownRender: PropTypes.func,
    ariaId: PropTypes.string
  },
  data: function data() {
    return {
      dropdownWidth: 0
    };
  },
  created: function created() {
    this.rafInstance = null;
    this.saveDropdownMenuRef = saveRef(this, 'dropdownMenuRef');
    this.saveTriggerRef = saveRef(this, 'triggerRef');
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setDropdownWidth();
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setDropdownWidth();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.cancelRafInstance();
  },

  methods: {
    setDropdownWidth: function setDropdownWidth() {
      var _this3 = this;

      this.cancelRafInstance();
      this.rafInstance = raf(function () {
        var width = _this3.$el.offsetWidth;
        if (width !== _this3.dropdownWidth) {
          _this3.setState({ dropdownWidth: width });
        }
      });
    },
    cancelRafInstance: function cancelRafInstance() {
      if (this.rafInstance) {
        raf.cancel(this.rafInstance);
      }
    },
    getInnerMenu: function getInnerMenu() {
      return this.dropdownMenuRef && this.dropdownMenuRef.$refs.menuRef;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      return this.triggerRef.getPopupDomNode();
    },
    getDropdownElement: function getDropdownElement(newProps) {
      var h = this.$createElement;
      var value = this.value,
          firstActiveValue = this.firstActiveValue,
          defaultActiveFirstOption = this.defaultActiveFirstOption,
          dropdownMenuStyle = this.dropdownMenuStyle,
          getDropdownPrefixCls = this.getDropdownPrefixCls,
          backfillValue = this.backfillValue,
          menuItemSelectedIcon = this.menuItemSelectedIcon;

      var _getListeners = getListeners(this),
          menuSelect = _getListeners.menuSelect,
          menuDeselect = _getListeners.menuDeselect,
          popupScroll = _getListeners.popupScroll;

      var props = this.$props;

      var dropdownRender = props.dropdownRender,
          ariaId = props.ariaId;

      var dropdownMenuProps = {
        props: _extends({}, newProps.props, {
          ariaId: ariaId,
          prefixCls: getDropdownPrefixCls(),
          value: value,
          firstActiveValue: firstActiveValue,
          defaultActiveFirstOption: defaultActiveFirstOption,
          dropdownMenuStyle: dropdownMenuStyle,
          backfillValue: backfillValue,
          menuItemSelectedIcon: menuItemSelectedIcon
        }),
        on: _extends({}, newProps.on, {
          menuSelect: menuSelect,
          menuDeselect: menuDeselect,
          popupScroll: popupScroll
        }),
        directives: [{
          name: 'ant-ref',
          value: this.saveDropdownMenuRef
        }]
      };
      var menuNode = h(DropdownMenu, dropdownMenuProps);

      if (dropdownRender) {
        return dropdownRender(menuNode, props);
      }
      return null;
    },
    getDropdownTransitionName: function getDropdownTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = this.getDropdownPrefixCls() + '-' + props.animation;
      }
      return transitionName;
    },
    getDropdownPrefixCls: function getDropdownPrefixCls() {
      return this.prefixCls + '-dropdown';
    }
  },

  render: function render() {
    var _popupClassName;

    var h = arguments[0];
    var $props = this.$props,
        $slots = this.$slots;
    var multiple = $props.multiple,
        visible = $props.visible,
        inputValue = $props.inputValue,
        dropdownAlign = $props.dropdownAlign,
        disabled = $props.disabled,
        showSearch = $props.showSearch,
        dropdownClassName = $props.dropdownClassName,
        dropdownStyle = $props.dropdownStyle,
        dropdownMatchSelectWidth = $props.dropdownMatchSelectWidth,
        options = $props.options,
        getPopupContainer = $props.getPopupContainer,
        showAction = $props.showAction,
        empty = $props.empty;

    var _getListeners2 = getListeners(this),
        mouseenter = _getListeners2.mouseenter,
        mouseleave = _getListeners2.mouseleave,
        popupFocus = _getListeners2.popupFocus,
        dropdownVisibleChange = _getListeners2.dropdownVisibleChange;

    var dropdownPrefixCls = this.getDropdownPrefixCls();
    var popupClassName = (_popupClassName = {}, _defineProperty(_popupClassName, dropdownClassName, !!dropdownClassName), _defineProperty(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _defineProperty(_popupClassName, dropdownPrefixCls + '--empty', empty), _popupClassName);
    var popupElement = this.getDropdownElement({
      props: {
        menuItems: options,
        multiple: multiple,
        inputValue: inputValue,
        visible: visible
      },
      on: {
        popupFocus: popupFocus
      }
    });
    var hideAction = void 0;
    if (disabled) {
      hideAction = [];
    } else if (isSingleMode($props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    var popupStyle = _extends({}, dropdownStyle);
    var widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = this.dropdownWidth + 'px';
    }
    var triggerProps = {
      props: _extends({}, $props, {
        showAction: disabled ? [] : showAction,
        hideAction: hideAction,
        ref: 'triggerRef',
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        popupAlign: dropdownAlign,
        popupVisible: visible,
        getPopupContainer: getPopupContainer,
        popupClassName: classnames(popupClassName),
        popupStyle: popupStyle
      }),
      on: {
        popupVisibleChange: dropdownVisibleChange
      },
      directives: [{
        name: 'ant-ref',
        value: this.saveTriggerRef
      }]
    };
    if (mouseenter) {
      triggerProps.on.mouseenter = mouseenter;
    }
    if (mouseleave) {
      triggerProps.on.mouseleave = mouseleave;
    }
    return h(
      Trigger,
      triggerProps,
      [$slots['default'], h(
        'template',
        { slot: 'popup' },
        [popupElement]
      )]
    );
  }
};