import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
/**
 * Input Box is in different position for different mode.
 * This not the same design as `Select` cause it's followed by antd 0.x `Select`.
 * We will not follow the new design immediately since antd 3.x is already released.
 *
 * So this file named as Selector to avoid confuse.
 */
import { createRef } from '../util';
import PropTypes from '../../../_util/vue-types';
import classNames from 'classnames';
import { initDefaultProps, getComponentFromProp, getListeners } from '../../../_util/props-util';
import BaseMixin from '../../../_util/BaseMixin';
export var selectorPropTypes = function selectorPropTypes() {
  return {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    open: PropTypes.bool,
    selectorValueList: PropTypes.array,
    allowClear: PropTypes.bool,
    showArrow: PropTypes.bool,
    // onClick: PropTypes.func,
    // onBlur: PropTypes.func,
    // onFocus: PropTypes.func,
    removeSelected: PropTypes.func,
    choiceTransitionName: PropTypes.string,
    // Pass by component
    ariaId: PropTypes.string,
    inputIcon: PropTypes.any,
    clearIcon: PropTypes.any,
    removeIcon: PropTypes.any,
    placeholder: PropTypes.any,
    disabled: PropTypes.bool,
    focused: PropTypes.bool
  };
};

function noop() {}
export default function (modeName) {
  var BaseSelector = {
    name: 'BaseSelector',
    mixins: [BaseMixin],
    props: initDefaultProps(_extends({}, selectorPropTypes(), {

      // Pass by HOC
      renderSelection: PropTypes.func.isRequired,
      renderPlaceholder: PropTypes.func,
      tabIndex: PropTypes.number
    }), {
      tabIndex: 0
    }),
    inject: {
      vcTreeSelect: { 'default': function _default() {
          return {};
        } }
    },
    created: function created() {
      this.domRef = createRef();
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
        var clearIcon = getComponentFromProp(this, 'clearIcon');
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
        var inputIcon = getComponentFromProp(this, 'inputIcon');
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
        _mergeJSXProps([{
          style: style,
          on: {
            'click': getListeners(this).click || noop
          },

          'class': classNames(className, prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-open', open), _defineProperty(_classNames, prefixCls + '-focused', open || focused), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-enabled', !disabled), _defineProperty(_classNames, prefixCls + '-allow-clear', allowClear), _classNames))
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
            'class': classNames(prefixCls + '-selection', prefixCls + '-selection--' + modeName)
          },
          [renderSelection(), this.renderClear(), this.renderArrow(), renderPlaceholder && renderPlaceholder()]
        )]
      );
    }
  };

  return BaseSelector;
}