import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import VcTable, { INTERNAL_COL_DEFINE } from '../vc-table';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import FilterDropdown from './filterDropdown';
import SelectionBox from './SelectionBox';
import SelectionCheckboxAll from './SelectionCheckboxAll';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import createBodyRow from './createBodyRow';
import { flatArray, treeMap, flatFilter } from './util';
import { initDefaultProps, mergeProps, getOptionProps, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { TableProps } from './interface';
import Pagination from '../pagination';
import Icon from '../icon';
import Spin from '../spin';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import warning from '../_util/warning';
import scrollTo from '../_util/scrollTo';
import TransButton from '../_util/transButton';
import Vue from 'vue';

function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
}

function getRowSelection(props) {
  return props.rowSelection || {};
}

function getColumnKey(column, index) {
  return column.key || column.dataIndex || index;
}

function isSameColumn(a, b) {
  if (a && b && a.key && a.key === b.key) {
    return true;
  }
  return a === b || shallowEqual(a, b, function (value, other) {
    // https://github.com/ant-design/ant-design/issues/12737
    if (typeof value === 'function' && typeof other === 'function') {
      return value === other || value.toString() === other.toString();
    }
    // https://github.com/ant-design/ant-design/issues/19398
    if (Array.isArray(value) && Array.isArray(other)) {
      return value === other || shallowEqual(value, other);
    }
  });
}

var defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop
};

/**
 * Avoid creating new object, so that parent component's shouldComponentUpdate
 * can works appropriately。
 */
var emptyObject = {};

var createComponents = function createComponents() {
  var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var bodyRow = components && components.body && components.body.row;
  return _extends({}, components, {
    body: _extends({}, components.body, {
      row: createBodyRow(bodyRow)
    })
  });
};

function isTheSameComponents() {
  var components1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var components2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return components1 === components2 || ['table', 'header', 'body'].every(function (key) {
    return shallowEqual(components1[key], components2[key]);
  });
}

function getFilteredValueColumns(state, columns) {
  return flatFilter(columns || (state || {}).columns || [], function (column) {
    return typeof column.filteredValue !== 'undefined';
  });
}

function getFiltersFromColumns(state, columns) {
  var filters = {};
  getFilteredValueColumns(state, columns).forEach(function (col) {
    var colKey = getColumnKey(col);
    filters[colKey] = col.filteredValue;
  });
  return filters;
}

function isFiltersChanged(state, filters) {
  if (Object.keys(filters).length !== Object.keys(state.filters).length) {
    return true;
  }
  return Object.keys(filters).some(function (columnKey) {
    return filters[columnKey] !== state.filters[columnKey];
  });
}

