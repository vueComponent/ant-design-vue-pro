import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { connect } from '../_util/store';
import BaseMixin from '../_util/BaseMixin';
import KeyCode from '../_util/KeyCode';
import classNames from 'classnames';
import { getKeyFromChildrenIndex, loopMenuItem, noop, isMobileDevice } from './util';
import DOMWrap from './DOMWrap';
import { cloneElement } from '../_util/vnode';
import { initDefaultProps, getOptionProps, getPropsData, getEvents, getComponentFromProp, getListeners } from '../_util/props-util';

function allDisabled(arr) {
  if (!arr.length) {
    return true;
  }
  return arr.every(function (c) {
    return !!c.disabled;
  });
}

function updateActiveKey(store, menuId, activeKey) {
  var state = store.getState();
  store.setState({
    activeKey: _extends({}, state.activeKey, _defineProperty({}, menuId, activeKey))
  });
}

function getEventKey(props) {
  // when eventKey not available ,it's menu and return menu id '0-menu-'
  return props.eventKey || '0-menu-';
}

export function saveRef(key, c) {
  if (c) {
    var index = this.instanceArrayKeyIndexMap[key];
    this.instanceArray[index] = c;
  }
}
export function getActiveKey(props, originalActiveKey) {
  var activeKey = originalActiveKey;
  var eventKey = props.eventKey,
      defaultActiveFirst = props.defaultActiveFirst,
      children = props.children;

  if (activeKey !== undefined && activeKey !== null) {
    var found = void 0;
    loopMenuItem(children, function (c, i) {
      var propsData = c.componentOptions.propsData || {};
      if (c && !propsData.disabled && activeKey === getKeyFromChildrenIndex(c, eventKey, i)) {
        found = true;
      }
    });
    if (found) {
      return activeKey;
    }
  }
  activeKey = null;
  if (defaultActiveFirst) {
    loopMenuItem(children, function (c, i) {
      var propsData = c.componentOptions.propsData || {};
      var noActiveKey = activeKey === null || activeKey === undefined;
      if (noActiveKey && c && !propsData.disabled) {
        activeKey = getKeyFromChildrenIndex(c, eventKey, i);
      }
    });
    return activeKey;
  }
  return activeKey;
}

