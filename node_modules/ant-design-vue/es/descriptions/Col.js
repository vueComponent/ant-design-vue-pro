import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getSlots, getComponentFromProp } from '../_util/props-util';

var ColProps = {
  child: PropTypes.any,
  bordered: PropTypes.bool,
  colon: PropTypes.bool,
  type: PropTypes.oneOf(['label', 'content']),
  layout: PropTypes.oneOf(['horizontal', 'vertical'])
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

    var _getOptionProps = getOptionProps(child),
        prefixCls = _getOptionProps.prefixCls,
        _getOptionProps$span = _getOptionProps.span,
        span = _getOptionProps$span === undefined ? 1 : _getOptionProps$span;

    var key = ctx.data.key;

    var label = getComponentFromProp(child, 'label');
    var slots = getSlots(child);
    var labelProps = {
      attrs: {},
      'class': [prefixCls + '-item-label', (_ref = {}, _defineProperty(_ref, prefixCls + '-item-colon', colon), _defineProperty(_ref, prefixCls + '-item-no-label', !label), _ref)],
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
            'class': [prefixCls + '-item-label', _defineProperty({}, prefixCls + '-item-colon', colon)],
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

export default Col;