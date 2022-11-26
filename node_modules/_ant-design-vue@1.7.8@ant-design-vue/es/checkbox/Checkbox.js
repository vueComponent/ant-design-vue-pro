import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import VcCheckbox from '../vc-checkbox';
import hasProp, { getOptionProps, getAttrs, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import warning from '../_util/warning';
function noop() {}

export default {
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: PropTypes.string,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    isGroup: PropTypes.bool,
    value: PropTypes.any,
    name: PropTypes.string,
    id: PropTypes.string,
    indeterminate: PropTypes.bool,
    type: PropTypes.string.def('checkbox'),
    autoFocus: PropTypes.bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } },
    checkboxGroupContext: { 'default': function _default() {
        return undefined;
      } }
  },
  watch: {
    value: function value(_value, prevValue) {
      var _this = this;

      this.$nextTick(function () {
        var _checkboxGroupContext = _this.checkboxGroupContext,
            checkboxGroup = _checkboxGroupContext === undefined ? {} : _checkboxGroupContext;

        if (checkboxGroup.registerValue && checkboxGroup.cancelValue) {
          checkboxGroup.cancelValue(prevValue);
          checkboxGroup.registerValue(_value);
        }
      });
    }
  },
  mounted: function mounted() {
    var value = this.value,
        _checkboxGroupContext2 = this.checkboxGroupContext,
        checkboxGroup = _checkboxGroupContext2 === undefined ? {} : _checkboxGroupContext2;

    if (checkboxGroup.registerValue) {
      checkboxGroup.registerValue(value);
    }

    warning(hasProp(this, 'checked') || this.checkboxGroupContext || !hasProp(this, 'value'), 'Checkbox', '`value` is not validate prop, do you mean `checked`?');
  },
  beforeDestroy: function beforeDestroy() {
    var value = this.value,
        _checkboxGroupContext3 = this.checkboxGroupContext,
        checkboxGroup = _checkboxGroupContext3 === undefined ? {} : _checkboxGroupContext3;

    if (checkboxGroup.cancelValue) {
      checkboxGroup.cancelValue(value);
    }
  },

  methods: {
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    focus: function focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur: function blur() {
      this.$refs.vcCheckbox.blur();
    }
  },

  render: function render() {
    var _this2 = this,
        _classNames;

    var h = arguments[0];
    var checkboxGroup = this.checkboxGroupContext,
        $slots = this.$slots;

    var props = getOptionProps(this);
    var children = $slots['default'];

    var _getListeners = getListeners(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        input = _getListeners.input,
        restListeners = _objectWithoutProperties(_getListeners, ['mouseenter', 'mouseleave', 'input']);

    var customizePrefixCls = props.prefixCls,
        indeterminate = props.indeterminate,
        restProps = _objectWithoutProperties(props, ['prefixCls', 'indeterminate']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('checkbox', customizePrefixCls);

    var checkboxProps = {
      props: _extends({}, restProps, { prefixCls: prefixCls }),
      on: restListeners,
      attrs: getAttrs(this)
    };
    if (checkboxGroup) {
      checkboxProps.on.change = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this2.$emit.apply(_this2, ['change'].concat(args));
        checkboxGroup.toggleOption({ label: children, value: props.value });
      };
      checkboxProps.props.name = checkboxGroup.name;
      checkboxProps.props.checked = checkboxGroup.sValue.indexOf(props.value) !== -1;
      checkboxProps.props.disabled = props.disabled || checkboxGroup.disabled;
      checkboxProps.props.indeterminate = indeterminate;
    } else {
      checkboxProps.on.change = this.handleChange;
    }
    var classString = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-wrapper', true), _defineProperty(_classNames, prefixCls + '-wrapper-checked', checkboxProps.props.checked), _defineProperty(_classNames, prefixCls + '-wrapper-disabled', checkboxProps.props.disabled), _classNames));
    var checkboxClass = classNames(_defineProperty({}, prefixCls + '-indeterminate', indeterminate));
    return h(
      'label',
      { 'class': classString, on: {
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      },
      [h(VcCheckbox, _mergeJSXProps([checkboxProps, { 'class': checkboxClass, ref: 'vcCheckbox' }])), children !== undefined && h('span', [children])]
    );
  }
};