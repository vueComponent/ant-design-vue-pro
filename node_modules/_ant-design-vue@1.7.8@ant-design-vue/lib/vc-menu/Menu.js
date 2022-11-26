'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _store = require('../_util/store');

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _commonPropsType = require('./commonPropsType');

var _commonPropsType2 = _interopRequireDefault(_commonPropsType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Menu = {
  name: 'Menu',
  props: (0, _extends3['default'])({}, _commonPropsType2['default'], {
    selectable: _vueTypes2['default'].bool.def(true)
  }),
  mixins: [_BaseMixin2['default']],

  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var selectedKeys = props.defaultSelectedKeys;
    var openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }

    this.store = (0, _store.create)({
      selectedKeys: selectedKeys,
      openKeys: openKeys,
      activeKey: {
        '0-menu-': (0, _SubPopupMenu.getActiveKey)((0, _extends3['default'])({}, props, { children: this.$slots['default'] || [] }), props.activeKey)
      }
    });

    // this.isRootMenu = true // 声明在props上
    return {};
  },
  mounted: function mounted() {
    this.updateMiniStore();
  },
  updated: function updated() {
    this.updateMiniStore();
  },

  methods: {
    onSelect: function onSelect(selectInfo) {
      var props = this.$props;
      if (props.selectable) {
        // root menu
        var selectedKeys = this.store.getState().selectedKeys;
        var selectedKey = selectInfo.key;
        if (props.multiple) {
          selectedKeys = selectedKeys.concat([selectedKey]);
        } else {
          selectedKeys = [selectedKey];
        }
        if (!(0, _propsUtil2['default'])(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys: selectedKeys
          });
        }
        this.__emit('select', (0, _extends3['default'])({}, selectInfo, {
          selectedKeys: selectedKeys
        }));
      }
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
    },

    // onKeyDown needs to be exposed as a instance method
    // e.g., in rc-select, we need to navigate menu item while
    // current active item is rc-select input box rather than the menu itself
    onKeyDown: function onKeyDown(e, callback) {
      this.$refs.innerMenu.getWrappedInstance().onKeyDown(e, callback);
    },
    onOpenChange: function onOpenChange(event) {
      var openKeys = this.store.getState().openKeys.concat();
      var changed = false;
      var processSingle = function processSingle(e) {
        var oneChanged = false;
        if (e.open) {
          oneChanged = openKeys.indexOf(e.key) === -1;
          if (oneChanged) {
            openKeys.push(e.key);
          }
        } else {
          var index = openKeys.indexOf(e.key);
          oneChanged = index !== -1;
          if (oneChanged) {
            openKeys.splice(index, 1);
          }
        }
        changed = changed || oneChanged;
      };
      if (Array.isArray(event)) {
        // batch change call
        event.forEach(processSingle);
      } else {
        processSingle(event);
      }
      if (changed) {
        if (!(0, _propsUtil2['default'])(this, 'openKeys')) {
          this.store.setState({ openKeys: openKeys });
        }
        this.__emit('openChange', openKeys);
      }
    },
    onDeselect: function onDeselect(selectInfo) {
      var props = this.$props;
      if (props.selectable) {
        var selectedKeys = this.store.getState().selectedKeys.concat();
        var selectedKey = selectInfo.key;
        var index = selectedKeys.indexOf(selectedKey);
        if (index !== -1) {
          selectedKeys.splice(index, 1);
        }
        if (!(0, _propsUtil2['default'])(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys: selectedKeys
          });
        }
        this.__emit('deselect', (0, _extends3['default'])({}, selectInfo, {
          selectedKeys: selectedKeys
        }));
      }
    },
    getOpenTransitionName: function getOpenTransitionName() {
      var props = this.$props;
      var transitionName = props.openTransitionName;
      var animationName = props.openAnimation;
      if (!transitionName && typeof animationName === 'string') {
        transitionName = props.prefixCls + '-open-' + animationName;
      }
      return transitionName;
    },
    updateMiniStore: function updateMiniStore() {
      var props = (0, _propsUtil.getOptionProps)(this);
      if ('selectedKeys' in props) {
        this.store.setState({
          selectedKeys: props.selectedKeys || []
        });
      }
      if ('openKeys' in props) {
        this.store.setState({
          openKeys: props.openKeys || []
        });
      }
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var subPopupMenuProps = {
      props: (0, _extends3['default'])({}, props, {
        itemIcon: (0, _propsUtil.getComponentFromProp)(this, 'itemIcon', props),
        expandIcon: (0, _propsUtil.getComponentFromProp)(this, 'expandIcon', props),
        overflowedIndicator: (0, _propsUtil.getComponentFromProp)(this, 'overflowedIndicator', props) || h('span', ['\xB7\xB7\xB7']),
        openTransitionName: this.getOpenTransitionName(),
        parentMenu: this,
        children: (0, _propsUtil.filterEmpty)(this.$slots['default'] || [])
      }),
      'class': props.prefixCls + '-root',
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        click: this.onClick,
        openChange: this.onOpenChange,
        deselect: this.onDeselect,
        select: this.onSelect
      }),
      ref: 'innerMenu'
    };
    return h(
      _store.Provider,
      {
        attrs: { store: this.store }
      },
      [h(_SubPopupMenu2['default'], subPopupMenuProps)]
    );
  }
};
exports['default'] = Menu;