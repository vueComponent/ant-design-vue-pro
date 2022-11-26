import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getOptionProps, getListeners } from '../_util/props-util';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var PaginationProps = function PaginationProps() {
  return {
    total: PropTypes.number,
    defaultCurrent: PropTypes.number,
    disabled: PropTypes.bool,
    current: PropTypes.number,
    defaultPageSize: PropTypes.number,
    pageSize: PropTypes.number,
    hideOnSinglePage: PropTypes.bool,
    showSizeChanger: PropTypes.bool,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    buildOptionText: PropTypes.func,
    showSizeChange: PropTypes.func,
    showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    showTotal: PropTypes.any,
    size: PropTypes.string,
    simple: PropTypes.bool,
    locale: PropTypes.object,
    prefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    itemRender: PropTypes.any,
    role: PropTypes.string,
    showLessItems: PropTypes.bool
  };
};

export var PaginationConfig = function PaginationConfig() {
  return _extends({}, PaginationProps(), {
    position: PropTypes.oneOf(['top', 'bottom', 'both'])
  });
};

export default {
  name: 'APagination',
  model: {
    prop: 'current',
    event: 'change.current'
  },
  props: _extends({}, PaginationProps()),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    getIconsProps: function getIconsProps(prefixCls) {
      var h = this.$createElement;

      var prevIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(Icon, {
          attrs: { type: 'left' }
        })]
      );
      var nextIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(Icon, {
          attrs: { type: 'right' }
        })]
      );
      var jumpPrevIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(
          'div',
          { 'class': prefixCls + '-item-container' },
          [h(Icon, { 'class': prefixCls + '-item-link-icon', attrs: { type: 'double-left' }
          }), h(
            'span',
            { 'class': prefixCls + '-item-ellipsis' },
            ['\u2022\u2022\u2022']
          )]
        )]
      );
      var jumpNextIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(
          'div',
          { 'class': prefixCls + '-item-container' },
          [h(Icon, { 'class': prefixCls + '-item-link-icon', attrs: { type: 'double-right' }
          }), h(
            'span',
            { 'class': prefixCls + '-item-ellipsis' },
            ['\u2022\u2022\u2022']
          )]
        )]
      );
      return {
        prevIcon: prevIcon,
        nextIcon: nextIcon,
        jumpPrevIcon: jumpPrevIcon,
        jumpNextIcon: jumpNextIcon
      };
    },
    renderPagination: function renderPagination(contextLocale) {
      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          customizePrefixCls = _getOptionProps.prefixCls,
          customizeSelectPrefixCls = _getOptionProps.selectPrefixCls,
          buildOptionText = _getOptionProps.buildOptionText,
          size = _getOptionProps.size,
          customLocale = _getOptionProps.locale,
          restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'selectPrefixCls', 'buildOptionText', 'size', 'locale']);

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('pagination', customizePrefixCls);
      var selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);

      var isSmall = size === 'small';
      var paginationProps = {
        props: _extends({
          prefixCls: prefixCls,
          selectPrefixCls: selectPrefixCls
        }, restProps, this.getIconsProps(prefixCls), {
          selectComponentClass: isSmall ? MiniSelect : VcSelect,
          locale: _extends({}, contextLocale, customLocale),
          buildOptionText: buildOptionText || this.$scopedSlots.buildOptionText
        }),
        'class': {
          mini: isSmall
        },
        on: getListeners(this)
      };

      return h(VcPagination, paginationProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Pagination',
        defaultLocale: enUS
      },
      scopedSlots: { 'default': this.renderPagination }
    });
  }
};