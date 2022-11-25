'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

var _interface = require('./interface');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'SelectionBox',
  mixins: [_BaseMixin2['default']],
  props: _interface.SelectionBoxProps,
  computed: {
    checked: function checked() {
      var _$props = this.$props,
          store = _$props.store,
          defaultSelection = _$props.defaultSelection,
          rowIndex = _$props.rowIndex;

      var checked = false;
      if (store.selectionDirty) {
        checked = store.selectedRowKeys.indexOf(rowIndex) >= 0;
      } else {
        checked = store.selectedRowKeys.indexOf(rowIndex) >= 0 || defaultSelection.indexOf(rowIndex) >= 0;
      }
      return checked;
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        type = _getOptionProps.type,
        rowIndex = _getOptionProps.rowIndex,
        rest = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['type', 'rowIndex']);

    var checked = this.checked;

    var checkboxProps = {
      props: (0, _extends3['default'])({
        checked: checked
      }, rest),
      on: (0, _propsUtil.getListeners)(this)
    };
    if (type === 'radio') {
      checkboxProps.props.value = rowIndex;
      return h(_radio2['default'], checkboxProps);
    }
    return h(_checkbox2['default'], checkboxProps);
  }
};