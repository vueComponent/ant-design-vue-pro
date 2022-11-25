'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _padEnd = require('lodash/padEnd');

var _padEnd2 = _interopRequireDefault(_padEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AStatisticNumber',
  functional: true,
  render: function render(h, context) {
    var _context$props = context.props,
        value = _context$props.value,
        formatter = _context$props.formatter,
        precision = _context$props.precision,
        decimalSeparator = _context$props.decimalSeparator,
        _context$props$groupS = _context$props.groupSeparator,
        groupSeparator = _context$props$groupS === undefined ? '' : _context$props$groupS,
        prefixCls = _context$props.prefixCls;

    var valueNode = void 0;

    if (typeof formatter === 'function') {
      // Customize formatter
      valueNode = formatter({ value: value, h: h });
    } else {
      // Internal formatter
      var val = String(value);
      var cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
      // Process if illegal number
      if (!cells) {
        valueNode = val;
      } else {
        var negative = cells[1];
        var int = cells[2] || '0';
        var decimal = cells[4] || '';

        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
        if (typeof precision === 'number') {
          decimal = (0, _padEnd2['default'])(decimal, precision, '0').slice(0, precision);
        }

        if (decimal) {
          decimal = '' + decimalSeparator + decimal;
        }

        valueNode = [h(
          'span',
          { key: 'int', 'class': prefixCls + '-content-value-int' },
          [negative, int]
        ), decimal && h(
          'span',
          { key: 'decimal', 'class': prefixCls + '-content-value-decimal' },
          [decimal]
        )];
      }
    }

    return h(
      'span',
      { 'class': prefixCls + '-content-value' },
      [valueNode]
    );
  }
};