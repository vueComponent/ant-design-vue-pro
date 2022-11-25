import PropTypes from '../../_util/vue-types';
import ExpandIcon from './ExpandIcon';
import BaseMixin from '../../_util/BaseMixin';

var ExpandableRow = {
  mixins: [BaseMixin],
  name: 'ExpandableRow',
  props: {
    prefixCls: PropTypes.string.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    record: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    indentSize: PropTypes.number,
    needIndentSpaced: PropTypes.bool.isRequired,
    expandRowByClick: PropTypes.bool,
    expandIconAsCell: PropTypes.bool,
    expandIconColumnIndex: PropTypes.number,
    childrenColumnName: PropTypes.string,
    expandedRowRender: PropTypes.func,
    expandIcon: PropTypes.func
    // onExpandedChange: PropTypes.func.isRequired,
    // onRowClick: PropTypes.func,
    // children: PropTypes.func.isRequired,
  },
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  computed: {
    expanded: function expanded() {
      return this.store.expandedRowKeys.includes(this.$props.rowKey);
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.handleDestroy();
  },

  methods: {
    hasExpandIcon: function hasExpandIcon(columnIndex) {
      var _$props = this.$props,
          expandRowByClick = _$props.expandRowByClick,
          expandIcon = _$props.expandIcon;


      if (this.tempExpandIconAsCell || columnIndex !== this.tempExpandIconColumnIndex) {
        return false;
      }

      return !!expandIcon || !expandRowByClick;
    },
    handleExpandChange: function handleExpandChange(record, event) {
      var expanded = this.expanded,
          rowKey = this.rowKey;

      this.__emit('expandedChange', !expanded, record, event, rowKey);
    },
    handleDestroy: function handleDestroy() {
      var rowKey = this.rowKey,
          record = this.record;

      this.__emit('expandedChange', false, record, null, rowKey, true);
    },
    handleRowClick: function handleRowClick(record, index, event) {
      var expandRowByClick = this.expandRowByClick;

      if (expandRowByClick) {
        this.handleExpandChange(record, event);
      }
      this.__emit('rowClick', record, index, event);
    },
    renderExpandIcon: function renderExpandIcon() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          expanded = this.expanded,
          record = this.record,
          needIndentSpaced = this.needIndentSpaced,
          expandIcon = this.expandIcon;

      if (expandIcon) {
        return expandIcon({
          prefixCls: prefixCls,
          expanded: expanded,
          record: record,
          needIndentSpaced: needIndentSpaced,
          expandable: this.expandable,
          onExpand: this.handleExpandChange
        });
      }
      return h(ExpandIcon, {
        attrs: {
          expandable: this.expandable,
          prefixCls: prefixCls,

          needIndentSpaced: needIndentSpaced,
          expanded: expanded,
          record: record
        },
        on: {
          'expand': this.handleExpandChange
        }
      });
    },
    renderExpandIconCell: function renderExpandIconCell(cells) {
      var h = this.$createElement;

      if (!this.tempExpandIconAsCell) {
        return;
      }
      var prefixCls = this.prefixCls;


      cells.push(h(
        'td',
        { 'class': prefixCls + '-expand-icon-cell', key: 'rc-table-expand-icon-cell' },
        [this.renderExpandIcon()]
      ));
    }
  },

  render: function render() {
    var childrenColumnName = this.childrenColumnName,
        expandedRowRender = this.expandedRowRender,
        indentSize = this.indentSize,
        record = this.record,
        fixed = this.fixed,
        $scopedSlots = this.$scopedSlots,
        expanded = this.expanded;


    this.tempExpandIconAsCell = fixed !== 'right' ? this.expandIconAsCell : false;
    this.tempExpandIconColumnIndex = fixed !== 'right' ? this.expandIconColumnIndex : -1;
    var childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);
    var expandableRowProps = {
      props: {
        indentSize: indentSize,
        expanded: expanded, // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
        hasExpandIcon: this.hasExpandIcon,
        renderExpandIcon: this.renderExpandIcon,
        renderExpandIconCell: this.renderExpandIconCell
      },

      on: {
        rowClick: this.handleRowClick
      }
    };

    return $scopedSlots['default'] && $scopedSlots['default'](expandableRowProps);
  }
};

export default ExpandableRow;