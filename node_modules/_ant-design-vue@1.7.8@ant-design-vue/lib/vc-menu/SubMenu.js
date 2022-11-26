'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTrigger = require('../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _store = require('../_util/store');

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _requestAnimationTimeout = require('../_util/requestAnimationTimeout');

var _util = require('./util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var guid = 0;

var popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};

var updateDefaultActiveFirst = function updateDefaultActiveFirst(store, eventKey, defaultActiveFirst) {
  var menuId = (0, _util.getMenuIdFromSubMenuEventKey)(eventKey);
  var state = store.getState();
  store.setState({
    defaultActiveFirst: (0, _extends4['default'])({}, state.defaultActiveFirst, (0, _defineProperty3['default'])({}, menuId, defaultActiveFirst))
  });
};

var SubMenu = {
  name: 'SubMenu',
  props: {
    parentMenu: _vueTypes2['default'].object,
    title: _vueTypes2['default'].any,
    selectedKeys: _vueTypes2['default'].array.def([]),
    openKeys: _vueTypes2['default'].array.def([]),
    openChange: _vueTypes2['default'].func.def(_util.noop),
    rootPrefixCls: _vueTypes2['default'].string,
    eventKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    multiple: _vueTypes2['default'].bool,
    active: _vueTypes2['default'].bool, // TODO: remove
    isRootMenu: _vueTypes2['default'].bool.def(false),
    index: _vueTypes2['default'].number,
    triggerSubMenuAction: _vueTypes2['default'].string,
    popupClassName: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func,
    forceSubMenuRender: _vueTypes2['default'].bool,
    openAnimation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    disabled: _vueTypes2['default'].bool,
    subMenuOpenDelay: _vueTypes2['default'].number.def(0.1),
    subMenuCloseDelay: _vueTypes2['default'].number.def(0.1),
    level: _vueTypes2['default'].number.def(1),
    inlineIndent: _vueTypes2['default'].number.def(24),
    openTransitionName: _vueTypes2['default'].string,
    popupOffset: _vueTypes2['default'].array,
    isOpen: _vueTypes2['default'].bool,
    store: _vueTypes2['default'].object,
    mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    manualRef: _vueTypes2['default'].func.def(_util.noop),
    builtinPlacements: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    itemIcon: _vueTypes2['default'].any,
    expandIcon: _vueTypes2['default'].any,
    subMenuKey: _vueTypes2['default'].string
  },
  mixins: [_BaseMixin2['default']],
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
      (0, _requestAnimationTimeout.cancelAnimationTimeout)(this.minWidthTimeout);
      this.minWidthTimeout = null;
    }

    /* istanbul ignore if */
    if (this.mouseenterTimeout) {
      (0, _requestAnimationTimeout.cancelAnimationTimeout)(this.mouseenterTimeout);
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

      this.minWidthTimeout = (0, _requestAnimationTimeout.requestAnimationTimeout)(function () {
        return _this3.adjustWidth();
      }, 0);
    },
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      var menu = this.menuInstance;
      var _$props2 = this.$props,
          store = _$props2.store,
          isOpen = _$props2.isOpen;


      if (keyCode === _KeyCode2['default'].ENTER) {
        this.onTitleClick(e);
        updateDefaultActiveFirst(store, this.eventKey, true);
        return true;
      }

      if (keyCode === _KeyCode2['default'].RIGHT) {
        if (isOpen) {
          menu.onKeyDown(e);
        } else {
          this.triggerOpenChange(true);
          // need to update current menu's defaultActiveFirst value
          updateDefaultActiveFirst(store, this.eventKey, true);
        }
        return true;
      }
      if (keyCode === _KeyCode2['default'].LEFT) {
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

      if (isOpen && (keyCode === _KeyCode2['default'].UP || keyCode === _KeyCode2['default'].DOWN)) {
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
      return (0, _extends4['default'])({}, info, {
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
        this.mouseenterTimeout = (0, _requestAnimationTimeout.requestAnimationTimeout)(function () {
          openChange();
        }, 0);
      } else {
        openChange();
      }
    },
    isChildrenSelected: function isChildrenSelected() {
      var ret = { find: false };
      (0, _util.loopMenuItemRecursively)(this.$slots['default'], this.$props.selectedKeys, ret);
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

      var _getListeners = (0, _propsUtil.getListeners)(this),
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
          defaultActiveFirst: props.store.getState().defaultActiveFirst[(0, _util.getMenuIdFromSubMenuEventKey)(props.eventKey)],
          multiple: props.multiple,
          prefixCls: props.rootPrefixCls,
          manualRef: this.saveMenuInstance,
          itemIcon: (0, _propsUtil.getComponentFromProp)(this, 'itemIcon'),
          expandIcon: (0, _propsUtil.getComponentFromProp)(this, 'expandIcon'),
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
        transitionProps = (0, _getTransitionProps2['default'])(baseProps.openTransitionName, {
          appear: transitionAppear
        });
      } else if ((0, _typeof3['default'])(baseProps.openAnimation) === 'object') {
        animProps = (0, _extends4['default'])({}, animProps, baseProps.openAnimation.props || {});
        if (!transitionAppear) {
          animProps.appear = false;
        }
      } else if (typeof baseProps.openAnimation === 'string') {
        transitionProps = (0, _getTransitionProps2['default'])(baseProps.openAnimation, { appear: transitionAppear });
      }

      if ((0, _typeof3['default'])(baseProps.openAnimation) === 'object' && baseProps.openAnimation.on) {
        transitionProps.on = baseProps.openAnimation.on;
      }
      return h(
        'transition',
        transitionProps,
        [h(_SubPopupMenu2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
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
    var className = (_className = {}, (0, _defineProperty3['default'])(_className, prefixCls, true), (0, _defineProperty3['default'])(_className, prefixCls + '-' + props.mode, true), (0, _defineProperty3['default'])(_className, this.getOpenClassName(), isOpen), (0, _defineProperty3['default'])(_className, this.getActiveClassName(), props.active || isOpen && !isInlineMode), (0, _defineProperty3['default'])(_className, this.getDisabledClassName(), props.disabled), (0, _defineProperty3['default'])(_className, this.getSelectedClassName(), this.isChildrenSelected()), _className);

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
      attrs: (0, _extends4['default'])({
        'aria-expanded': isOpen
      }, ariaOwns, {
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined
      }),
      on: (0, _extends4['default'])({}, titleMouseEvents, titleClickEvents),
      style: style,
      'class': prefixCls + '-title',
      ref: 'subMenuTitle'
    };
    // expand custom icon should NOT be displayed in menu with horizontal mode.
    var icon = null;
    if (props.mode !== 'horizontal') {
      icon = (0, _propsUtil.getComponentFromProp)(this, 'expandIcon', props);
    }
    var title = h(
      'div',
      titleProps,
      [(0, _propsUtil.getComponentFromProp)(this, 'title'), icon || h('i', { 'class': prefixCls + '-arrow' })]
    );
    var children = this.renderChildren((0, _propsUtil.filterEmpty)(this.$slots['default']));

    var getPopupContainer = this.parentMenu.isRootMenu ? this.parentMenu.getPopupContainer : function (triggerNode) {
      return triggerNode.parentNode;
    };
    var popupPlacement = popupPlacementMap[props.mode];
    var popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    var popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    var liProps = {
      on: (0, _extends4['default'])({}, (0, _omit2['default'])((0, _propsUtil.getListeners)(this), ['click']), mouseEvents),
      'class': className
    };

    return h(
      'li',
      (0, _babelHelperVueJsxMergeProps2['default'])([liProps, {
        attrs: { role: 'menuitem' }
      }]),
      [isInlineMode && title, isInlineMode && children, !isInlineMode && h(
        _vcTrigger2['default'],
        {
          attrs: (_attrs = {
            prefixCls: prefixCls,
            popupClassName: prefixCls + '-popup ' + rootPrefixCls + '-' + parentMenu.theme + ' ' + (popupClassName || ''),
            getPopupContainer: getPopupContainer,
            builtinPlacements: _placements2['default']
          }, (0, _defineProperty3['default'])(_attrs, 'builtinPlacements', (0, _extends4['default'])({}, _placements2['default'], props.builtinPlacements)), (0, _defineProperty3['default'])(_attrs, 'popupPlacement', popupPlacement), (0, _defineProperty3['default'])(_attrs, 'popupVisible', isOpen), (0, _defineProperty3['default'])(_attrs, 'popupAlign', popupAlign), (0, _defineProperty3['default'])(_attrs, 'action', props.disabled ? [] : [props.triggerSubMenuAction]), (0, _defineProperty3['default'])(_attrs, 'mouseEnterDelay', props.subMenuOpenDelay), (0, _defineProperty3['default'])(_attrs, 'mouseLeaveDelay', props.subMenuCloseDelay), (0, _defineProperty3['default'])(_attrs, 'forceRender', props.forceSubMenuRender), _attrs),
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

var connected = (0, _store.connect)(function (_ref, _ref2) {
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

exports['default'] = connected;