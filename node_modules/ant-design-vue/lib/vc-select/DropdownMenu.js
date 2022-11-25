'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcMenu = require('../vc-menu');

var _vcMenu2 = _interopRequireDefault(_vcMenu);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _util = require('./util');

var _vnode = require('../_util/vnode');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'DropdownMenu',
  mixins: [_BaseMixin2['default']],
  props: {
    ariaId: _vueTypes2['default'].string,
    defaultActiveFirstOption: _vueTypes2['default'].bool,
    value: _vueTypes2['default'].any,
    dropdownMenuStyle: _vueTypes2['default'].object,
    multiple: _vueTypes2['default'].bool,
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    // onMenuDeSelect: PropTypes.func,
    // onMenuSelect: PropTypes.func,
    prefixCls: _vueTypes2['default'].string,
    menuItems: _vueTypes2['default'].any,
    inputValue: _vueTypes2['default'].string,
    visible: _vueTypes2['default'].bool,
    backfillValue: _vueTypes2['default'].any,
    firstActiveValue: _vueTypes2['default'].string,
    menuItemSelectedIcon: _vueTypes2['default'].any
  },
  watch: {
    visible: function visible(val) {
      var _this = this;

      if (!val) {
        this.lastVisible = val;
      } else {
        this.$nextTick(function () {
          _this.scrollActiveItemToView();
        });
      }
    }
  },

  created: function created() {
    this.rafInstance = null;
    this.lastInputValue = this.$props.inputValue;
    this.lastVisible = false;
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.scrollActiveItemToView();
    });
    this.lastVisible = this.$props.visible;
  },
  updated: function updated() {
    var props = this.$props;
    // if (!this.prevVisible && props.visible) {
    //   this.$nextTick(() => {
    //     this.scrollActiveItemToView();
    //   });
    // }
    this.lastVisible = props.visible;
    this.lastInputValue = props.inputValue;
    this.prevVisible = this.visible;
  },
  beforeDestroy: function beforeDestroy() {
    if (this.rafInstance) {
      _raf2['default'].cancel(this.rafInstance);
    }
  },

  methods: {
    scrollActiveItemToView: function scrollActiveItemToView() {
      var _this3 = this;

      // scroll into view
      var itemComponent = this.firstActiveItem && this.firstActiveItem.$el;
      var props = this.$props;
      var value = props.value,
          visible = props.visible,
          firstActiveValue = props.firstActiveValue;

      if (!itemComponent || !visible) {
        return;
      }
      var scrollIntoViewOpts = {
        onlyScrollIfNeeded: true
      };
      if ((!value || value.length === 0) && firstActiveValue) {
        scrollIntoViewOpts.alignWithTop = true;
      }
      // Delay to scroll since current frame item position is not ready when pre view is by filter
      // https://github.com/ant-design/ant-design/issues/11268#issuecomment-406634462
      this.rafInstance = (0, _raf2['default'])(function () {
        (0, _domScrollIntoView2['default'])(itemComponent, _this3.$refs.menuRef.$el, scrollIntoViewOpts);
      });
    },
    renderMenu: function renderMenu() {
      var _this4 = this;

      var h = this.$createElement;

      var props = this.$props;
      var menuItems = props.menuItems,
          defaultActiveFirstOption = props.defaultActiveFirstOption,
          value = props.value,
          prefixCls = props.prefixCls,
          multiple = props.multiple,
          inputValue = props.inputValue,
          firstActiveValue = props.firstActiveValue,
          dropdownMenuStyle = props.dropdownMenuStyle,
          backfillValue = props.backfillValue,
          visible = props.visible;

      var menuItemSelectedIcon = (0, _propsUtil.getComponentFromProp)(this, 'menuItemSelectedIcon');

      var _getListeners = (0, _propsUtil.getListeners)(this),
          menuDeselect = _getListeners.menuDeselect,
          menuSelect = _getListeners.menuSelect,
          popupScroll = _getListeners.popupScroll;

      if (menuItems && menuItems.length) {
        var selectedKeys = (0, _util.getSelectKeys)(menuItems, value);
        var menuProps = {
          props: {
            multiple: multiple,
            itemIcon: multiple ? menuItemSelectedIcon : null,
            selectedKeys: selectedKeys,
            prefixCls: prefixCls + '-menu'
          },
          on: {},
          style: dropdownMenuStyle,
          ref: 'menuRef',
          attrs: {
            role: 'listbox'
          }
        };
        if (popupScroll) {
          menuProps.on.scroll = popupScroll;
        }
        if (multiple) {
          menuProps.on.deselect = menuDeselect;
          menuProps.on.select = menuSelect;
        } else {
          menuProps.on.click = menuSelect;
        }
        var activeKeyProps = {};

        var defaultActiveFirst = defaultActiveFirstOption;
        var clonedMenuItems = menuItems;
        if (selectedKeys.length || firstActiveValue) {
          if (props.visible && !this.lastVisible) {
            activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
          } else if (!visible) {
            // Do not trigger auto active since we already have selectedKeys
            if (selectedKeys[0]) {
              defaultActiveFirst = false;
            }
            activeKeyProps.activeKey = undefined;
          }
          var foundFirst = false;
          // set firstActiveItem via cloning menus
          // for scroll into view
          var clone = function clone(item) {
            if (!foundFirst && selectedKeys.indexOf(item.key) !== -1 || !foundFirst && !selectedKeys.length && firstActiveValue.indexOf(item.key) !== -1) {
              foundFirst = true;
              return (0, _vnode.cloneElement)(item, {
                directives: [{
                  name: 'ant-ref',
                  value: function value(ref) {
                    _this4.firstActiveItem = ref;
                  }
                }]
              });
            }
            return item;
          };

          clonedMenuItems = menuItems.map(function (item) {
            if ((0, _propsUtil.getSlotOptions)(item).isMenuItemGroup) {
              var children = item.componentOptions.children.map(clone);
              return (0, _vnode.cloneElement)(item, { children: children });
            }
            return clone(item);
          });
        } else {
          // Clear firstActiveItem when dropdown menu items was empty
          // Avoid `Unable to find node on an unmounted component`
          // https://github.com/ant-design/ant-design/issues/10774
          this.firstActiveItem = null;
        }

        // clear activeKey when inputValue change
        var lastValue = value && value[value.length - 1];
        if (inputValue !== this.lastInputValue && (!lastValue || lastValue !== backfillValue)) {
          activeKeyProps.activeKey = '';
        }
        menuProps.props = (0, _extends3['default'])({}, activeKeyProps, menuProps.props, { defaultActiveFirst: defaultActiveFirst });
        return h(
          _vcMenu2['default'],
          menuProps,
          [clonedMenuItems]
        );
      }
      return null;
    }
  },
  render: function render() {
    var h = arguments[0];

    var renderMenu = this.renderMenu();

    var _getListeners2 = (0, _propsUtil.getListeners)(this),
        popupFocus = _getListeners2.popupFocus,
        popupScroll = _getListeners2.popupScroll;

    return renderMenu ? h(
      'div',
      {
        style: {
          overflow: 'auto',
          transform: 'translateZ(0)'
        },
        attrs: { id: this.$props.ariaId,
          tabIndex: '-1'
        },
        on: {
          'focus': popupFocus,
          'mousedown': _util.preventDefaultEvent,
          'scroll': popupScroll
        },

        ref: 'menuContainer'
      },
      [renderMenu]
    ) : null;
  }
};