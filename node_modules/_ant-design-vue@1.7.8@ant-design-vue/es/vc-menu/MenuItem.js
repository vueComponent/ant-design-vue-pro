import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import BaseMixin from '../_util/BaseMixin';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from '../_util/store';
import { noop, menuAllProps } from './util';
import { getComponentFromProp, getListeners } from '../_util/props-util';

var props = {
  attribute: PropTypes.object,
  rootPrefixCls: PropTypes.string,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  selectedKeys: PropTypes.array,
  disabled: PropTypes.bool,
  title: PropTypes.any,
  index: PropTypes.number,
  inlineIndent: PropTypes.number.def(24),
  level: PropTypes.number.def(1),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  parentMenu: PropTypes.object,
  multiple: PropTypes.bool,
  value: PropTypes.any,
  isSelected: PropTypes.bool,
  manualRef: PropTypes.func.def(noop),
  role: PropTypes.any,
  subMenuKey: PropTypes.string,
  itemIcon: PropTypes.any
  // clearSubMenuTimers: PropTypes.func.def(noop),
};
var MenuItem = {
  name: 'MenuItem',
  props: props,
  mixins: [BaseMixin],
  isMenuItem: true,
  created: function created() {
    this.prevActive = this.active;
    // invoke customized ref to expose component to mixin
    this.callRef();
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      var _$props = _this.$props,
          active = _$props.active,
          parentMenu = _$props.parentMenu,
          eventKey = _$props.eventKey;

      if (!_this.prevActive && active && (!parentMenu || !parentMenu['scrolled-' + eventKey])) {
        scrollIntoView(_this.$el, _this.parentMenu.$el, {
          onlyScrollIfNeeded: true
        });
        parentMenu['scrolled-' + eventKey] = true;
      } else if (parentMenu && parentMenu['scrolled-' + eventKey]) {
        delete parentMenu['scrolled-' + eventKey];
      }
      _this.prevActive = active;
    });
    this.callRef();
  },
  beforeDestroy: function beforeDestroy() {
    var props = this.$props;
    this.__emit('destroy', props.eventKey);
  },

  methods: {
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      if (keyCode === KeyCode.ENTER) {
        this.onClick(e);
        return true;
      }
    },
    onMouseLeave: function onMouseLeave(e) {
      var eventKey = this.$props.eventKey;

      this.__emit('itemHover', {
        key: eventKey,
        hover: false
      });
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e
      });
    },
    onMouseEnter: function onMouseEnter(e) {
      var eventKey = this.eventKey;

      this.__emit('itemHover', {
        key: eventKey,
        hover: true
      });
      this.__emit('mouseenter', {
        key: eventKey,
        domEvent: e
      });
    },
    onClick: function onClick(e) {
      var _$props2 = this.$props,
          eventKey = _$props2.eventKey,
          multiple = _$props2.multiple,
          isSelected = _$props2.isSelected;

      var info = {
        key: eventKey,
        keyPath: [eventKey],
        item: this,
        domEvent: e
      };

      this.__emit('click', info);
      if (multiple) {
        if (isSelected) {
          this.__emit('deselect', info);
        } else {
          this.__emit('select', info);
        }
      } else if (!isSelected) {
        this.__emit('select', info);
      }
    },
    getPrefixCls: function getPrefixCls() {
      return this.$props.rootPrefixCls + '-item';
    },
    getActiveClassName: function getActiveClassName() {
      return this.getPrefixCls() + '-active';
    },
    getSelectedClassName: function getSelectedClassName() {
      return this.getPrefixCls() + '-selected';
    },
    getDisabledClassName: function getDisabledClassName() {
      return this.getPrefixCls() + '-disabled';
    },
    callRef: function callRef() {
      if (this.manualRef) {
        this.manualRef(this);
      }
    }
  },

  render: function render() {
    var _className;

    var h = arguments[0];

    var props = _extends({}, this.$props);
    var className = (_className = {}, _defineProperty(_className, this.getPrefixCls(), true), _defineProperty(_className, this.getActiveClassName(), !props.disabled && props.active), _defineProperty(_className, this.getSelectedClassName(), props.isSelected), _defineProperty(_className, this.getDisabledClassName(), props.disabled), _className);
    var attrs = _extends({}, props.attribute, {
      title: props.title,
      role: props.role || 'menuitem',
      'aria-disabled': props.disabled
    });
    if (props.role === 'option') {
      // overwrite to option
      attrs = _extends({}, attrs, {
        role: 'option',
        'aria-selected': props.isSelected
      });
    } else if (props.role === null || props.role === 'none') {
      // sometimes we want to specify role inside <li/> element
      // <li><a role='menuitem'>Link</a></li> would be a good example
      // in this case the role on <li/> should be "none" to
      // remove the implied listitem role.
      // https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
      attrs.role = 'none';
    }
    // In case that onClick/onMouseLeave/onMouseEnter is passed down from owner
    var mouseEvent = {
      click: props.disabled ? noop : this.onClick,
      mouseleave: props.disabled ? noop : this.onMouseLeave,
      mouseenter: props.disabled ? noop : this.onMouseEnter
    };

    var style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level + 'px';
    }
    var listeners = _extends({}, getListeners(this));
    menuAllProps.props.forEach(function (key) {
      return delete props[key];
    });
    menuAllProps.on.forEach(function (key) {
      return delete listeners[key];
    });
    var liProps = {
      attrs: _extends({}, props, attrs),
      on: _extends({}, listeners, mouseEvent)
    };
    return h(
      'li',
      _mergeJSXProps([liProps, { style: style, 'class': className }]),
      [this.$slots['default'], getComponentFromProp(this, 'itemIcon', props)]
    );
  }
};

var connected = connect(function (_ref, _ref2) {
  var activeKey = _ref.activeKey,
      selectedKeys = _ref.selectedKeys;
  var eventKey = _ref2.eventKey,
      subMenuKey = _ref2.subMenuKey;
  return {
    active: activeKey[subMenuKey] === eventKey,
    isSelected: selectedKeys.indexOf(eventKey) !== -1
  };
})(MenuItem);

export default connected;
export { props as menuItemProps };