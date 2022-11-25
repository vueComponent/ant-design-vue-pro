'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferLocale = exports.TransferProps = exports.TransferItem = exports.TransferDirection = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default2 = require('../locale-provider/default');

var _default3 = _interopRequireDefault(_default2);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TransferDirection = exports.TransferDirection = 'left' | 'right';

var TransferItem = exports.TransferItem = {
  key: _vueTypes2['default'].string,
  title: _vueTypes2['default'].string,
  description: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool
};

var TransferProps = exports.TransferProps = {
  prefixCls: _vueTypes2['default'].string,
  dataSource: _vueTypes2['default'].arrayOf(_vueTypes2['default'].shape(TransferItem).loose),
  disabled: _vueTypes2['default'].boolean,
  targetKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  render: _vueTypes2['default'].func,
  listStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].object]),
  operationStyle: _vueTypes2['default'].object,
  titles: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  operations: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  showSearch: _vueTypes2['default'].bool,
  filterOption: _vueTypes2['default'].func,
  searchPlaceholder: _vueTypes2['default'].string,
  notFoundContent: _vueTypes2['default'].any,
  locale: _vueTypes2['default'].object,
  rowKey: _vueTypes2['default'].func,
  lazy: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
  showSelectAll: _vueTypes2['default'].bool
};

var TransferLocale = exports.TransferLocale = {
  titles: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  notFoundContent: _vueTypes2['default'].string,
  itemUnit: _vueTypes2['default'].string,
  itemsUnit: _vueTypes2['default'].string
};

var Transfer = {
  name: 'ATransfer',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(TransferProps, {
    dataSource: [],
    locale: {},
    showSearch: false,
    listStyle: function listStyle() {}
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if ((0, _propsUtil.hasProp)(this, 'searchPlaceholder')) {
        oldLocale.searchPlaceholder = this.$props.searchPlaceholder;
      }

      return (0, _extends3['default'])({}, transferLocale, oldLocale, this.$props.locale);
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
      this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(oppositeDirection), []));
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
        mergedCheckedKeys = Array.from(new Set([].concat((0, _toConsumableArray3['default'])(originalSelectedKeys), (0, _toConsumableArray3['default'])(selectedKeys))));
      } else {
        // Remove current keys from origin keys
        mergedCheckedKeys = originalSelectedKeys.filter(function (key) {
          return selectedKeys.indexOf(key) === -1;
        });
      }

      this.handleSelectChange(direction, mergedCheckedKeys);

      if (!this.$props.selectedKeys) {
        this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(direction), mergedCheckedKeys));
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
      if ((0, _propsUtil.getListeners)(this).searchChange) {
        (0, _warning2['default'])(false, 'Transfer', '`searchChange` in Transfer is deprecated. Please use `search` instead.');
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

      var holder = direction === 'left' ? [].concat((0, _toConsumableArray3['default'])(sourceSelectedKeys)) : [].concat((0, _toConsumableArray3['default'])(targetSelectedKeys));
      var index = holder.indexOf(selectedKey);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedKey);
      }
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(direction), holder));
      }
    },
    handleSelect: function handleSelect(direction, selectedItem, checked) {
      (0, _warning2['default'])(false, 'Transfer', '`handleSelect` will be removed, please use `onSelect` instead.');
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

      var props = (0, _propsUtil.getOptionProps)(this);
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

      var children = (0, _propsUtil.getComponentFromProp)(this, 'children', {}, false);
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

      var cls = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-customize-list', !!children), _classNames));
      var titles = this.getTitles(locale);
      return h(
        'div',
        { 'class': cls },
        [h(_list2['default'], {
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
        }), h(_operation2['default'], {
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
          style: operationStyle }), h(_list2['default'], {
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

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Transfer',
        defaultLocale: _default3['default'].Transfer
      },
      scopedSlots: { 'default': this.renderTransfer }
    });
  }
};

/* istanbul ignore next */
Transfer.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Transfer.name, Transfer);
};

exports['default'] = Transfer;