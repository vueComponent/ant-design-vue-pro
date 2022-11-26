'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectorPropTypes = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = function (modeName) {
  var BaseSelector = {
    name: 'BaseSelector',
    mixins: [_BaseMixin2['default']],
    props: (0, _propsUtil.initDefaultProps)((0, _extends3['default'])({}, selectorPropTypes(), {

      // Pass by HOC
      renderSelection: _vueTypes2['default'].func.isRequired,
      renderPlaceholder: _vueTypes2['default'].func,
      tabIndex: _vueTypes2['default'].number
    }), {
      tabIndex: 0
    }),
    inject: {
      vcTreeSelect: { 'default': function _default() {
          return {};
        } }
    },
    created: function created() {
      this.domRef = (0, _util.createRef)();
    },

    methods: {
      onFocus: function onFocus(e) {
        var focused = this.$props.focused;
        var onSelectorFocus = this.vcTreeSelect.onSelectorFocus;


        if (!focused) {
          onSelectorFocus();
        }
        this.__emit('focus', e);
      },
      onBlur: function onBlur(e) {
        var onSelectorBlur = this.vcTreeSelect.onSelectorBlur;

        // TODO: Not trigger when is inner component get focused

        onSelectorBlur();
        this.__emit('blur', e);
      },
      focus: function focus() {
        this.domRef.current.focus();
      },
      blur: function blur() {
        this.domRef.current.blur();
      },
      renderClear: function renderClear() {
        var h = this.$createElement;
        var _$props = this.$props,
            prefixCls = _$props.prefixCls,
            allowClear = _$props.allowClear,
            selectorValueList = _$props.selectorValueList;
        var onSelectorClear = this.vcTreeSelect.onSelectorClear;


        if (!allowClear || !selectorValueList.length || !selectorValueList[0].value) {
          return null;
        }
        var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
        return h(
          'span',
          { key: 'clear', 'class': prefixCls + '-selection__clear', on: {
              'click': onSelectorClear
            }
          },
          [clearIcon]
        );
      },
      renderArrow: function renderArrow() {
        var h = this.$createElement;
        var _$props2 = this.$props,
            prefixCls = _$props2.prefixCls,
            showArrow = _$props2.showArrow;

        if (!showArrow) {
          return null;
        }
        var inputIcon = (0, _propsUtil.getComponentFromProp)(this, 'inputIcon');
        return h(
          'span',
          { key: 'arrow', 'class': prefixCls + '-arrow', style: { outline: 'none' } },
          [inputIcon]
        );
      }
    },

    render: function render() {
      var _classNames;

      var h = arguments[0];
      var _$props3 = this.$props,
          prefixCls = _$props3.prefixCls,
          className = _$props3.className,
          style = _$props3.style,
          open = _$props3.open,
          focused = _$props3.focused,
          disabled = _$props3.disabled,
          allowClear = _$props3.allowClear,
          ariaId = _$props3.ariaId,
          renderSelection = _$props3.renderSelection,
          renderPlaceholder = _$props3.renderPlaceholder,
          tabIndex = _$props3.tabIndex;
      var onSelectorKeyDown = this.vcTreeSelect.onSelectorKeyDown;


      var myTabIndex = tabIndex;
      if (disabled) {
        myTabIndex = null;
      }

      return h(
        'span',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          style: style,
          on: {
            'click': (0, _propsUtil.getListeners)(this).click || noop
          },

          'class': (0, _classnames2['default'])(className, prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-open', open), (0, _defineProperty3['default'])(_classNames, prefixCls + '-focused', open || focused), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-enabled', !disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-allow-clear', allowClear), _classNames))
        }, {
          directives: [{
            name: 'ant-ref',
            value: this.domRef
          }]
        }, {
          attrs: {
            role: 'combobox',
            'aria-expanded': open,
            'aria-owns': open ? ariaId : undefined,
            'aria-controls': open ? ariaId : undefined,
            'aria-haspopup': 'listbox',
            'aria-disabled': disabled,
            tabIndex: myTabIndex
          },
          on: {
            'focus': this.onFocus,
            'blur': this.onBlur,
            'keydown': onSelectorKeyDown
          }
        }]),
        [h(
          'span',
          {
            key: 'selection',
            'class': (0, _classnames2['default'])(prefixCls + '-selection', prefixCls + '-selection--' + modeName)
          },
          [renderSelection(), this.renderClear(), this.renderArrow(), renderPlaceholder && renderPlaceholder()]
        )]
      );
    }
  };

  return BaseSelector;
};

var _util = require('../util');

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../../../_util/props-util');

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var selectorPropTypes = exports.selectorPropTypes = function selectorPropTypes() {
  return {
    prefixCls: _vueTypes2['default'].string,
    className: _vueTypes2['default'].string,
    open: _vueTypes2['default'].bool,
    selectorValueList: _vueTypes2['default'].array,
    allowClear: _vueTypes2['default'].bool,
    showArrow: _vueTypes2['default'].bool,
    // onClick: PropTypes.func,
    // onBlur: PropTypes.func,
    // onFocus: PropTypes.func,
    removeSelected: _vueTypes2['default'].func,
    choiceTransitionName: _vueTypes2['default'].string,
    // Pass by component
    ariaId: _vueTypes2['default'].string,
    inputIcon: _vueTypes2['default'].any,
    clearIcon: _vueTypes2['default'].any,
    removeIcon: _vueTypes2['default'].any,
    placeholder: _vueTypes2['default'].any,
    disabled: _vueTypes2['default'].bool,
    focused: _vueTypes2['default'].bool
  };
}; /**
    * Input Box is in different position for different mode.
    * This not the same design as `Select` cause it's followed by antd 0.x `Select`.
    * We will not follow the new design immediately since antd 3.x is already released.
    *
    * So this file named as Selector to avoid confuse.
    */


function noop() {}