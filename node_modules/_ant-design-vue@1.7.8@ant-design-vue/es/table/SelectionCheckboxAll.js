import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import Checkbox from '../checkbox';
import Dropdown from '../dropdown';
import Menu from '../menu';
import Icon from '../icon';
import classNames from 'classnames';
import { SelectionCheckboxAllProps } from './interface';
import BaseMixin from '../_util/BaseMixin';

function checkSelection(_ref) {
  var store = _ref.store,
      getCheckboxPropsByItem = _ref.getCheckboxPropsByItem,
      getRecordKey = _ref.getRecordKey,
      data = _ref.data,
      type = _ref.type,
      byDefaultChecked = _ref.byDefaultChecked;

  return byDefaultChecked ? data[type](function (item, i) {
    return getCheckboxPropsByItem(item, i).defaultChecked;
  }) : data[type](function (item, i) {
    return store.selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0;
  });
}

function getIndeterminateState(props) {
  var store = props.store,
      data = props.data;

  if (!data.length) {
    return false;
  }

  var someCheckedNotByDefaultChecked = checkSelection(_extends({}, props, {
    data: data,
    type: 'some',
    byDefaultChecked: false
  })) && !checkSelection(_extends({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: false
  }));
  var someCheckedByDefaultChecked = checkSelection(_extends({}, props, {
    data: data,
    type: 'some',
    byDefaultChecked: true
  })) && !checkSelection(_extends({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: true
  }));

  if (store.selectionDirty) {
    return someCheckedNotByDefaultChecked;
  }
  return someCheckedNotByDefaultChecked || someCheckedByDefaultChecked;
}

function getCheckState(props) {
  var store = props.store,
      data = props.data;

  if (!data.length) {
    return false;
  }
  if (store.selectionDirty) {
    return checkSelection(_extends({}, props, {
      data: data,
      type: 'every',
      byDefaultChecked: false
    }));
  }
  return checkSelection(_extends({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: false
  })) || checkSelection(_extends({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: true
  }));
}

export default {
  name: 'SelectionCheckboxAll',
  mixins: [BaseMixin],
  props: SelectionCheckboxAllProps,
  data: function data() {
    var props = this.$props;

    this.defaultSelections = props.hideDefaultSelections ? [] : [{
      key: 'all',
      text: props.locale.selectAll
    }, {
      key: 'invert',
      text: props.locale.selectInvert
    }];
    return {
      checked: getCheckState(props),
      indeterminate: getIndeterminateState(props)
    };
  },


  watch: {
    $props: {
      handler: function handler() {
        this.setCheckState(this.$props);
      },

      deep: true,
      immediate: true
    }
  },

  methods: {
    checkSelection: function checkSelection(props, data, type, byDefaultChecked) {
      var _ref2 = props || this.$props,
          store = _ref2.store,
          getCheckboxPropsByItem = _ref2.getCheckboxPropsByItem,
          getRecordKey = _ref2.getRecordKey;
      // type should be 'every' | 'some'


      if (type === 'every' || type === 'some') {
        return byDefaultChecked ? data[type](function (item, i) {
          return getCheckboxPropsByItem(item, i).props.defaultChecked;
        }) : data[type](function (item, i) {
          return store.selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0;
        });
      }
      return false;
    },
    setCheckState: function setCheckState(props) {
      var checked = getCheckState(props);
      var indeterminate = getIndeterminateState(props);
      this.setState(function (prevState) {
        var newState = {};
        if (indeterminate !== prevState.indeterminate) {
          newState.indeterminate = indeterminate;
        }
        if (checked !== prevState.checked) {
          newState.checked = checked;
        }
        return newState;
      });
    },
    handleSelectAllChange: function handleSelectAllChange(e) {
      var checked = e.target.checked;

      this.$emit('select', checked ? 'all' : 'removeAll', 0, null);
    },
    renderMenus: function renderMenus(selections) {
      var _this = this;

      var h = this.$createElement;

      return selections.map(function (selection, index) {
        return h(
          Menu.Item,
          { key: selection.key || index },
          [h(
            'div',
            {
              on: {
                'click': function click() {
                  _this.$emit('select', selection.key, index, selection.onSelect);
                }
              }
            },
            [selection.text]
          )]
        );
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var disabled = this.disabled,
        prefixCls = this.prefixCls,
        selections = this.selections,
        getPopupContainer = this.getPopupContainer,
        checked = this.checked,
        indeterminate = this.indeterminate;


    var selectionPrefixCls = prefixCls + '-selection';

    var customSelections = null;

    if (selections) {
      var newSelections = Array.isArray(selections) ? this.defaultSelections.concat(selections) : this.defaultSelections;

      var menu = h(
        Menu,
        { 'class': selectionPrefixCls + '-menu', attrs: { selectedKeys: [] }
        },
        [this.renderMenus(newSelections)]
      );

      customSelections = newSelections.length > 0 ? h(
        Dropdown,
        {
          attrs: { getPopupContainer: getPopupContainer }
        },
        [h(
          'template',
          { slot: 'overlay' },
          [menu]
        ), h(
          'div',
          { 'class': selectionPrefixCls + '-down' },
          [h(Icon, {
            attrs: { type: 'down' }
          })]
        )]
      ) : null;
    }

    return h(
      'div',
      { 'class': selectionPrefixCls },
      [h(Checkbox, {
        'class': classNames(_defineProperty({}, selectionPrefixCls + '-select-all-custom', customSelections)),
        attrs: { checked: checked,
          indeterminate: indeterminate,
          disabled: disabled
        },
        on: {
          'change': this.handleSelectAllChange
        }
      }), customSelections]
    );
  }
};