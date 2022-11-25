'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationConfig = exports.PaginationProps = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _MiniSelect = require('./MiniSelect');

var _MiniSelect2 = _interopRequireDefault(_MiniSelect);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _propsUtil = require('../_util/props-util');

var _vcPagination = require('../vc-pagination');

var _vcPagination2 = _interopRequireDefault(_vcPagination);

var _en_US = require('../vc-pagination/locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PaginationProps = exports.PaginationProps = function PaginationProps() {
  return {
    total: _vueTypes2['default'].number,
    defaultCurrent: _vueTypes2['default'].number,
    disabled: _vueTypes2['default'].bool,
    current: _vueTypes2['default'].number,
    defaultPageSize: _vueTypes2['default'].number,
    pageSize: _vueTypes2['default'].number,
    hideOnSinglePage: _vueTypes2['default'].bool,
    showSizeChanger: _vueTypes2['default'].bool,
    pageSizeOptions: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string])),
    buildOptionText: _vueTypes2['default'].func,
    showSizeChange: _vueTypes2['default'].func,
    showQuickJumper: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    showTotal: _vueTypes2['default'].any,
    size: _vueTypes2['default'].string,
    simple: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    selectPrefixCls: _vueTypes2['default'].string,
    itemRender: _vueTypes2['default'].any,
    role: _vueTypes2['default'].string,
    showLessItems: _vueTypes2['default'].bool
  };
};

var PaginationConfig = exports.PaginationConfig = function PaginationConfig() {
  return (0, _extends3['default'])({}, PaginationProps(), {
    position: _vueTypes2['default'].oneOf(['top', 'bottom', 'both'])
  });
};

exports['default'] = {
  name: 'APagination',
  model: {
    prop: 'current',
    event: 'change.current'
  },
  props: (0, _extends3['default'])({}, PaginationProps()),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    getIconsProps: function getIconsProps(prefixCls) {
      var h = this.$createElement;

      var prevIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(_icon2['default'], {
          attrs: { type: 'left' }
        })]
      );
      var nextIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(_icon2['default'], {
          attrs: { type: 'right' }
        })]
      );
      var jumpPrevIcon = h(
        'a',
        { 'class': prefixCls + '-item-link' },
        [h(
          'div',
          { 'class': prefixCls + '-item-container' },
          [h(_icon2['default'], { 'class': prefixCls + '-item-link-icon', attrs: { type: 'double-left' }
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
          [h(_icon2['default'], { 'class': prefixCls + '-item-link-icon', attrs: { type: 'double-right' }
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

      var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
          customizePrefixCls = _getOptionProps.prefixCls,
          customizeSelectPrefixCls = _getOptionProps.selectPrefixCls,
          buildOptionText = _getOptionProps.buildOptionText,
          size = _getOptionProps.size,
          customLocale = _getOptionProps.locale,
          restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'selectPrefixCls', 'buildOptionText', 'size', 'locale']);

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('pagination', customizePrefixCls);
      var selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);

      var isSmall = size === 'small';
      var paginationProps = {
        props: (0, _extends3['default'])({
          prefixCls: prefixCls,
          selectPrefixCls: selectPrefixCls
        }, restProps, this.getIconsProps(prefixCls), {
          selectComponentClass: isSmall ? _MiniSelect2['default'] : _select2['default'],
          locale: (0, _extends3['default'])({}, contextLocale, customLocale),
          buildOptionText: buildOptionText || this.$scopedSlots.buildOptionText
        }),
        'class': {
          mini: isSmall
        },
        on: (0, _propsUtil.getListeners)(this)
      };

      return h(_vcPagination2['default'], paginationProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Pagination',
        defaultLocale: _en_US2['default']
      },
      scopedSlots: { 'default': this.renderPagination }
    });
  }
};