import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { hasProp, initDefaultProps, getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import classNames from 'classnames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import warning from '../_util/warning';
import Base from '../base';

export var TransferDirection = 'left' | 'right';

export var TransferItem = {
  key: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool
};

export var TransferProps = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  disabled: PropTypes.boolean,
  targetKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
  listStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  operationStyle: PropTypes.object,
  titles: PropTypes.arrayOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.string),
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  locale: PropTypes.object,
  rowKey: PropTypes.func,
  lazy: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showSelectAll: PropTypes.bool
};

export var TransferLocale = {
  titles: PropTypes.arrayOf(PropTypes.string),
  notFoundContent: PropTypes.string,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string
};

var Transfer = {
  name: 'ATransfer',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferProps, {
    dataSource: [],
    locale: {},
    showSearch: false,
    listStyle: function listStyle() {}
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    // vue 中 通过slot，不方便传递，保留notFoundContent及searchPlaceholder
    // warning(
    //   !(getComponentFromProp(this, 'notFoundContent') || hasProp(this, 'searchPlaceholder')),
    //   'Transfer[notFoundContent] and Transfer[searchPlaceholder] will be removed, ' +
    //   'please use Transfer[locale] instead.',
    // )
    var _selectedKeys = this.selectedKeys,
        selectedKeys = _selectedKeys === undefined ? [] : _selectedKeys,
        _targetKeys = this.targetKeys,
        targetKeys = _targetKeys === undefined ? [] : _targetKeys;

    return {
      leftFilter: '',
      rightFilter: '',
      sourceSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) === -1;
      }),
      targetSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) > -1;
      })
    };
  },
  mounted: function mounted() {
    // this.currentProps = { ...this.$props }
  },

  watch: {
    targetKeys: function targetKeys() {
      this.updateState();
      if (this.selectedKeys) {
        var targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(function (key) {
            return !targetKeys.includes(key);
          }),
          targetSelectedKeys: this.selectedKeys.filter(function (key) {
            return targetKeys.includes(key);
          })
        });
      }
    },
    dataSource: function dataSource() {
      this.updateState();
    },
    selectedKeys: function selectedKeys() {
      if (this.selectedKeys) {
        var targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(function (key) {
            return !targetKeys.includes(key);
          }),
          targetSelectedKeys: this.selectedKeys.filter(function (key) {
            return targetKeys.includes(key);
          })
        });
      }
    }
  },
  methods: {
    getSelectedKeysName: function getSelectedKeysName(direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    },
    getTitles: function getTitles(transferLocale) {
      if (this.titles) {
        return this.titles;
      }
      return transferLocale.titles || ['', ''];
    },
    getLocale: function getLocale(transferLocale, renderEmpty) {
      var h = this.$createElement;
      // Keep old locale props still working.
      var oldLocale = {
        notFoundContent: renderEmpty(h, 'Transfer')
      };
      var notFoundContent = getComponentFromProp(this, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (hasProp(this, 'searchPlaceholder')) {
        oldLocale.searchPlaceholder = this.$props.searchPlaceholder;
      }

      return _extends({}, transferLocale, oldLocale, this.$props.locale);
    },
    updateState: function updateState() {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      this.separatedDataSource = null;
      if (!this.selectedKeys) {
        // clear key nolonger existed
        // clear checkedKeys according to targetKeys
        var dataSource = this.dataSource,
            _targetKeys2 = this.targetKeys,
            targetKeys = _targetKeys2 === undefined ? [] : _targetKeys2;


        var newSourceSelectedKeys = [];
        var newTargetSelectedKeys = [];
        dataSource.forEach(function (_ref) {
          var key = _ref.key;

          if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
            newSourceSelectedKeys.push(key);
          }
          if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
            newTargetSelectedKeys.push(key);
          }
        });
        this.setState({
          sourceSelectedKeys: newSourceSelectedKeys,
          targetSelectedKeys: newTargetSelectedKeys
        });
      }
    },
    moveTo: function moveTo(direction) {
      var _$props = this.$props,
          _$props$targetKeys = _$props.targetKeys,
          targetKeys = _$props$targetKeys === undefined ? [] : _$props$targetKeys,
          _$props$dataSource = _$props.dataSource,
          dataSource = _$props$dataSource === undefined ? [] : _$props$dataSource;
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      var moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
      // filter the disabled options
      var newMoveKeys = moveKeys.filter(function (key) {
        return !dataSource.some(function (data) {
          return !!(key === data.key && data.disabled);
        });
      });
      // move items to target box
      var newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(function (targetKey) {
        return newMoveKeys.indexOf(targetKey) === -1;
      });

      // empty checked keys
      var oppositeDirection = direction === 'right' ? 'left' : 'right';
      this.setState(_defineProperty({}, this.getSelectedKeysName(oppositeDirection), []));
      this.handleSelectChange(oppositeDirection, []);

      this.$emit('change', newTargetKeys, direction, newMoveKeys);
    },
    moveToLeft: function moveToLeft() {
      this.moveTo('left');
    },
    moveToRight: function moveToRight() {
      this.moveTo('right');
    },
    onItemSelectAll: function onItemSelectAll(direction, selectedKeys, checkAll) {
      var originalSelectedKeys = this.$data[this.getSelectedKeysName(direction)] || [];

      var mergedCheckedKeys = [];
      if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set([].concat(_toConsumableArray(originalSelectedKeys), _toConsumableArray(selectedKeys))));
      } else {
        // Remove current keys from origin keys
        mergedCheckedKeys = originalSelectedKeys.filter(function (key) {
          return selectedKeys.indexOf(key) === -1;
        });
      }

      this.handleSelectChange(direction, mergedCheckedKeys);

      if (!this.$props.selectedKeys) {
        this.setState(_defineProperty({}, this.getSelectedKeysName(direction), mergedCheckedKeys));
      }
    },
    handleSelectAll: function handleSelectAll(direction, filteredDataSource, checkAll) {
      this.onItemSelectAll(direction, filteredDataSource.map(function (_ref2) {
        var key = _ref2.key;
        return key;
      }), !checkAll);
    },


    // [Legacy] Old prop `body` pass origin check as arg. It's confusing.
    // TODO: Remove this in next version.
    handleLeftSelectAll: function handleLeftSelectAll(filteredDataSource, checkAll) {
      return this.handleSelectAll('left', filteredDataSource, !checkAll);
    },
    handleRightSelectAll: function handleRightSelectAll(filteredDataSource, checkAll) {
      return this.handleSelectAll('right', filteredDataSource, !checkAll);
    },
    onLeftItemSelectAll: function onLeftItemSelectAll(selectedKeys, checkAll) {
      return this.onItemSelectAll('left', selectedKeys, checkAll);
    },
    onRightItemSelectAll: function onRightItemSelectAll(selectedKeys, checkAll) {
      return this.onItemSelectAll('right', selectedKeys, checkAll);
    },
    handleFilter: function handleFilter(direction, e) {
      var value = e.target.value;
      if (getListeners(this).searchChange) {
        warning(false, 'Transfer', '`searchChange` in Transfer is deprecated. Please use `search` instead.');
        this.$emit('searchChange', direction, e);
      }
      this.$emit('search', direction, value);
    },
    handleLeftFilter: function handleLeftFilter(e) {
      this.handleFilter('left', e);
    },
    handleRightFilter: function handleRightFilter(e) {
      this.handleFilter('right', e);
    },
    handleClear: function handleClear(direction) {
      this.$emit('search', direction, '');
    },
    handleLeftClear: function handleLeftClear() {
      this.handleClear('left');
    },
    handleRightClear: function handleRightClear() {
      this.handleClear('right');
    },
    onItemSelect: function onItemSelect(direction, selectedKey, checked) {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      var holder = direction === 'left' ? [].concat(_toConsumableArray(sourceSelectedKeys)) : [].concat(_toConsumableArray(targetSelectedKeys));
      var index = holder.indexOf(selectedKey);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedKey);
      }
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState(_defineProperty({}, this.getSelectedKeysName(direction), holder));
      }
    },
    handleSelect: function handleSelect(direction, selectedItem, checked) {
      warning(false, 'Transfer', '`handleSelect` will be removed, please use `onSelect` instead.');
      this.onItemSelect(direction, selectedItem.key, checked);
    },
    handleLeftSelect: function handleLeftSelect(selectedItem, checked) {
      return this.handleSelect('left', selectedItem, checked);
    },
    handleRightSelect: function handleRightSelect(selectedItem, checked) {
      return this.handleSelect('right', selectedItem, checked);
    },
    onLeftItemSelect: function onLeftItemSelect(selectedKey, checked) {
      return this.onItemSelect('left', selectedKey, checked);
    },
    onRightItemSelect: function onRightItemSelect(selectedKey, checked) {
      return this.onItemSelect('right', selectedKey, checked);
    },
    handleScroll: function handleScroll(direction, e) {
      this.$emit('scroll', direction, e);
    },
    handleLeftScroll: function handleLeftScroll(e) {
      this.handleScroll('left', e);
    },
    handleRightScroll: function handleRightScroll(e) {
      this.handleScroll('right', e);
    },
    handleSelectChange: function handleSelectChange(direction, holder) {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;


      if (direction === 'left') {
        this.$emit('selectChange', holder, targetSelectedKeys);
      } else {
        this.$emit('selectChange', sourceSelectedKeys, holder);
      }
    },
    handleListStyle: function handleListStyle(listStyle, direction) {
      if (typeof listStyle === 'function') {
        return listStyle({ direction: direction });
      }
      return listStyle;
    },
    separateDataSource: function separateDataSource() {
      var _$props2 = this.$props,
          dataSource = _$props2.dataSource,
          rowKey = _$props2.rowKey,
          _$props2$targetKeys = _$props2.targetKeys,
          targetKeys = _$props2$targetKeys === undefined ? [] : _$props2$targetKeys;


      var leftDataSource = [];
      var rightDataSource = new Array(targetKeys.length);
      dataSource.forEach(function (record) {
        if (rowKey) {
          record.key = rowKey(record);
        }

        // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource
        var indexOfKey = targetKeys.indexOf(record.key);
        if (indexOfKey !== -1) {
          rightDataSource[indexOfKey] = record;
        } else {
          leftDataSource.push(record);
        }
      });

      return {
        leftDataSource: leftDataSource,
        rightDataSource: rightDataSource
      };
    },
    renderTransfer: function renderTransfer(transferLocale) {
      var _classNames;

      var h = this.$createElement;

      var props = getOptionProps(this);
      var customizePrefixCls = props.prefixCls,
          disabled = props.disabled,
          _props$operations = props.operations,
          operations = _props$operations === undefined ? [] : _props$operations,
          showSearch = props.showSearch,
          listStyle = props.listStyle,
          operationStyle = props.operationStyle,
          filterOption = props.filterOption,
          lazy = props.lazy,
          showSelectAll = props.showSelectAll;

      var children = getComponentFromProp(this, 'children', {}, false);
      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('transfer', customizePrefixCls);

      var renderEmpty = this.configProvider.renderEmpty;
      var locale = this.getLocale(transferLocale, renderEmpty);
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys,
          $scopedSlots = this.$scopedSlots;
      var body = $scopedSlots.body,
          footer = $scopedSlots.footer;

      var renderItem = props.render;

      var _separateDataSource = this.separateDataSource(),
          leftDataSource = _separateDataSource.leftDataSource,
          rightDataSource = _separateDataSource.rightDataSource;

      var leftActive = targetSelectedKeys.length > 0;
      var rightActive = sourceSelectedKeys.length > 0;

      var cls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-customize-list', !!children), _classNames));
      var titles = this.getTitles(locale);
      return h(
        'div',
        { 'class': cls },
        [h(List, {
          key: 'leftList',
          attrs: { prefixCls: prefixCls + '-list',
            titleText: titles[0],
            dataSource: leftDataSource,
            filterOption: filterOption,

            checkedKeys: sourceSelectedKeys,
            handleFilter: this.handleLeftFilter,
            handleClear: this.handleLeftClear,
            handleSelect: this.handleLeftSelect,
            handleSelectAll: this.handleLeftSelectAll,

            renderItem: renderItem,
            showSearch: showSearch,
            body: body,
            renderList: children,
            footer: footer,
            lazy: lazy,

            disabled: disabled,
            direction: 'left',
            showSelectAll: showSelectAll,
            itemUnit: locale.itemUnit,
            itemsUnit: locale.itemsUnit,
            notFoundContent: locale.notFoundContent,
            searchPlaceholder: locale.searchPlaceholder
          },
          style: this.handleListStyle(listStyle, 'left'), on: {
            'itemSelect': this.onLeftItemSelect,
            'itemSelectAll': this.onLeftItemSelectAll,
            'scroll': this.handleLeftScroll
          }
        }), h(Operation, {
          key: 'operation',
          'class': prefixCls + '-operation',
          attrs: { rightActive: rightActive,
            rightArrowText: operations[0],
            moveToRight: this.moveToRight,
            leftActive: leftActive,
            leftArrowText: operations[1],
            moveToLeft: this.moveToLeft,

            disabled: disabled
          },
          style: operationStyle }), h(List, {
          key: 'rightList',
          attrs: { prefixCls: prefixCls + '-list',
            titleText: titles[1],
            dataSource: rightDataSource,
            filterOption: filterOption,

            checkedKeys: targetSelectedKeys,
            handleFilter: this.handleRightFilter,
            handleClear: this.handleRightClear,
            handleSelect: this.handleRightSelect,
            handleSelectAll: this.handleRightSelectAll,

            renderItem: renderItem,
            showSearch: showSearch,
            body: body,
            renderList: children,
            footer: footer,
            lazy: lazy,

            disabled: disabled,
            direction: 'right',
            showSelectAll: showSelectAll,
            itemUnit: locale.itemUnit,
            itemsUnit: locale.itemsUnit,
            notFoundContent: locale.notFoundContent,
            searchPlaceholder: locale.searchPlaceholder
          },
          style: this.handleListStyle(listStyle, 'right'), on: {
            'itemSelect': this.onRightItemSelect,
            'itemSelectAll': this.onRightItemSelectAll,
            'scroll': this.handleRightScroll
          }
        })]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Transfer',
        defaultLocale: defaultLocale.Transfer
      },
      scopedSlots: { 'default': this.renderTransfer }
    });
  }
};

/* istanbul ignore next */
Transfer.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Transfer.name, Transfer);
};

export default Transfer;