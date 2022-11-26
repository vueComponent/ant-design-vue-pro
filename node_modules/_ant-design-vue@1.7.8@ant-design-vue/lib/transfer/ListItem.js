'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vcLazyLoad = require('../vc-lazy-load');

var _vcLazyLoad2 = _interopRequireDefault(_vcLazyLoad);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'ListItem',
  props: {
    renderedText: _vueTypes2['default'].any,
    renderedEl: _vueTypes2['default'].any,
    item: _vueTypes2['default'].any,
    lazy: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    checked: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool
  },
  render: function render() {
    var _classNames,
        _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        renderedText = _$props.renderedText,
        renderedEl = _$props.renderedEl,
        item = _$props.item,
        lazy = _$props.lazy,
        checked = _$props.checked,
        disabled = _$props.disabled,
        prefixCls = _$props.prefixCls;


    var className = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-content-item', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-content-item-disabled', disabled || item.disabled), _classNames));

    var title = void 0;
    if (typeof renderedText === 'string' || typeof renderedText === 'number') {
      title = String(renderedText);
    }

    var listItem = h(
      'li',
      {
        'class': className,
        attrs: { title: title
        },
        on: {
          'click': disabled || item.disabled ? noop : function () {
            _this.$emit('click', item);
          }
        }
      },
      [h(_checkbox2['default'], {
        attrs: { checked: checked, disabled: disabled || item.disabled }
      }), h(
        'span',
        { 'class': prefixCls + '-content-item-text' },
        [renderedEl]
      )]
    );
    var children = null;
    if (lazy) {
      var lazyProps = {
        props: (0, _extends3['default'])({
          height: 32,
          offset: 500,
          throttle: 0,
          debounce: false
        }, lazy, {
          _propsSymbol: Symbol()
        })
      };
      children = h(
        _vcLazyLoad2['default'],
        lazyProps,
        [listItem]
      );
    } else {
      children = listItem;
    }
    return children;
  }
};