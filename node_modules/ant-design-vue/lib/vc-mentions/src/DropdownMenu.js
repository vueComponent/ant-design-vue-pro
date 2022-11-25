'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vcMenu = require('../../vc-menu');

var _vcMenu2 = _interopRequireDefault(_vcMenu);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Option = require('./Option');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  name: 'DropdownMenu',
  props: {
    prefixCls: _vueTypes2['default'].string,
    options: _vueTypes2['default'].arrayOf(_Option.OptionProps)
  },
  inject: {
    mentionsContext: { 'default': {} }
  },

  render: function render() {
    var h = arguments[0];
    var _mentionsContext = this.mentionsContext,
        notFoundContent = _mentionsContext.notFoundContent,
        activeIndex = _mentionsContext.activeIndex,
        setActiveIndex = _mentionsContext.setActiveIndex,
        selectOption = _mentionsContext.selectOption,
        _mentionsContext$onFo = _mentionsContext.onFocus,
        onFocus = _mentionsContext$onFo === undefined ? noop : _mentionsContext$onFo,
        _mentionsContext$onBl = _mentionsContext.onBlur,
        onBlur = _mentionsContext$onBl === undefined ? noop : _mentionsContext$onBl;
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        options = _$props.options;

    var activeOption = options[activeIndex] || {};

    return h(
      _vcMenu2['default'],
      {
        props: {
          prefixCls: prefixCls + '-menu',
          activeKey: activeOption.value
        },
        on: {
          select: function select(_ref) {
            var key = _ref.key;

            var option = options.find(function (_ref2) {
              var value = _ref2.value;
              return value === key;
            });
            selectOption(option);
          },
          focus: onFocus,
          blur: onBlur
        }
      },
      [options.map(function (option, index) {
        var value = option.value,
            disabled = option.disabled,
            children = option.children;

        return h(
          _vcMenu.MenuItem,
          {
            key: value,
            attrs: { disabled: disabled
            },
            on: {
              'mouseenter': function mouseenter() {
                setActiveIndex(index);
              }
            }
          },
          [children]
        );
      }), !options.length && h(
        _vcMenu.MenuItem,
        {
          attrs: { disabled: true }
        },
        [notFoundContent]
      )]
    );
  }
};