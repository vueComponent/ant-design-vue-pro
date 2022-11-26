'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable */
var Track = {
  functional: true,
  render: function render(h, context) {
    var _ref, _ref2;

    var _context$props = context.props,
        included = _context$props.included,
        vertical = _context$props.vertical,
        offset = _context$props.offset,
        length = _context$props.length,
        reverse = _context$props.reverse;
    var _context$data = context.data,
        style = _context$data.style,
        className = _context$data['class'];


    var positonStyle = vertical ? (_ref = {}, (0, _defineProperty3['default'])(_ref, reverse ? 'top' : 'bottom', offset + '%'), (0, _defineProperty3['default'])(_ref, reverse ? 'bottom' : 'top', 'auto'), (0, _defineProperty3['default'])(_ref, 'height', length + '%'), _ref) : (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, reverse ? 'right' : 'left', offset + '%'), (0, _defineProperty3['default'])(_ref2, reverse ? 'left' : 'right', 'auto'), (0, _defineProperty3['default'])(_ref2, 'width', length + '%'), _ref2);

    var elStyle = (0, _extends3['default'])({}, style, positonStyle);
    return included ? h('div', { 'class': className, style: elStyle }) : null;
  }
};

exports['default'] = Track;