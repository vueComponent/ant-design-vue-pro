'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuItemProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _store = require('../_util/store');

var _util = require('./util');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var props = {
  attribute: _vueTypes2['default'].object,
  rootPrefixCls: _vueTypes2['default'].string,
  eventKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  active: _vueTypes2['default'].bool,
  selectedKeys: _vueTypes2['default'].array,
  disabled: _vueTypes2['default'].bool,
  title: _vueTypes2['default'].any,
  index: _vueTypes2['default'].number,
  inlineIndent: _vueTypes2['default'].number.def(24),
  level: _vueTypes2['default'].number.def(1),
  mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  parentMenu: _vueTypes2['default'].object,
  multiple: _vueTypes2['default'].bool,
  value: _vueTypes2['default'].any,
  isSelected: _vueTypes2['default'].bool,
  manualRef: _vueTypes2['default'].func.def(_util.noop),
  role: _vueTypes2['default'].any,
  subMenuKey: _vueTypes2['default'].string,
  itemIcon: _vueTypes2['default'].any
  // clearSubMenuTimers: PropTypes.func.def(noop),
};
var MenuItem = {
  name: 'MenuItem',
  props: props,
  mixins: [_BaseMixin2['default']],
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
        (0, _domScrollIntoView2['default'])(_this.$el, _this.parentMenu.$el, {
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
      if (keyCode === _KeyCode2['default'].ENTER) {
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

    var props = (0, _extends3['default'])({}, this.$props);
    var className = (_className = {}, (0, _defineProperty3['default'])(_className, this.getPrefixCls(), true), (0, _defineProperty3['default'])(_className, this.getActiveClassName(), !props.disabled && props.active), (0, _defineProperty3['default'])(_className, this.getSelectedClassName(), props.isSelected), (0, _defineProperty3['default'])(_className, this.getDisabledClassName(), props.disabled), _className);
    var attrs = (0, _extends3['default'])({}, props.attribute, {
      title: props.title,
      role: props.role || 'menuitem',
      'aria-disabled': props.disabled
    });
    if (props.role === 'option') {
      // overwrite to option
      attrs = (0, _extends3['default'])({}, attrs, {
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
      click: props.disabled ? _util.noop : this.onClick,
      mouseleave: props.disabled ? _util.noop : this.onMouseLeave,
      mouseenter: props.disabled ? _util.noop : this.onMouseEnter
    };

    var style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level + 'px';
    }
    var listeners = (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this));
    _util.menuAllProps.props.forEach(function (key) {
      return delete props[key];
    });
    _util.menuAllProps.on.forEach(function (key) {
      return delete listeners[key];
    });
    var liProps = {
      attrs: (0, _extends3['default'])({}, props, attrs),
      on: (0, _extends3['default'])({}, listeners, mouseEvent)
    };
    return h(
      'li',
      (0, _babelHelperVueJsxMergeProps2['default'])([liProps, { style: style, 'class': className }]),
      [this.$slots['default'], (0, _propsUtil.getComponentFromProp)(this, 'itemIcon', props)]
    );
  }
};

var connected = (0, _store.connect)(function (_ref, _ref2) {
  var activeKey = _ref.activeKey,
      selectedKeys = _ref.selectedKeys;
  var eventKey = _ref2.eventKey,
      subMenuKey = _ref2.subMenuKey;
  return {
    active: activeKey[subMenuKey] === eventKey,
    isSelected: selectedKeys.indexOf(eventKey) !== -1
  };
})(MenuItem);

exports['default'] = connected;
exports.menuItemProps = props;