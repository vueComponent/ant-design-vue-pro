'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ColProps = {
  child: _vueTypes2['default'].any,
  bordered: _vueTypes2['default'].bool,
  colon: _vueTypes2['default'].bool,
  type: _vueTypes2['default'].oneOf(['label', 'content']),
  layout: _vueTypes2['default'].oneOf(['horizontal', 'vertical'])
};

var Col = {
  functional: true,
  props: ColProps,
  render: function render(h, ctx) {
    var _ref;

    var _ctx$props = ctx.props,
        child = _ctx$props.child,
        bordered = _ctx$props.bordered,
        colon = _ctx$props.colon,
        type = _ctx$props.type,
        layout = _ctx$props.layout;

    var _getOptionProps = (0, _propsUtil.getOptionProps)(child),
        prefixCls = _getOptionProps.prefixCls,
        _getOptionProps$span = _getOptionProps.span,
        span = _getOptionProps$span === undefined ? 1 : _getOptionProps$span;

    var key = ctx.data.key;

    var label = (0, _propsUtil.getComponentFromProp)(child, 'label');
    var slots = (0, _propsUtil.getSlots)(child);
    var labelProps = {
      attrs: {},
      'class': [prefixCls + '-item-label', (_ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls + '-item-colon', colon), (0, _defineProperty3['default'])(_ref, prefixCls + '-item-no-label', !label), _ref)],
      key: key + '-label'
    };
    if (layout === 'vertical') {
      labelProps.attrs.colSpan = span * 2 - 1;
    }

    if (bordered) {
      if (type === 'label') {
        return h(
          'th',
          labelProps,
          [label]
        );
      }
      return h(
        'td',
        { 'class': prefixCls + '-item-content', key: key + '-content', attrs: { colSpan: span * 2 - 1 }
        },
        [slots['default']]
      );
    }
    if (layout === 'vertical') {
      if (type === 'content') {
        return h(
          'td',
          {
            attrs: { colSpan: span },
            'class': prefixCls + '-item' },
          [h(
            'span',
            { 'class': prefixCls + '-item-content', key: key + '-content' },
            [slots['default']]
          )]
        );
      }
      return h(
        'td',
        {
          attrs: { colSpan: span },
          'class': prefixCls + '-item' },
        [h(
          'span',
          {
            'class': [prefixCls + '-item-label', (0, _defineProperty3['default'])({}, prefixCls + '-item-colon', colon)],
            key: key + '-label'
          },
          [label]
        )]
      );
    }
    return h(
      'td',
      {
        attrs: { colSpan: span },
        'class': prefixCls + '-item' },
      [h(
        'span',
        labelProps,
        [label]
      ), h(
        'span',
        { 'class': prefixCls + '-item-content', key: key + '-content' },
        [slots['default']]
      )]
    );
  }
};

exports['default'] = Col;