var SubPopupMenu = {
  name: 'SubPopupMenu',
  props: initDefaultProps({
    // onSelect: PropTypes.func,
    // onClick: PropTypes.func,
    // onDeselect: PropTypes.func,
    // onOpenChange: PropTypes.func,
    // onDestroy: PropTypes.func,
    prefixCls: PropTypes.string,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    visible: PropTypes.bool,
    parentMenu: PropTypes.object,
    eventKey: PropTypes.string,
    store: PropTypes.object,
    forceSubMenuRender: PropTypes.bool,

    // adding in refactor
    focusable: PropTypes.bool,
    multiple: PropTypes.bool,
    defaultActiveFirst: PropTypes.bool,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    level: PropTypes.number,
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    triggerSubMenuAction: PropTypes.oneOf(['click', 'hover']),
    inlineIndent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    manualRef: PropTypes.func,
    itemIcon: PropTypes.any,
    expandIcon: PropTypes.any,
    overflowedIndicator: PropTypes.any,
    children: PropTypes.any.def([]),
    __propsSymbol__: PropTypes.any // mock componentWillReceiveProps
  }, {
    prefixCls: 'rc-menu',
    mode: 'vertical',
    level: 1,
    inlineIndent: 24,
    visible: true,
    focusable: true,
    manualRef: noop
  }),

  mixins: [BaseMixin],
  created: function created() {
    var props = getOptionProps(this);
    this.prevProps = _extends({}, props);
    props.store.setState({
      activeKey: _extends({}, props.store.getState().activeKey, _defineProperty({}, props.eventKey, getActiveKey(props, props.activeKey)))
    });
    this.instanceArray = [];
  },
  mounted: function mounted() {
    // invoke customized ref to expose component to mixin
    if (this.manualRef) {
      this.manualRef(this);
    }
  },
  updated: function updated() {
    var props = getOptionProps(this);
    var prevProps = this.prevProps;
    var originalActiveKey = 'activeKey' in props ? props.activeKey : props.store.getState().activeKey[getEventKey(props)];
    var activeKey = getActiveKey(props, originalActiveKey);
    if (activeKey !== originalActiveKey) {
      updateActiveKey(props.store, getEventKey(props), activeKey);
    } else if ('activeKey' in prevProps) {
      // If prev activeKey is not same as current activeKey,
      // we should set it.
      var prevActiveKey = getActiveKey(prevProps, prevProps.activeKey);
      if (activeKey !== prevActiveKey) {
        updateActiveKey(props.store, getEventKey(props), activeKey);
      }
    }
    this.prevProps = _extends({}, props);
  },

  methods: {
    // all keyboard events callbacks run from here at first
    onKeyDown: function onKeyDown(e, callback) {
      var keyCode = e.keyCode;
      var handled = void 0;
      this.getFlatInstanceArray().forEach(function (obj) {
        if (obj && obj.active && obj.onKeyDown) {
          handled = obj.onKeyDown(e);
        }
      });
      if (handled) {
        return 1;
      }
      var activeItem = null;
      if (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN) {
        activeItem = this.step(keyCode === KeyCode.UP ? -1 : 1);
      }
      if (activeItem) {
        e.preventDefault();
        updateActiveKey(this.$props.store, getEventKey(this.$props), activeItem.eventKey);

        if (typeof callback === 'function') {
          callback(activeItem);
        }

        return 1;
      }
      return undefined;
    },
    onItemHover: function onItemHover(e) {
      var key = e.key,
          hover = e.hover;

      updateActiveKey(this.$props.store, getEventKey(this.$props), hover ? key : null);
    },
    onDeselect: function onDeselect(selectInfo) {
      this.__emit('deselect', selectInfo);
    },
    onSelect: function onSelect(selectInfo) {
      this.__emit('select', selectInfo);
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
    },
    onOpenChange: function onOpenChange(e) {
      this.__emit('openChange', e);
    },
    onDestroy: function onDestroy(key) {
      this.__emit('destroy', key);
    },
    getFlatInstanceArray: function getFlatInstanceArray() {
      return this.instanceArray;
    },
    getOpenTransitionName: function getOpenTransitionName() {
      return this.$props.openTransitionName;
    },
    step: function step(direction) {
      var children = this.getFlatInstanceArray();
      var activeKey = this.$props.store.getState().activeKey[getEventKey(this.$props)];
      var len = children.length;
      if (!len) {
        return null;
      }
      if (direction < 0) {
        children = children.concat().reverse();
      }
      // find current activeIndex
      var activeIndex = -1;
      children.every(function (c, ci) {
        if (c && c.eventKey === activeKey) {
          activeIndex = ci;
          return false;
        }
        return true;
      });
      if (!this.defaultActiveFirst && activeIndex !== -1 && allDisabled(children.slice(activeIndex, len - 1))) {
        return undefined;
      }
      var start = (activeIndex + 1) % len;
      var i = start;

      do {
        var child = children[i];
        if (!child || child.disabled) {
          i = (i + 1) % len;
        } else {
          return child;
        }
      } while (i !== start);

      return null;
    },
    getIcon: function getIcon(instance, name) {
      if (instance.$createElement) {
        var temp = instance[name];
        if (temp !== undefined) {
          return temp;
        }
        return instance.$slots[name] || instance.$scopedSlots[name];
      } else {
        var _temp = getPropsData(instance)[name];
        if (_temp !== undefined) {
          return _temp;
        }
        var slotsProp = [];
        var componentOptions = instance.componentOptions || {};
        (componentOptions.children || []).forEach(function (child) {
          if (child.data && child.data.slot === name) {
            if (child.tag === 'template') {
              slotsProp.push(child.children);
            } else {
              slotsProp.push(child);
            }
          }
        });
        return slotsProp.length ? slotsProp : undefined;
      }
    },
    renderCommonMenuItem: function renderCommonMenuItem(child, i, extraProps) {
      var _this = this;

      if (child.tag === undefined) {
        return child;
      }
      var state = this.$props.store.getState();
      var props = this.$props;
      var key = getKeyFromChildrenIndex(child, props.eventKey, i);
      var childProps = child.componentOptions.propsData || {};

      var isActive = key === state.activeKey[getEventKey(this.$props)];
      if (!childProps.disabled) {
        // manualRef的执行顺序不能保证，使用key映射ref在this.instanceArray中的位置
        this.instanceArrayKeyIndexMap[key] = Object.keys(this.instanceArrayKeyIndexMap).length;
      }
      var childListeners = getEvents(child);
      var newChildProps = {
        props: _extends({
          mode: childProps.mode || props.mode,
          level: props.level,
          inlineIndent: props.inlineIndent,
          renderMenuItem: this.renderMenuItem,
          rootPrefixCls: props.prefixCls,
          index: i,
          parentMenu: props.parentMenu,
          // customized ref function, need to be invoked manually in child's componentDidMount
          manualRef: childProps.disabled ? noop : saveRef.bind(this, key),
          eventKey: key,
          active: !childProps.disabled && isActive,
          multiple: props.multiple,
          openTransitionName: this.getOpenTransitionName(),
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender,
          builtinPlacements: props.builtinPlacements,
          itemIcon: this.getIcon(child, 'itemIcon') || this.getIcon(this, 'itemIcon'),
          expandIcon: this.getIcon(child, 'expandIcon') || this.getIcon(this, 'expandIcon')
        }, extraProps),
        on: {
          click: function click(e) {
            (childListeners.click || noop)(e);
            _this.onClick(e);
          },
          itemHover: this.onItemHover,
          openChange: this.onOpenChange,
          deselect: this.onDeselect,
          // destroy: this.onDestroy,
          select: this.onSelect
        }
      };
      // ref: https://github.com/ant-design/ant-design/issues/13943
      if (props.mode === 'inline' || isMobileDevice()) {
        newChildProps.props.triggerSubMenuAction = 'click';
      }
      return cloneElement(child, newChildProps);
    },
    renderMenuItem: function renderMenuItem(c, i, subMenuKey) {
      if (!c) {
        return null;
      }
      var state = this.$props.store.getState();
      var extraProps = {
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys,
        triggerSubMenuAction: this.triggerSubMenuAction,
        isRootMenu: false,
        subMenuKey: subMenuKey
      };
      return this.renderCommonMenuItem(c, i, extraProps);
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var props = _objectWithoutProperties(this.$props, []);

    var eventKey = props.eventKey,
        prefixCls = props.prefixCls,
        visible = props.visible,
        level = props.level,
        mode = props.mode,
        theme = props.theme;

    this.instanceArray = [];
    this.instanceArrayKeyIndexMap = {};
    var className = classNames(props.prefixCls, props.prefixCls + '-' + props.mode);
    var domWrapProps = {
      props: {
        tag: 'ul',
        // hiddenClassName: `${prefixCls}-hidden`,
        visible: visible,
        prefixCls: prefixCls,
        level: level,
        mode: mode,
        theme: theme,
        overflowedIndicator: getComponentFromProp(this, 'overflowedIndicator')
      },
      attrs: {
        role: props.role || 'menu'
      },
      'class': className,
      // Otherwise, the propagated click event will trigger another onClick
      on: omit(getListeners(this), ['click'])
    };
    // if (props.id) {
    //   domProps.id = props.id
    // }
    if (props.focusable) {
      domWrapProps.attrs.tabIndex = '0';
      domWrapProps.on.keydown = this.onKeyDown;
    }
    return (
      // ESLint is not smart enough to know that the type of `children` was checked.
      /* eslint-disable */
      h(
        DOMWrap,
        domWrapProps,
        [props.children.map(function (c, i) {
          return _this2.renderMenuItem(c, i, eventKey || '0-menu-');
        })]
      )
      /*eslint -enable */

    );
  }
};

export default connect()(SubPopupMenu);