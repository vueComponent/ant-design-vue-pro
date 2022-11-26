'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _dropdown = require('../dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _interface = require('./interface');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var someCheckedNotByDefaultChecked = checkSelection((0, _extends3['default'])({}, props, {
    data: data,
    type: 'some',
    byDefaultChecked: false
  })) && !checkSelection((0, _extends3['default'])({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: false
  }));
  var someCheckedByDefaultChecked = checkSelection((0, _extends3['default'])({}, props, {
    data: data,
    type: 'some',
    byDefaultChecked: true
  })) && !checkSelection((0, _extends3['default'])({}, props, {
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
    return checkSelection((0, _extends3['default'])({}, props, {
      data: data,
      type: 'every',
      byDefaultChecked: false
    }));
  }
  return checkSelection((0, _extends3['default'])({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: false
  })) || checkSelection((0, _extends3['default'])({}, props, {
    data: data,
    type: 'every',
    byDefaultChecked: true
  }));
}

exports['default'] = {
  name: 'SelectionCheckboxAll',
  mixins: [_BaseMixin2['default']],
  props: _interface.SelectionCheckboxAllProps,
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
          _menu2['default'].Item,
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
        _menu2['default'],
        { 'class': selectionPrefixCls + '-menu', attrs: { selectedKeys: [] }
        },
        [this.renderMenus(newSelections)]
      );

      customSelections = newSelections.length > 0 ? h(
        _dropdown2['default'],
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
          [h(_icon2['default'], {
            attrs: { type: 'down' }
          })]
        )]
      ) : null;
    }

    return h(
      'div',
      { 'class': selectionPrefixCls },
      [h(_checkbox2['default'], {
        'class': (0, _classnames2['default'])((0, _defineProperty3['default'])({}, selectionPrefixCls + '-select-all-custom', customSelections)),
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