export default {
  name: 'Table',
  Column: Column,
  ColumnGroup: ColumnGroup,
  mixins: [BaseMixin],
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  provide: function provide() {
    return {
      store: this.store
    };
  },

  props: initDefaultProps(TableProps, {
    dataSource: [],
    useFixedHeader: false,
    // rowSelection: null,
    size: 'default',
    loading: false,
    bordered: false,
    indentSize: 20,
    locale: {},
    rowKey: 'key',
    showHeader: true,
    sortDirections: ['ascend', 'descend'],
    childrenColumnName: 'children'
  }),

  data: function data() {
    var props = getOptionProps(this);
    warning(!props.expandedRowRender || !('scroll' in props) || !props.scroll.x, '`expandedRowRender` and `scroll` are not compatible. Please use one of them at one time.');
    this.CheckboxPropsCache = {};

    this.store = (this.$root.constructor.observable || Vue.observable)({
      selectedRowKeys: getRowSelection(this.$props).selectedRowKeys || [],
      selectionDirty: false
    });
    return _extends({}, this.getDefaultSortOrder(props.columns || []), {
      // 减少状态
      sFilters: this.getDefaultFilters(props.columns),
      sPagination: this.getDefaultPagination(this.$props),
      pivot: undefined,
      sComponents: createComponents(this.components),
      filterDataCnt: 0
    });
  },

  watch: {
    pagination: {
      handler: function handler(val) {
        this.setState(function (previousState) {
          var newPagination = _extends({}, defaultPagination, previousState.sPagination, val);
          newPagination.current = newPagination.current || 1;
          newPagination.pageSize = newPagination.pageSize || 10;
          return { sPagination: val !== false ? newPagination : emptyObject };
        });
      },

      deep: true
    },
    rowSelection: {
      handler: function handler(val, oldVal) {
        if (val && 'selectedRowKeys' in val) {
          this.store.selectedRowKeys = val.selectedRowKeys || [];
          var rowSelection = this.rowSelection;

          if (rowSelection && val.getCheckboxProps !== rowSelection.getCheckboxProps) {
            this.CheckboxPropsCache = {};
          }
        } else if (oldVal && !val) {
          this.store.selectedRowKeys = [];
        }
      },

      deep: true
    },

    dataSource: function dataSource() {
      this.store.selectionDirty = false;
      this.CheckboxPropsCache = {};
    },
    columns: function columns(val) {
      var filteredValueColumns = getFilteredValueColumns({ columns: val }, val);
      if (filteredValueColumns.length > 0) {
        var filtersFromColumns = getFiltersFromColumns({ columns: val }, val);
        var newFilters = _extends({}, this.sFilters);
        Object.keys(filtersFromColumns).forEach(function (key) {
          newFilters[key] = filtersFromColumns[key];
        });
        if (isFiltersChanged({ filters: this.sFilters }, newFilters)) {
          this.setState({ sFilters: newFilters });
        }
      }
      this.$forceUpdate();
    },

    components: {
      handler: function handler(val, oldVal) {
        if (!isTheSameComponents(val, oldVal)) {
          var components = createComponents(val);
          this.setState({ sComponents: components });
        }
      },

      deep: true
    }
  },
  updated: function updated() {
    var columns = this.columns,
        sortColumn = this.sSortColumn,
        sortOrder = this.sSortOrder;

    if (this.getSortOrderColumns(columns).length > 0) {
      var sortState = this.getSortStateFromColumns(columns);
      if (!isSameColumn(sortState.sSortColumn, sortColumn) || sortState.sSortOrder !== sortOrder) {
        this.setState(sortState);
      }
    }
  },

  methods: {
    getCheckboxPropsByItem: function getCheckboxPropsByItem(item, index) {
      var rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return { props: {} };
      }
      var key = this.getRecordKey(item, index);
      // Cache checkboxProps
      if (!this.CheckboxPropsCache[key]) {
        this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item);
      }
      this.CheckboxPropsCache[key].props = this.CheckboxPropsCache[key].props || {};
      return this.CheckboxPropsCache[key];
    },
    getDefaultSelection: function getDefaultSelection() {
      var _this = this;

      var rowSelection = getRowSelection(this.$props);
      if (!rowSelection.getCheckboxProps) {
        return [];
      }
      return this.getFlatData().filter(function (item, rowIndex) {
        return _this.getCheckboxPropsByItem(item, rowIndex).props.defaultChecked;
      }).map(function (record, rowIndex) {
        return _this.getRecordKey(record, rowIndex);
      });
    },
    getDefaultPagination: function getDefaultPagination(props) {
      var pagination = _typeof(props.pagination) === 'object' ? props.pagination : {};
      var current = void 0;
      if ('current' in pagination) {
        current = pagination.current;
      } else if ('defaultCurrent' in pagination) {
        current = pagination.defaultCurrent;
      }
      var pageSize = void 0;
      if ('pageSize' in pagination) {
        pageSize = pagination.pageSize;
      } else if ('defaultPageSize' in pagination) {
        pageSize = pagination.defaultPageSize;
      }
      return this.hasPagination(props) ? _extends({}, defaultPagination, pagination, {
        current: current || 1,
        pageSize: pageSize || 10
      }) : {};
    },
    getSortOrderColumns: function getSortOrderColumns(columns) {
      return flatFilter(columns || this.columns || [], function (column) {
        return 'sortOrder' in column;
      });
    },
    getDefaultFilters: function getDefaultFilters(columns) {
      var definedFilters = getFiltersFromColumns({ columns: this.columns }, columns);

      var defaultFilteredValueColumns = flatFilter(columns || [], function (column) {
        return typeof column.defaultFilteredValue !== 'undefined';
      });

      var defaultFilters = defaultFilteredValueColumns.reduce(function (soFar, col) {
        var colKey = getColumnKey(col);
        soFar[colKey] = col.defaultFilteredValue;
        return soFar;
      }, {});

      return _extends({}, defaultFilters, definedFilters);
    },
    getDefaultSortOrder: function getDefaultSortOrder(columns) {
      var definedSortState = this.getSortStateFromColumns(columns);

      var defaultSortedColumn = flatFilter(columns || [], function (column) {
        return column.defaultSortOrder != null;
      })[0];

      if (defaultSortedColumn && !definedSortState.sortColumn) {
        return {
          sSortColumn: defaultSortedColumn,
          sSortOrder: defaultSortedColumn.defaultSortOrder
        };
      }

      return definedSortState;
    },
    getSortStateFromColumns: function getSortStateFromColumns(columns) {
      // return first column which sortOrder is not falsy
      var sortedColumn = this.getSortOrderColumns(columns).filter(function (col) {
        return col.sortOrder;
      })[0];

      if (sortedColumn) {
        return {
          sSortColumn: sortedColumn,
          sSortOrder: sortedColumn.sortOrder
        };
      }

      return {
        sSortColumn: null,
        sSortOrder: null
      };
    },
    getMaxCurrent: function getMaxCurrent(total) {
      var _sPagination = this.sPagination,
          current = _sPagination.current,
          pageSize = _sPagination.pageSize;

      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1;
      }
      return current;
    },
    getRecordKey: function getRecordKey(record, index) {
      var rowKey = this.rowKey;

      var recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(recordKey !== undefined, 'Table', 'Each record in dataSource of table should have a unique `key` prop, ' + 'or set `rowKey` of Table to an unique primary key, ');
      return recordKey === undefined ? index : recordKey;
    },
    getSorterFn: function getSorterFn(state) {
      var _ref = state || this.$data,
          sortOrder = _ref.sSortOrder,
          sortColumn = _ref.sSortColumn;

      if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
        return;
      }

      return function (a, b) {
        var result = sortColumn.sorter(a, b, sortOrder);
        if (result !== 0) {
          return sortOrder === 'descend' ? -result : result;
        }
        return 0;
      };
    },
    getCurrentPageData: function getCurrentPageData() {
      var data = this.getLocalData();
      this.filterDataCnt = data.length;
      var current = void 0;
      var pageSize = void 0;
      var sPagination = this.sPagination;
      // 如果没有分页的话，默认全部展示
      if (!this.hasPagination()) {
        pageSize = Number.MAX_VALUE;
        current = 1;
      } else {
        pageSize = sPagination.pageSize;
        current = this.getMaxCurrent(sPagination.total || data.length);
      }

      // 分页
      // ---
      // 当数据量少于等于每页数量时，直接设置数据
      // 否则进行读取分页数据
      if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
        data = data.slice((current - 1) * pageSize, current * pageSize);
      }
      return data;
    },
    getFlatData: function getFlatData() {
      var childrenColumnName = this.$props.childrenColumnName;

      return flatArray(this.getLocalData(null, false), childrenColumnName);
    },
    getFlatCurrentPageData: function getFlatCurrentPageData() {
      var childrenColumnName = this.$props.childrenColumnName;

      return flatArray(this.getCurrentPageData(), childrenColumnName);
    },
    getLocalData: function getLocalData(state) {
      var _this2 = this;

      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var currentState = state || this.$data;
      var filters = currentState.sFilters;
      var dataSource = this.$props.dataSource;

      var data = dataSource || [];
      // 优化本地排序
      data = data.slice(0);
      var sorterFn = this.getSorterFn(currentState);
      if (sorterFn) {
        // 使用新数组，避免改变原数组导致无限循环更新
        // https://github.com/vueComponent/ant-design-vue/issues/2270
        data = this.recursiveSort([].concat(_toConsumableArray(data)), sorterFn);
      }
      // 筛选
      if (filter && filters) {
        Object.keys(filters).forEach(function (columnKey) {
          var col = _this2.findColumn(columnKey);
          if (!col) {
            return;
          }
          var values = filters[columnKey] || [];
          if (values.length === 0) {
            return;
          }
          var onFilter = col.onFilter;
          data = onFilter ? data.filter(function (record) {
            return values.some(function (v) {
              return onFilter(v, record);
            });
          }) : data;
        });
      }
      return data;
    },
    onRow: function onRow(prefixCls, record, index) {
      var customRow = this.customRow;

      var custom = customRow ? customRow(record, index) : {};
      return mergeProps(custom, {
        props: {
          prefixCls: prefixCls,
          store: this.store,
          rowKey: this.getRecordKey(record, index)
        }
      });
    },
    setSelectedRowKeys: function setSelectedRowKeys(selectedRowKeys, selectionInfo) {
      var _this3 = this;

      var selectWay = selectionInfo.selectWay,
          record = selectionInfo.record,
          checked = selectionInfo.checked,
          changeRowKeys = selectionInfo.changeRowKeys,
          nativeEvent = selectionInfo.nativeEvent;

      var rowSelection = getRowSelection(this.$props);
      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.store.selectedRowKeys = selectedRowKeys;
      }
      var data = this.getFlatData();
      if (!rowSelection.onChange && !rowSelection[selectWay]) {
        return;
      }
      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this3.getRecordKey(row, i)) >= 0;
      });
      if (rowSelection.onChange) {
        rowSelection.onChange(selectedRowKeys, selectedRows);
      }
      if (selectWay === 'onSelect' && rowSelection.onSelect) {
        rowSelection.onSelect(record, checked, selectedRows, nativeEvent);
      } else if (selectWay === 'onSelectMultiple' && rowSelection.onSelectMultiple) {
        var changeRows = data.filter(function (row, i) {
          return changeRowKeys.indexOf(_this3.getRecordKey(row, i)) >= 0;
        });
        rowSelection.onSelectMultiple(checked, selectedRows, changeRows);
      } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
        var _changeRows = data.filter(function (row, i) {
          return changeRowKeys.indexOf(_this3.getRecordKey(row, i)) >= 0;
        });
        rowSelection.onSelectAll(checked, selectedRows, _changeRows);
      } else if (selectWay === 'onSelectInvert' && rowSelection.onSelectInvert) {
        rowSelection.onSelectInvert(selectedRowKeys);
      }
    },
    generatePopupContainerFunc: function generatePopupContainerFunc(getPopupContainer) {
      var scroll = this.$props.scroll;

      var table = this.$refs.vcTable;
      if (getPopupContainer) {
        return getPopupContainer;
      }
      // Use undefined to let rc component use default logic.
      return scroll && table ? function () {
        return table.getTableNode();
      } : undefined;
    },
    scrollToFirstRow: function scrollToFirstRow() {
      var _this4 = this;

      var scroll = this.$props.scroll;

      if (scroll && scroll.scrollToFirstRowOnChange !== false) {
        scrollTo(0, {
          getContainer: function getContainer() {
            return _this4.$refs.vcTable.getBodyTable();
          }
        });
      }
    },
    isSameColumn: function isSameColumn(a, b) {
      if (a && b && a.key && a.key === b.key) {
        return true;
      }
      return a === b || shallowEqual(a, b, function (value, other) {
        if (typeof value === 'function' && typeof other === 'function') {
          return value === other || value.toString() === other.toString();
        }
      });
    },
    handleFilter: function handleFilter(column, nextFilters) {
      var _this5 = this;

      var props = this.$props;
      var pagination = _extends({}, this.sPagination);
      var filters = _extends({}, this.sFilters, _defineProperty({}, getColumnKey(column), nextFilters));
      // Remove filters not in current columns
      var currentColumnKeys = [];
      treeMap(this.columns, function (c) {
        if (!c.children) {
          currentColumnKeys.push(getColumnKey(c));
        }
      });
      Object.keys(filters).forEach(function (columnKey) {
        if (currentColumnKeys.indexOf(columnKey) < 0) {
          delete filters[columnKey];
        }
      });

      if (props.pagination) {
        // Reset current prop
        pagination.current = 1;
        pagination.onChange(pagination.current);
      }

      var newState = {
        sPagination: pagination,
        sFilters: {}
      };
      var filtersToSetState = _extends({}, filters);
      // Remove filters which is controlled
      getFilteredValueColumns({ columns: props.columns }).forEach(function (col) {
        var columnKey = getColumnKey(col);
        if (columnKey) {
          delete filtersToSetState[columnKey];
        }
      });
      if (Object.keys(filtersToSetState).length > 0) {
        newState.sFilters = filtersToSetState;
      }

      // Controlled current prop will not respond user interaction
      if (_typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.sPagination = _extends({}, pagination, {
          current: this.sPagination.current
        });
      }

      this.setState(newState, function () {
        _this5.scrollToFirstRow();
        _this5.store.selectionDirty = false;
        _this5.$emit.apply(_this5, ['change'].concat(_toConsumableArray(_this5.prepareParamsArguments(_extends({}, _this5.$data, {
          sSelectionDirty: false,
          sFilters: filters,
          sPagination: pagination
        })))));
      });
    },
    handleSelect: function handleSelect(record, rowIndex, e) {
      var _this6 = this;

      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;
      var defaultSelection = this.store.selectionDirty ? [] : this.getDefaultSelection();
      var selectedRowKeys = this.store.selectedRowKeys.concat(defaultSelection);
      var key = this.getRecordKey(record, rowIndex);
      var pivot = this.$data.pivot;

      var rows = this.getFlatCurrentPageData();
      var realIndex = rowIndex;
      if (this.$props.expandedRowRender) {
        realIndex = rows.findIndex(function (row) {
          return _this6.getRecordKey(row, rowIndex) === key;
        });
      }
      if (nativeEvent.shiftKey && pivot !== undefined && realIndex !== pivot) {
        var changeRowKeys = [];
        var direction = Math.sign(pivot - realIndex);
        var dist = Math.abs(pivot - realIndex);
        var step = 0;

        var _loop = function _loop() {
          var i = realIndex + step * direction;
          step += 1;
          var row = rows[i];
          var rowKey = _this6.getRecordKey(row, i);
          var checkboxProps = _this6.getCheckboxPropsByItem(row, i);
          if (!checkboxProps.disabled) {
            if (selectedRowKeys.includes(rowKey)) {
              if (!checked) {
                selectedRowKeys = selectedRowKeys.filter(function (j) {
                  return rowKey !== j;
                });
                changeRowKeys.push(rowKey);
              }
            } else if (checked) {
              selectedRowKeys.push(rowKey);
              changeRowKeys.push(rowKey);
            }
          }
        };

        while (step <= dist) {
          _loop();
        }

        this.setState({ pivot: realIndex });
        this.store.selectionDirty = true;
        this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelectMultiple',
          record: record,
          checked: checked,
          changeRowKeys: changeRowKeys,
          nativeEvent: nativeEvent
        });
      } else {
        if (checked) {
          selectedRowKeys.push(this.getRecordKey(record, realIndex));
        } else {
          selectedRowKeys = selectedRowKeys.filter(function (i) {
            return key !== i;
          });
        }
        this.setState({ pivot: realIndex });
        this.store.selectionDirty = true;
        this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelect',
          record: record,
          checked: checked,
          changeRowKeys: undefined,
          nativeEvent: nativeEvent
        });
      }
    },
    handleRadioSelect: function handleRadioSelect(record, rowIndex, e) {
      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;
      var key = this.getRecordKey(record, rowIndex);
      var selectedRowKeys = [key];
      this.store.selectionDirty = true;
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record: record,
        checked: checked,
        changeRowKeys: undefined,
        nativeEvent: nativeEvent
      });
    },
    handleSelectRow: function handleSelectRow(selectionKey, index, onSelectFunc) {
      var _this7 = this;

      var data = this.getFlatCurrentPageData();
      var defaultSelection = this.store.selectionDirty ? [] : this.getDefaultSelection();
      var selectedRowKeys = this.store.selectedRowKeys.concat(defaultSelection);
      var changeableRowKeys = data.filter(function (item, i) {
        return !_this7.getCheckboxPropsByItem(item, i).props.disabled;
      }).map(function (item, i) {
        return _this7.getRecordKey(item, i);
      });

      var changeRowKeys = [];
      var selectWay = 'onSelectAll';
      var checked = void 0;
      // handle default selection
      switch (selectionKey) {
        case 'all':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = true;
          break;
        case 'removeAll':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = false;
          break;
        case 'invert':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
            } else {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
            }
            changeRowKeys.push(key);
            selectWay = 'onSelectInvert';
          });
          break;
        default:
          break;
      }

      this.store.selectionDirty = true;
      // when select custom selection, callback selections[n].onSelect
      var rowSelection = this.rowSelection;

      var customSelectionStartIndex = 2;
      if (rowSelection && rowSelection.hideDefaultSelections) {
        customSelectionStartIndex = 0;
      }
      if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
        return onSelectFunc(changeableRowKeys);
      }
      this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: selectWay,
        checked: checked,
        changeRowKeys: changeRowKeys
      });
    },
    handlePageChange: function handlePageChange(current) {
      var props = this.$props;
      var pagination = _extends({}, this.sPagination);
      if (current) {
        pagination.current = current;
      } else {
        pagination.current = pagination.current || 1;
      }

      for (var _len = arguments.length, otherArguments = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherArguments[_key - 1] = arguments[_key];
      }

      pagination.onChange.apply(pagination, [pagination.current].concat(_toConsumableArray(otherArguments)));

      var newState = {
        sPagination: pagination
      };
      // Controlled current prop will not respond user interaction
      if (props.pagination && _typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.sPagination = _extends({}, pagination, {
          current: this.sPagination.current
        });
      }
      this.setState(newState, this.scrollToFirstRow);

      this.store.selectionDirty = false;
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, {
        sSelectionDirty: false,
        sPagination: pagination
      })))));
    },
    handleShowSizeChange: function handleShowSizeChange(current, pageSize) {
      var pagination = this.sPagination;
      pagination.onShowSizeChange(current, pageSize);
      var nextPagination = _extends({}, pagination, {
        pageSize: pageSize,
        current: current
      });
      this.setState({ sPagination: nextPagination }, this.scrollToFirstRow);
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, {
        sPagination: nextPagination
      })))));
    },
    toggleSortOrder: function toggleSortOrder(column) {
      var sortDirections = column.sortDirections || this.sortDirections;
      var sortOrder = this.sSortOrder,
          sortColumn = this.sSortColumn;
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题

      var newSortOrder = void 0;
      // 切换另一列时，丢弃 sortOrder 的状态
      if (isSameColumn(sortColumn, column) && sortOrder !== undefined) {
        // 按照sortDirections的内容依次切换排序状态
        var methodIndex = sortDirections.indexOf(sortOrder) + 1;
        newSortOrder = methodIndex === sortDirections.length ? undefined : sortDirections[methodIndex];
      } else {
        newSortOrder = sortDirections[0];
      }
      var newState = {
        sSortOrder: newSortOrder,
        sSortColumn: newSortOrder ? column : null
      };

      // Controlled
      if (this.getSortOrderColumns().length === 0) {
        this.setState(newState, this.scrollToFirstRow);
      }
      this.$emit.apply(this, ['change'].concat(_toConsumableArray(this.prepareParamsArguments(_extends({}, this.$data, newState), column))));
    },
    hasPagination: function hasPagination(props) {
      return (props || this.$props).pagination !== false;
    },
    isSortColumn: function isSortColumn(column) {
      var sortColumn = this.sSortColumn;

      if (!column || !sortColumn) {
        return false;
      }
      return getColumnKey(sortColumn) === getColumnKey(column);
    },


    // Get pagination, filters, sorter
    prepareParamsArguments: function prepareParamsArguments(state, column) {
      var pagination = _extends({}, state.sPagination);
      // remove useless handle function in Table.onChange
      delete pagination.onChange;
      delete pagination.onShowSizeChange;
      var filters = state.sFilters;
      var sorter = {};
      var currentColumn = column;
      if (state.sSortColumn && state.sSortOrder) {
        currentColumn = state.sSortColumn;
        sorter.column = state.sSortColumn;
        sorter.order = state.sSortOrder;
      }

      if (currentColumn) {
        sorter.field = currentColumn.dataIndex;
        sorter.columnKey = getColumnKey(currentColumn);
      }

      var extra = {
        currentDataSource: this.getLocalData(state)
      };

      return [pagination, filters, sorter, extra];
    },
    findColumn: function findColumn(myKey) {
      var column = void 0;
      treeMap(this.columns, function (c) {
        if (getColumnKey(c) === myKey) {
          column = c;
        }
      });
      return column;
    },
    recursiveSort: function recursiveSort(data, sorterFn) {
      var _this8 = this;

      var _childrenColumnName = this.childrenColumnName,
          childrenColumnName = _childrenColumnName === undefined ? 'children' : _childrenColumnName;

      return data.sort(sorterFn).map(function (item) {
        return item[childrenColumnName] ? _extends({}, item, _defineProperty({}, childrenColumnName, _this8.recursiveSort([].concat(_toConsumableArray(item[childrenColumnName])), sorterFn))) : item;
      });
    },
    renderExpandIcon: function renderExpandIcon(prefixCls) {
      var h = this.$createElement;

      return function (_ref2) {
        var expandable = _ref2.expandable,
            expanded = _ref2.expanded,
            needIndentSpaced = _ref2.needIndentSpaced,
            record = _ref2.record,
            onExpand = _ref2.onExpand;

        if (expandable) {
          return h(
            LocaleReceiver,
            {
              attrs: { componentName: 'Table', defaultLocale: defaultLocale.Table }
            },
            [function (locale) {
              var _classNames;

              return h(TransButton, {
                'class': classNames(prefixCls + '-row-expand-icon', (_classNames = {}, _defineProperty(_classNames, prefixCls + '-row-collapsed', !expanded), _defineProperty(_classNames, prefixCls + '-row-expanded', expanded), _classNames)),
                on: {
                  'click': function click(event) {
                    onExpand(record, event);
                  }
                },
                attrs: {
                  'aria-label': expanded ? locale.collapse : locale.expand,
                  noStyle: true
                }
              });
            }]
          );
        }

        if (needIndentSpaced) {
          return h('span', { 'class': prefixCls + '-row-expand-icon ' + prefixCls + '-row-spaced' });
        }

        return null;
      };
    },
    renderPagination: function renderPagination(prefixCls, paginationPosition) {
      var h = this.$createElement;

      // 强制不需要分页
      if (!this.hasPagination()) {
        return null;
      }
      var size = 'default';
      var pagination = this.sPagination;

      if (pagination.size) {
        size = pagination.size;
      } else if (this.size === 'middle' || this.size === 'small') {
        size = 'small';
      }
      var position = pagination.position || 'bottom';
      var total = pagination.total || this.filterDataCnt;

      var cls = pagination['class'],
          style = pagination.style,
          onChange = pagination.onChange,
          onShowSizeChange = pagination.onShowSizeChange,
          restProps = _objectWithoutProperties(pagination, ['class', 'style', 'onChange', 'onShowSizeChange']); // eslint-disable-line


      var paginationProps = mergeProps({
        key: 'pagination-' + paginationPosition,
        'class': classNames(cls, prefixCls + '-pagination'),
        props: _extends({}, restProps, {
          total: total,
          size: size,
          current: this.getMaxCurrent(total)
        }),
        style: style,
        on: {
          change: this.handlePageChange,
          showSizeChange: this.handleShowSizeChange
        }
      });
      return total > 0 && (position === paginationPosition || position === 'both') ? h(Pagination, paginationProps) : null;
    },
    renderSelectionBox: function renderSelectionBox(type) {
      var _this9 = this;

      var h = this.$createElement;

      return function (_, record, index) {
        var rowKey = _this9.getRecordKey(record, index); // 从 1 开始
        var props = _this9.getCheckboxPropsByItem(record, index);
        var handleChange = function handleChange(e) {
          type === 'radio' ? _this9.handleRadioSelect(record, index, e) : _this9.handleSelect(record, index, e);
        };
        var selectionBoxProps = mergeProps({
          props: {
            type: type,
            store: _this9.store,
            rowIndex: rowKey,
            defaultSelection: _this9.getDefaultSelection()
          },
          on: {
            change: handleChange
          }
        }, props);

        return h(
          'span',
          {
            on: {
              'click': stopPropagation
            }
          },
          [h(SelectionBox, selectionBoxProps)]
        );
      };
    },
    renderRowSelection: function renderRowSelection(_ref3) {
      var _this10 = this;

      var prefixCls = _ref3.prefixCls,
          locale = _ref3.locale,
          getPopupContainer = _ref3.getPopupContainer;
      var h = this.$createElement;
      var rowSelection = this.rowSelection;

      var columns = this.columns.concat();
      if (rowSelection) {
        var data = this.getFlatCurrentPageData().filter(function (item, index) {
          if (rowSelection.getCheckboxProps) {
            return !_this10.getCheckboxPropsByItem(item, index).props.disabled;
          }
          return true;
        });
        var selectionColumnClass = classNames(prefixCls + '-selection-column', _defineProperty({}, prefixCls + '-selection-column-custom', rowSelection.selections));
        var selectionColumn = _defineProperty({
          key: 'selection-column',
          customRender: this.renderSelectionBox(rowSelection.type),
          className: selectionColumnClass,
          fixed: rowSelection.fixed,
          width: rowSelection.columnWidth,
          title: rowSelection.columnTitle
        }, INTERNAL_COL_DEFINE, {
          'class': prefixCls + '-selection-col'
        });
        if (rowSelection.type !== 'radio') {
          var checkboxAllDisabled = data.every(function (item, index) {
            return _this10.getCheckboxPropsByItem(item, index).props.disabled;
          });
          selectionColumn.title = selectionColumn.title || h(SelectionCheckboxAll, {
            attrs: {
              store: this.store,
              locale: locale,
              data: data,
              getCheckboxPropsByItem: this.getCheckboxPropsByItem,
              getRecordKey: this.getRecordKey,
              disabled: checkboxAllDisabled,
              prefixCls: prefixCls,

              selections: rowSelection.selections,
              hideDefaultSelections: rowSelection.hideDefaultSelections,
              getPopupContainer: this.generatePopupContainerFunc(getPopupContainer)
            },
            on: {
              'select': this.handleSelectRow
            }
          });
        }
        if ('fixed' in rowSelection) {
          selectionColumn.fixed = rowSelection.fixed;
        } else if (columns.some(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        })) {
          selectionColumn.fixed = 'left';
        }
        if (columns[0] && columns[0].key === 'selection-column') {
          columns[0] = selectionColumn;
        } else {
          columns.unshift(selectionColumn);
        }
      }
      return columns;
    },
    renderColumnsDropdown: function renderColumnsDropdown(_ref4) {
      var _this11 = this;

      var prefixCls = _ref4.prefixCls,
          dropdownPrefixCls = _ref4.dropdownPrefixCls,
          columns = _ref4.columns,
          locale = _ref4.locale,
          getPopupContainer = _ref4.getPopupContainer;
      var h = this.$createElement;
      var sortOrder = this.sSortOrder,
          filters = this.sFilters;

      return treeMap(columns, function (column, i) {
        var _classNames3;

        var key = getColumnKey(column, i);
        var filterDropdown = void 0;
        var sortButton = void 0;
        var customHeaderCell = column.customHeaderCell;
        var isSortColumn = _this11.isSortColumn(column);
        if (column.filters && column.filters.length > 0 || column.filterDropdown) {
          var colFilters = key in filters ? filters[key] : [];
          filterDropdown = h(FilterDropdown, {
            attrs: {
              _propsSymbol: Symbol(),
              locale: locale,
              column: column,
              selectedKeys: colFilters,
              confirmFilter: _this11.handleFilter,
              prefixCls: prefixCls + '-filter',
              dropdownPrefixCls: dropdownPrefixCls || 'ant-dropdown',
              getPopupContainer: _this11.generatePopupContainerFunc(getPopupContainer)
            },
            key: 'filter-dropdown'
          });
        }
        if (column.sorter) {
          var sortDirections = column.sortDirections || _this11.sortDirections;
          var isAscend = isSortColumn && sortOrder === 'ascend';
          var isDescend = isSortColumn && sortOrder === 'descend';
          var ascend = sortDirections.indexOf('ascend') !== -1 && h(Icon, {
            'class': prefixCls + '-column-sorter-up ' + (isAscend ? 'on' : 'off'),
            attrs: { type: 'caret-up',
              theme: 'filled'
            },
            key: 'caret-up'
          });

          var descend = sortDirections.indexOf('descend') !== -1 && h(Icon, {
            'class': prefixCls + '-column-sorter-down ' + (isDescend ? 'on' : 'off'),
            attrs: { type: 'caret-down',
              theme: 'filled'
            },
            key: 'caret-down'
          });

          sortButton = h(
            'div',
            {
              attrs: {
                title: locale.sortTitle
              },
              'class': classNames(prefixCls + '-column-sorter-inner', ascend && descend && prefixCls + '-column-sorter-inner-full'),
              key: 'sorter'
            },
            [ascend, descend]
          );
          customHeaderCell = function customHeaderCell(col) {
            var colProps = {};
            // Get original first
            if (column.customHeaderCell) {
              colProps = _extends({}, column.customHeaderCell(col));
            }
            colProps.on = colProps.on || {};
            // Add sorter logic
            var onHeaderCellClick = colProps.on.click;
            colProps.on.click = function () {
              _this11.toggleSortOrder(column);
              if (onHeaderCellClick) {
                onHeaderCellClick.apply(undefined, arguments);
              }
            };
            return colProps;
          };
        }
        return _extends({}, column, {
          className: classNames(column.className, (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-column-has-actions', sortButton || filterDropdown), _defineProperty(_classNames3, prefixCls + '-column-has-filters', filterDropdown), _defineProperty(_classNames3, prefixCls + '-column-has-sorters', sortButton), _defineProperty(_classNames3, prefixCls + '-column-sort', isSortColumn && sortOrder), _classNames3)),
          title: [h(
            'span',
            { key: 'title', 'class': prefixCls + '-header-column' },
            [h(
              'div',
              { 'class': sortButton ? prefixCls + '-column-sorters' : undefined },
              [h(
                'span',
                { 'class': prefixCls + '-column-title' },
                [_this11.renderColumnTitle(column.title)]
              ), h(
                'span',
                { 'class': prefixCls + '-column-sorter' },
                [sortButton]
              )]
            )]
          ), filterDropdown],
          customHeaderCell: customHeaderCell
        });
      });
    },
    renderColumnTitle: function renderColumnTitle(title) {
      var _$data = this.$data,
          filters = _$data.sFilters,
          sortOrder = _$data.sSortOrder,
          sortColumn = _$data.sSortColumn;
      // https://github.com/ant-design/ant-design/issues/11246#issuecomment-405009167

      if (title instanceof Function) {
        return title({
          filters: filters,
          sortOrder: sortOrder,
          sortColumn: sortColumn
        });
      }
      return title;
    },
    renderTable: function renderTable(_ref5) {
      var _classNames4,
          _this12 = this;

      var prefixCls = _ref5.prefixCls,
          renderEmpty = _ref5.renderEmpty,
          dropdownPrefixCls = _ref5.dropdownPrefixCls,
          contextLocale = _ref5.contextLocale,
          contextGetPopupContainer = _ref5.getPopupContainer,
          transformCellText = _ref5.transformCellText;
      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          showHeader = _getOptionProps.showHeader,
          locale = _getOptionProps.locale,
          getPopupContainer = _getOptionProps.getPopupContainer,
          expandIcon = _getOptionProps.expandIcon,
          restProps = _objectWithoutProperties(_getOptionProps, ['showHeader', 'locale', 'getPopupContainer', 'expandIcon']);

      var data = this.getCurrentPageData();
      var expandIconAsCell = this.expandedRowRender && this.expandIconAsCell !== false;

      // use props.getPopupContainer first
      var realGetPopupContainer = getPopupContainer || contextGetPopupContainer;

      // Merge too locales
      var mergedLocale = _extends({}, contextLocale, locale);
      if (!locale || !locale.emptyText) {
        mergedLocale.emptyText = renderEmpty(h, 'Table');
      }

      var classString = classNames((_classNames4 = {}, _defineProperty(_classNames4, prefixCls + '-' + this.size, true), _defineProperty(_classNames4, prefixCls + '-bordered', this.bordered), _defineProperty(_classNames4, prefixCls + '-empty', !data.length), _defineProperty(_classNames4, prefixCls + '-without-column-header', !showHeader), _classNames4));

      var columnsWithRowSelection = this.renderRowSelection({
        prefixCls: prefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer
      });
      var columns = this.renderColumnsDropdown({
        columns: columnsWithRowSelection,
        prefixCls: prefixCls,
        dropdownPrefixCls: dropdownPrefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer
      }).map(function (column, i) {
        var newColumn = _extends({}, column);
        newColumn.key = getColumnKey(newColumn, i);
        return newColumn;
      });

      var expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;
      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex;
      }
      var vcTableProps = {
        key: 'table',
        props: _extends({
          expandIcon: expandIcon || this.renderExpandIcon(prefixCls)
        }, restProps, {
          customRow: function customRow(record, index) {
            return _this12.onRow(prefixCls, record, index);
          },
          components: this.sComponents,
          prefixCls: prefixCls,
          data: data,
          columns: columns,
          showHeader: showHeader,
          expandIconColumnIndex: expandIconColumnIndex,
          expandIconAsCell: expandIconAsCell,
          emptyText: mergedLocale.emptyText,
          transformCellText: transformCellText
        }),
        on: getListeners(this),
        'class': classString,
        ref: 'vcTable'
      };
      return h(VcTable, vcTableProps);
    }
  },

  render: function render() {
    var _this13 = this;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        customizeDropdownPrefixCls = this.dropdownPrefixCls,
        customizeTransformCellText = this.transformCellText;

    var data = this.getCurrentPageData();
    var _configProvider = this.configProvider,
        getContextPopupContainer = _configProvider.getPopupContainer,
        tct = _configProvider.transformCellText;

    var getPopupContainer = this.getPopupContainer || getContextPopupContainer;
    var transformCellText = customizeTransformCellText || tct;
    var loading = this.loading;
    if (typeof loading === 'boolean') {
      loading = {
        props: {
          spinning: loading
        }
      };
    } else {
      loading = {
        props: _extends({}, loading)
      };
    }
    var getPrefixCls = this.configProvider.getPrefixCls;
    var renderEmpty = this.configProvider.renderEmpty;

    var prefixCls = getPrefixCls('table', customizePrefixCls);
    var dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

    var table = h(LocaleReceiver, {
      attrs: {
        componentName: 'Table',
        defaultLocale: defaultLocale.Table,
        children: function children(locale) {
          return _this13.renderTable({
            prefixCls: prefixCls,
            renderEmpty: renderEmpty,
            dropdownPrefixCls: dropdownPrefixCls,
            contextLocale: locale,
            getPopupContainer: getPopupContainer,
            transformCellText: transformCellText
          });
        }
      }
    });

    // if there is no pagination or no data,
    // the height of spin should decrease by half of pagination
    var paginationPatchClass = this.hasPagination() && data && data.length !== 0 ? prefixCls + '-with-pagination' : prefixCls + '-without-pagination';
    var spinProps = _extends({}, loading, {
      'class': loading.props && loading.props.spinning ? paginationPatchClass + ' ' + prefixCls + '-spin-holder' : ''
    });
    return h(
      'div',
      { 'class': classNames(prefixCls + '-wrapper') },
      [h(
        Spin,
        spinProps,
        [this.renderPagination(prefixCls, 'top'), table, this.renderPagination(prefixCls, 'bottom')]
      )]
    );
  }
};