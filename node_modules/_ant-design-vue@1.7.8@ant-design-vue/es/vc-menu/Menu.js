import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { Provider, create } from '../_util/store';
import { default as SubPopupMenu, getActiveKey } from './SubPopupMenu';
import BaseMixin from '../_util/BaseMixin';
import hasProp, { getOptionProps, getComponentFromProp, filterEmpty, getListeners } from '../_util/props-util';
import commonPropsType from './commonPropsType';

var Menu = {
  name: 'Menu',
  props: _extends({}, commonPropsType, {
    selectable: PropTypes.bool.def(true)
  }),
  mixins: [BaseMixin],

  data: function data() {
    var props = getOptionProps(this);
    var selectedKeys = props.defaultSelectedKeys;
    var openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }

    this.store = create({
      selectedKeys: selectedKeys,
      openKeys: openKeys,
      activeKey: {
        '0-menu-': getActiveKey(_extends({}, props, { children: this.$slots['default'] || [] }), props.activeKey)
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
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys: selectedKeys
          });
        }
        this.__emit('select', _extends({}, selectInfo, {
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
        if (!hasProp(this, 'openKeys')) {
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
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys: selectedKeys
          });
        }
        this.__emit('deselect', _extends({}, selectInfo, {
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
      var props = getOptionProps(this);
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

    var props = getOptionProps(this);
    var subPopupMenuProps = {
      props: _extends({}, props, {
        itemIcon: getComponentFromProp(this, 'itemIcon', props),
        expandIcon: getComponentFromProp(this, 'expandIcon', props),
        overflowedIndicator: getComponentFromProp(this, 'overflowedIndicator', props) || h('span', ['\xB7\xB7\xB7']),
        openTransitionName: this.getOpenTransitionName(),
        parentMenu: this,
        children: filterEmpty(this.$slots['default'] || [])
      }),
      'class': props.prefixCls + '-root',
      on: _extends({}, getListeners(this), {
        click: this.onClick,
        openChange: this.onOpenChange,
        deselect: this.onDeselect,
        select: this.onSelect
      }),
      ref: 'innerMenu'
    };
    return h(
      Provider,
      {
        attrs: { store: this.store }
      },
      [h(SubPopupMenu, subPopupMenuProps)]
    );
  }
};
export default Menu;