import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import Menu, { SubMenu, Item as MenuItem } from '../vc-menu';
import closest from 'dom-closest';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import Dropdown from '../dropdown';
import Icon from '../icon';
import Checkbox from '../checkbox';
import Radio from '../radio';
import FilterDropdownMenuWrapper from './FilterDropdownMenuWrapper';
import { FilterMenuProps } from './interface';
import { initDefaultProps, getOptionProps, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import { generateValueMaps } from './util';

function stopPropagation(e) {
  e.stopPropagation();
}

export default {
  name: 'FilterMenu',
  mixins: [BaseMixin],
  props: initDefaultProps(FilterMenuProps, {
    handleFilter: function handleFilter() {},

    column: {}
  }),

  data: function data() {
    var visible = 'filterDropdownVisible' in this.column ? this.column.filterDropdownVisible : false;
    this.preProps = _extends({}, getOptionProps(this));
    return {
      sSelectedKeys: this.selectedKeys,
      sKeyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      sVisible: visible,
      sValueKeys: generateValueMaps(this.column.filters)
    };
  },

  watch: {
    _propsSymbol: function _propsSymbol() {
      var nextProps = getOptionProps(this);
      var column = nextProps.column;

      var newState = {};

      /**
       * if the state is visible the component should ignore updates on selectedKeys prop to avoid
       * that the user selection is lost
       * this happens frequently when a table is connected on some sort of realtime data
       * Fixes https://github.com/ant-design/ant-design/issues/10289 and
       * https://github.com/ant-design/ant-design/issues/10209
       */
      if ('selectedKeys' in nextProps && !shallowequal(this.preProps.selectedKeys, nextProps.selectedKeys)) {
        newState.sSelectedKeys = nextProps.selectedKeys;
      }
      if (!shallowequal((this.preProps.column || {}).filters, (nextProps.column || {}).filters)) {
        newState.sValueKeys = generateValueMaps(nextProps.column.filters);
      }
      if ('filterDropdownVisible' in column) {
        newState.sVisible = column.filterDropdownVisible;
      }
      if (Object.keys(newState).length > 0) {
        this.setState(newState);
      }
      this.preProps = _extends({}, nextProps);
    }
  },

  mounted: function mounted() {
    var _this = this;

    var column = this.column;

    this.$nextTick(function () {
      _this.setNeverShown(column);
    });
  },
  updated: function updated() {
    var _this2 = this;

    var column = this.column;

    this.$nextTick(function () {
      _this2.setNeverShown(column);
    });
  },

  methods: {
    getDropdownVisible: function getDropdownVisible() {
      return this.neverShown ? false : this.sVisible;
    },
    setNeverShown: function setNeverShown(column) {
      var rootNode = this.$el;
      var filterBelongToScrollBody = !!closest(rootNode, '.ant-table-scroll');
      if (filterBelongToScrollBody) {
        // When fixed column have filters, there will be two dropdown menus
        // Filter dropdown menu inside scroll body should never be shown
        // To fix https://github.com/ant-design/ant-design/issues/5010 and
        // https://github.com/ant-design/ant-design/issues/7909
        this.neverShown = !!column.fixed;
      }
    },
    setSelectedKeys: function setSelectedKeys(_ref) {
      var selectedKeys = _ref.selectedKeys;

      this.setState({ sSelectedKeys: selectedKeys });
    },
    setVisible: function setVisible(visible) {
      var column = this.column;

      if (!('filterDropdownVisible' in column)) {
        this.setState({ sVisible: visible });
      }
      if (column.onFilterDropdownVisibleChange) {
        column.onFilterDropdownVisibleChange(visible);
      }
    },
    handleClearFilters: function handleClearFilters() {
      this.setState({
        sSelectedKeys: []
      }, this.handleConfirm);
    },
    handleConfirm: function handleConfirm() {
      var _this3 = this;

      this.setVisible(false);
      this.confirmFilter2();
      // Call `setSelectedKeys` & `confirm` in the same time will make filter data not up to date
      // https://github.com/ant-design/ant-design/issues/12284
      this.$forceUpdate();
      this.$nextTick(function () {
        _this3.confirmFilter;
      });
    },
    onVisibleChange: function onVisibleChange(visible) {
      this.setVisible(visible);
      var column = this.$props.column;
      // https://github.com/ant-design/ant-design/issues/17833

      if (!visible && !(column.filterDropdown instanceof Function)) {
        this.confirmFilter2();
      }
    },
    handleMenuItemClick: function handleMenuItemClick(info) {
      var selectedKeys = this.$data.sSelectedKeys;

      if (!info.keyPath || info.keyPath.length <= 1) {
        return;
      }
      var keyPathOfSelectedItem = this.$data.sKeyPathOfSelectedItem;

      if (selectedKeys && selectedKeys.indexOf(info.key) >= 0) {
        // deselect SubMenu child
        delete keyPathOfSelectedItem[info.key];
      } else {
        // select SubMenu child
        keyPathOfSelectedItem[info.key] = info.keyPath;
      }
      this.setState({ sKeyPathOfSelectedItem: keyPathOfSelectedItem });
    },
    hasSubMenu: function hasSubMenu() {
      var _column$filters = this.column.filters,
          filters = _column$filters === undefined ? [] : _column$filters;

      return filters.some(function (item) {
        return !!(item.children && item.children.length > 0);
      });
    },
    confirmFilter2: function confirmFilter2() {
      var _$props = this.$props,
          column = _$props.column,
          propSelectedKeys = _$props.selectedKeys,
          confirmFilter = _$props.confirmFilter;
      var _$data = this.$data,
          selectedKeys = _$data.sSelectedKeys,
          valueKeys = _$data.sValueKeys;
      var filterDropdown = column.filterDropdown;


      if (!shallowequal(selectedKeys, propSelectedKeys)) {
        confirmFilter(column, filterDropdown ? selectedKeys : selectedKeys.map(function (key) {
          return valueKeys[key];
        }).filter(function (key) {
          return key !== undefined;
        }));
      }
    },
    renderMenus: function renderMenus(items) {
      var _this4 = this;

      var h = this.$createElement;
      var _$props2 = this.$props,
          dropdownPrefixCls = _$props2.dropdownPrefixCls,
          prefixCls = _$props2.prefixCls;

      return items.map(function (item) {
        if (item.children && item.children.length > 0) {
          var sKeyPathOfSelectedItem = _this4.sKeyPathOfSelectedItem;

          var containSelected = Object.keys(sKeyPathOfSelectedItem).some(function (key) {
            return sKeyPathOfSelectedItem[key].indexOf(item.value) >= 0;
          });
          var subMenuCls = classNames(prefixCls + '-dropdown-submenu', _defineProperty({}, dropdownPrefixCls + '-submenu-contain-selected', containSelected));
          return h(
            SubMenu,
            {
              attrs: { title: item.text, popupClassName: subMenuCls },
              key: item.value },
            [_this4.renderMenus(item.children)]
          );
        }
        return _this4.renderMenuItem(item);
      });
    },
    renderFilterIcon: function renderFilterIcon() {
      var _classNames2;

      var h = this.$createElement;
      var column = this.column,
          locale = this.locale,
          prefixCls = this.prefixCls,
          selectedKeys = this.selectedKeys;

      var filtered = selectedKeys && selectedKeys.length > 0;
      var filterIcon = column.filterIcon;
      if (typeof filterIcon === 'function') {
        filterIcon = filterIcon(filtered, column);
      }
      var dropdownIconClass = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-selected', 'filtered' in column ? column.filtered : filtered), _defineProperty(_classNames2, prefixCls + '-open', this.getDropdownVisible()), _classNames2));
      if (!filterIcon) {
        return h(Icon, {
          attrs: {
            title: locale.filterTitle,
            type: 'filter',
            theme: 'filled'
          },
          'class': dropdownIconClass,
          on: {
            'click': stopPropagation
          }
        });
      }
      if (filterIcon.length === 1 && isValidElement(filterIcon[0])) {
        return cloneElement(filterIcon[0], {
          on: {
            click: stopPropagation
          },
          'class': classNames(prefixCls + '-icon', dropdownIconClass)
        });
      }
      return h(
        'span',
        { 'class': classNames(prefixCls + '-icon', dropdownIconClass) },
        [filterIcon]
      );
    },
    renderMenuItem: function renderMenuItem(item) {
      var h = this.$createElement;
      var column = this.column;
      var selectedKeys = this.$data.sSelectedKeys;

      var multiple = 'filterMultiple' in column ? column.filterMultiple : true;

      var input = multiple ? h(Checkbox, {
        attrs: { checked: selectedKeys && selectedKeys.indexOf(item.value) >= 0 }
      }) : h(Radio, {
        attrs: { checked: selectedKeys && selectedKeys.indexOf(item.value) >= 0 }
      });

      return h(
        MenuItem,
        { key: item.value },
        [input, h('span', [item.text])]
      );
    }
  },

  render: function render() {
    var _this5 = this;

    var h = arguments[0];
    var originSelectedKeys = this.$data.sSelectedKeys;
    var column = this.column,
        locale = this.locale,
        prefixCls = this.prefixCls,
        dropdownPrefixCls = this.dropdownPrefixCls,
        getPopupContainer = this.getPopupContainer;
    // default multiple selection in filter dropdown

    var multiple = 'filterMultiple' in column ? column.filterMultiple : true;
    var dropdownMenuClass = classNames(_defineProperty({}, dropdownPrefixCls + '-menu-without-submenu', !this.hasSubMenu()));
    var filterDropdown = column.filterDropdown;

    if (filterDropdown instanceof Function) {
      filterDropdown = filterDropdown({
        prefixCls: dropdownPrefixCls + '-custom',
        setSelectedKeys: function setSelectedKeys(selectedKeys) {
          return _this5.setSelectedKeys({ selectedKeys: selectedKeys });
        },
        selectedKeys: originSelectedKeys,
        confirm: this.handleConfirm,
        clearFilters: this.handleClearFilters,
        filters: column.filters,
        visible: this.getDropdownVisible(),
        column: column
      });
    }

    var menus = filterDropdown ? h(
      FilterDropdownMenuWrapper,
      { 'class': prefixCls + '-dropdown' },
      [filterDropdown]
    ) : h(
      FilterDropdownMenuWrapper,
      { 'class': prefixCls + '-dropdown' },
      [h(
        Menu,
        {
          attrs: {
            multiple: multiple,

            prefixCls: dropdownPrefixCls + '-menu',

            selectedKeys: originSelectedKeys && originSelectedKeys.map(function (val) {
              return val;
            }),
            getPopupContainer: getPopupContainer
          },
          on: {
            'click': this.handleMenuItemClick,
            'select': this.setSelectedKeys,
            'deselect': this.setSelectedKeys
          },
          'class': dropdownMenuClass
        },
        [this.renderMenus(column.filters)]
      ), h(
        'div',
        { 'class': prefixCls + '-dropdown-btns' },
        [h(
          'a',
          { 'class': prefixCls + '-dropdown-link confirm', on: {
              'click': this.handleConfirm
            }
          },
          [locale.filterConfirm]
        ), h(
          'a',
          { 'class': prefixCls + '-dropdown-link clear', on: {
              'click': this.handleClearFilters
            }
          },
          [locale.filterReset]
        )]
      )]
    );

    return h(
      Dropdown,
      {
        attrs: {
          trigger: ['click'],
          placement: 'bottomRight',
          visible: this.getDropdownVisible(),

          getPopupContainer: getPopupContainer,
          forceRender: true
        },
        on: {
          'visibleChange': this.onVisibleChange
        }
      },
      [h(
        'template',
        { slot: 'overlay' },
        [menus]
      ), this.renderFilterIcon()]
    );
  }
};