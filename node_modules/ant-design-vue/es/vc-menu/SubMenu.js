import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import KeyCode from '../_util/KeyCode';
import { connect } from '../_util/store';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import BaseMixin from '../_util/BaseMixin';
import { getComponentFromProp, filterEmpty, getListeners } from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';
import { noop, loopMenuItemRecursively, getMenuIdFromSubMenuEventKey } from './util';
import getTransitionProps from '../_util/getTransitionProps';

var guid = 0;

var popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};

var updateDefaultActiveFirst = function updateDefaultActiveFirst(store, eventKey, defaultActiveFirst) {
  var menuId = getMenuIdFromSubMenuEventKey(eventKey);
  var state = store.getState();
  store.setState({
    defaultActiveFirst: _extends({}, state.defaultActiveFirst, _defineProperty({}, menuId, defaultActiveFirst))
  });
};

var SubMenu = {
  name: 'SubMenu',
  props: {
    parentMenu: PropTypes.object,
    title: PropTypes.any,
    selectedKeys: PropTypes.array.def([]),
    openKeys: PropTypes.array.def([]),
    openChange: PropTypes.func.def(noop),
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    isRootMenu: PropTypes.bool.def(false),
    index: PropTypes.number,
    triggerSubMenuAction: PropTypes.string,
    popupClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    forceSubMenuRender: PropTypes.bool,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    subMenuOpenDelay: PropTypes.number.def(0.1),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    level: PropTypes.number.def(1),
    inlineIndent: PropTypes.number.def(24),
    openTransitionName: PropTypes.string,
    popupOffset: PropTypes.array,
    isOpen: PropTypes.bool,
    store: PropTypes.object,
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    manualRef: PropTypes.func.def(noop),
    builtinPlacements: PropTypes.object.def(function () {
      return {};
    }),
    itemIcon: PropTypes.any,
    expandIcon: PropTypes.any,
    subMenuKey: PropTypes.string
  },
  mixins: [BaseMixin],
  isSubMenu: true,
  data: function data() {
    var props = this.$props;
    var store = props.store;
    var eventKey = props.eventKey;
    var defaultActiveFirst = store.getState().defaultActiveFirst;
    var value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);
    return {
      // defaultActiveFirst: false,
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.handleUpdated();
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.handleUpdated();
    });
  },
  beforeDestroy: function beforeDestroy() {
    var eventKey = this.eventKey;

    this.__emit('destroy', eventKey);

    /* istanbul ignore if */
    if (this.minWidthTimeout) {
      cancelAnimationTimeout(this.minWidthTimeout);
      this.minWidthTimeout = null;
    }

    /* istanbul ignore if */
    if (this.mouseenterTimeout) {
      cancelAnimationTimeout(this.mouseenterTimeout);
      this.mouseenterTimeout = null;
    }
  },

  methods: {
    handleUpdated: function handleUpdated() {
      var _this3 = this;

      var _$props = this.$props,
          mode = _$props.mode,
          parentMenu = _$props.parentMenu,
          manualRef = _$props.manualRef;

      // invoke customized ref to expose component to mixin

      if (manualRef) {
        manualRef(this);
      }

      if (mode !== 'horizontal' || !parentMenu.isRootMenu || !this.isOpen) {
        return;
      }

      this.minWidthTimeout = requestAnimationTimeout(function () {
        return _this3.adjustWidth();
      }, 0);
    },
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      var menu = this.menuInstance;
      var _$props2 = this.$props,
          store = _$props2.store,
          isOpen = _$props2.isOpen;


      if (keyCode === KeyCode.ENTER) {
        this.onTitleClick(e);
        updateDefaultActiveFirst(store, this.eventKey, true);
        return true;
      }

      if (keyCode === KeyCode.RIGHT) {
        if (isOpen) {
          menu.onKeyDown(e);
        } else {
          this.triggerOpenChange(true);
          // need to update current menu's defaultActiveFirst value
          updateDefaultActiveFirst(store, this.eventKey, true);
        }
        return true;
      }
      if (keyCode === KeyCode.LEFT) {
        var handled = void 0;
        if (isOpen) {
          handled = menu.onKeyDown(e);
        } else {
          return undefined;
        }
        if (!handled) {
          this.triggerOpenChange(false);
          handled = true;
        }
        return handled;
      }

      if (isOpen && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
        return menu.onKeyDown(e);
      }
      return undefined;
    },
    onPopupVisibleChange: function onPopupVisibleChange(visible) {
      this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
    },
    onMouseEnter: function onMouseEnter(e) {
      var _$props3 = this.$props,
          key = _$props3.eventKey,
          store = _$props3.store;

      updateDefaultActiveFirst(store, key, false);
      this.__emit('mouseenter', {
        key: key,
        domEvent: e
      });
    },
    onMouseLeave: function onMouseLeave(e) {
      var eventKey = this.eventKey,
          parentMenu = this.parentMenu;

      parentMenu.subMenuInstance = this;
      // parentMenu.subMenuLeaveFn = () => {
      // // trigger mouseleave
      //   this.__emit('mouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e
      });
      // prevent popup menu and submenu gap
      // parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100)
    },
    onTitleMouseEnter: function onTitleMouseEnter(domEvent) {
      var key = this.$props.eventKey;
      // this.clearSubMenuTitleLeaveTimer()

      this.__emit('itemHover', {
        key: key,
        hover: true
      });
      this.__emit('titleMouseenter', {
        key: key,
        domEvent: domEvent
      });
    },
    onTitleMouseLeave: function onTitleMouseLeave(e) {
      var eventKey = this.eventKey,
          parentMenu = this.parentMenu;

      parentMenu.subMenuInstance = this;
      this.__emit('itemHover', {
        key: eventKey,
        hover: false
      });
      this.__emit('titleMouseleave', {
        key: eventKey,
        domEvent: e
      });
    },
    onTitleClick: function onTitleClick(e) {
      var _$props4 = this.$props,
          triggerSubMenuAction = _$props4.triggerSubMenuAction,
          eventKey = _$props4.eventKey,
          isOpen = _$props4.isOpen,
          store = _$props4.store;

      this.__emit('titleClick', {
        key: eventKey,
        domEvent: e
      });
      if (triggerSubMenuAction === 'hover') {
        return;
      }
      this.triggerOpenChange(!isOpen, 'click');
      updateDefaultActiveFirst(store, eventKey, false);
    },
    onSubMenuClick: function onSubMenuClick(info) {
      this.__emit('click', this.addKeyPath(info));
    },
    getPrefixCls: function getPrefixCls() {
      return this.$props.rootPrefixCls + '-submenu';
    },
    getActiveClassName: function getActiveClassName() {
      return this.getPrefixCls() + '-active';
    },
    getDisabledClassName: function getDisabledClassName() {
      return this.getPrefixCls() + '-disabled';
    },
    getSelectedClassName: function getSelectedClassName() {
      return this.getPrefixCls() + '-selected';
    },
    getOpenClassName: function getOpenClassName() {
      return this.$props.rootPrefixCls + '-submenu-open';
    },
    saveMenuInstance: function saveMenuInstance(c) {
      // children menu instance
      this.menuInstance = c;
    },
    addKeyPath: function addKeyPath(info) {
      return _extends({}, info, {
        keyPath: (info.keyPath || []).concat(this.$props.eventKey)
      });
    },


    // triggerOpenChange (open, type) {
    //   const key = this.$props.eventKey
    //   this.__emit('openChange', {
    //     key,
    //     item: this,
    //     trigger: type,
    //     open,
    //   })
    // },
    triggerOpenChange: function triggerOpenChange(open, type) {
      var _this4 = this;

      var key = this.$props.eventKey;
      var openChange = function openChange() {
        _this4.__emit('openChange', {
          key: key,
          item: _this4,
          trigger: type,
          open: open
        });
      };
      if (type === 'mouseenter') {
        // make sure mouseenter happen after other menu item's mouseleave
        this.mouseenterTimeout = requestAnimationTimeout(function () {
          openChange();
        }, 0);
      } else {
        openChange();
      }
    },
    isChildrenSelected: function isChildrenSelected() {
      var ret = { find: false };
      loopMenuItemRecursively(this.$slots['default'], this.$props.selectedKeys, ret);
      return ret.find;
    },

    // isOpen () {
    //   return this.$props.openKeys.indexOf(this.$props.eventKey) !== -1
    // },

    adjustWidth: function adjustWidth() {
      /* istanbul ignore if */
      if (!this.$refs.subMenuTitle || !this.menuInstance) {
        return;
      }
      var popupMenu = this.menuInstance.$el;
      if (popupMenu.offsetWidth >= this.$refs.subMenuTitle.offsetWidth) {
        return;
      }

      /* istanbul ignore next */
      popupMenu.style.minWidth = this.$refs.subMenuTitle.offsetWidth + 'px';
    },
    renderChildren: function renderChildren(children) {
      var h = this.$createElement;

      var props = this.$props;

      var _getListeners = getListeners(this),
          select = _getListeners.select,
          deselect = _getListeners.deselect,
          openChange = _getListeners.openChange;

      var subPopupMenuProps = {
        props: {
          mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
          visible: props.isOpen,
          level: props.level + 1,
          inlineIndent: props.inlineIndent,
          focusable: false,
          selectedKeys: props.selectedKeys,
          eventKey: props.eventKey + '-menu-',
          openKeys: props.openKeys,
          openTransitionName: props.openTransitionName,
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          parentMenu: this,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender,
          triggerSubMenuAction: props.triggerSubMenuAction,
          builtinPlacements: props.builtinPlacements,
          defaultActiveFirst: props.store.getState().defaultActiveFirst[getMenuIdFromSubMenuEventKey(props.eventKey)],
          multiple: props.multiple,
          prefixCls: props.rootPrefixCls,
          manualRef: this.saveMenuInstance,
          itemIcon: getComponentFromProp(this, 'itemIcon'),
          expandIcon: getComponentFromProp(this, 'expandIcon'),
          children: children
        },
        on: {
          click: this.onSubMenuClick,
          select: select,
          deselect: deselect,
          openChange: openChange
        },
        id: this.internalMenuId
      };
      var baseProps = subPopupMenuProps.props;
      var haveRendered = this.haveRendered;
      this.haveRendered = true;

      this.haveOpened = this.haveOpened || baseProps.visible || baseProps.forceSubMenuRender;
      // never rendered not planning to, don't render
      if (!this.haveOpened) {
        return h('div');
      }

      // don't show transition on first rendering (no animation for opened menu)
      // show appear transition if it's not visible (not sure why)
      // show appear transition if it's not inline mode
      var transitionAppear = haveRendered || !baseProps.visible || !baseProps.mode === 'inline';
      subPopupMenuProps['class'] = ' ' + baseProps.prefixCls + '-sub';
      var animProps = { appear: transitionAppear, css: false };
      var transitionProps = {
        props: animProps,
        on: {}
      };
      if (baseProps.openTransitionName) {
        transitionProps = getTransitionProps(baseProps.openTransitionName, {
          appear: transitionAppear
        });
      } else if (_typeof(baseProps.openAnimation) === 'object') {
        animProps = _extends({}, animProps, baseProps.openAnimation.props || {});
        if (!transitionAppear) {
          animProps.appear = false;
        }
      } else if (typeof baseProps.openAnimation === 'string') {
        transitionProps = getTransitionProps(baseProps.openAnimation, { appear: transitionAppear });
      }

      if (_typeof(baseProps.openAnimation) === 'object' && baseProps.openAnimation.on) {
        transitionProps.on = baseProps.openAnimation.on;
      }
      return h(
        'transition',
        transitionProps,
        [h(SubPopupMenu, _mergeJSXProps([{
          directives: [{
            name: 'show',
            value: props.isOpen
          }]
        }, subPopupMenuProps]))]
      );
    }
  },

  render: function render() {
    var _className, _attrs;

    var h = arguments[0];

    var props = this.$props;
    var rootPrefixCls = this.rootPrefixCls,
        parentMenu = this.parentMenu;

    var isOpen = props.isOpen;
    var prefixCls = this.getPrefixCls();
    var isInlineMode = props.mode === 'inline';
    var className = (_className = {}, _defineProperty(_className, prefixCls, true), _defineProperty(_className, prefixCls + '-' + props.mode, true), _defineProperty(_className, this.getOpenClassName(), isOpen), _defineProperty(_className, this.getActiveClassName(), props.active || isOpen && !isInlineMode), _defineProperty(_className, this.getDisabledClassName(), props.disabled), _defineProperty(_className, this.getSelectedClassName(), this.isChildrenSelected()), _className);

    if (!this.internalMenuId) {
      if (props.eventKey) {
        this.internalMenuId = props.eventKey + '$Menu';
      } else {
        this.internalMenuId = '$__$' + ++guid + '$Menu';
      }
    }

    var mouseEvents = {};
    var titleClickEvents = {};
    var titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter
      };

      // only works in title, not outer li
      titleClickEvents = {
        click: this.onTitleClick
      };
      titleMouseEvents = {
        mouseenter: this.onTitleMouseEnter,
        mouseleave: this.onTitleMouseLeave
      };
    }

    var style = {};
    if (isInlineMode) {
      style.paddingLeft = props.inlineIndent * props.level + 'px';
    }
    var ariaOwns = {};
    // only set aria-owns when menu is open
    // otherwise it would be an invalid aria-owns value
    // since corresponding node cannot be found
    if (isOpen) {
      ariaOwns = {
        'aria-owns': this.internalMenuId
      };
    }
    var titleProps = {
      attrs: _extends({
        'aria-expanded': isOpen
      }, ariaOwns, {
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined
      }),
      on: _extends({}, titleMouseEvents, titleClickEvents),
      style: style,
      'class': prefixCls + '-title',
      ref: 'subMenuTitle'
    };
    // expand custom icon should NOT be displayed in menu with horizontal mode.
    var icon = null;
    if (props.mode !== 'horizontal') {
      icon = getComponentFromProp(this, 'expandIcon', props);
    }
    var title = h(
      'div',
      titleProps,
      [getComponentFromProp(this, 'title'), icon || h('i', { 'class': prefixCls + '-arrow' })]
    );
    var children = this.renderChildren(filterEmpty(this.$slots['default']));

    var getPopupContainer = this.parentMenu.isRootMenu ? this.parentMenu.getPopupContainer : function (triggerNode) {
      return triggerNode.parentNode;
    };
    var popupPlacement = popupPlacementMap[props.mode];
    var popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    var popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    var liProps = {
      on: _extends({}, omit(getListeners(this), ['click']), mouseEvents),
      'class': className
    };

    return h(
      'li',
      _mergeJSXProps([liProps, {
        attrs: { role: 'menuitem' }
      }]),
      [isInlineMode && title, isInlineMode && children, !isInlineMode && h(
        Trigger,
        {
          attrs: (_attrs = {
            prefixCls: prefixCls,
            popupClassName: prefixCls + '-popup ' + rootPrefixCls + '-' + parentMenu.theme + ' ' + (popupClassName || ''),
            getPopupContainer: getPopupContainer,
            builtinPlacements: placements
          }, _defineProperty(_attrs, 'builtinPlacements', _extends({}, placements, props.builtinPlacements)), _defineProperty(_attrs, 'popupPlacement', popupPlacement), _defineProperty(_attrs, 'popupVisible', isOpen), _defineProperty(_attrs, 'popupAlign', popupAlign), _defineProperty(_attrs, 'action', props.disabled ? [] : [props.triggerSubMenuAction]), _defineProperty(_attrs, 'mouseEnterDelay', props.subMenuOpenDelay), _defineProperty(_attrs, 'mouseLeaveDelay', props.subMenuCloseDelay), _defineProperty(_attrs, 'forceRender', props.forceSubMenuRender), _attrs),
          on: {
            'popupVisibleChange': this.onPopupVisibleChange
          }
        },
        [h(
          'template',
          { slot: 'popup' },
          [children]
        ), title]
      )]
    );
  }
};

var connected = connect(function (_ref, _ref2) {
  var openKeys = _ref.openKeys,
      activeKey = _ref.activeKey,
      selectedKeys = _ref.selectedKeys;
  var eventKey = _ref2.eventKey,
      subMenuKey = _ref2.subMenuKey;
  return {
    isOpen: openKeys.indexOf(eventKey) > -1,
    active: activeKey[subMenuKey] === eventKey,
    selectedKeys: selectedKeys
  };
})(SubMenu);

connected.isSubMenu = true;

export default connected;