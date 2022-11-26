import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, getListeners } from '../_util/props-util';
import classNames from 'classnames';
import Icon from '../icon';
import VcInputNumber from '../vc-input-number/src';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

export var InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autoFocus: PropTypes.bool
};

var InputNumber = {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(InputNumberProps, {
    step: 1
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.inputNumberRef.focus();
    },
    blur: function blur() {
      this.$refs.inputNumberRef.blur();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps$$attr = _extends({}, getOptionProps(this), this.$attrs),
        customizePrefixCls = _getOptionProps$$attr.prefixCls,
        size = _getOptionProps$$attr.size,
        others = _objectWithoutProperties(_getOptionProps$$attr, ['prefixCls', 'size']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input-number', customizePrefixCls);

    var inputNumberClass = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-lg', size === 'large'), _defineProperty(_classNames, prefixCls + '-sm', size === 'small'), _classNames));
    var upIcon = h(Icon, {
      attrs: { type: 'up' },
      'class': prefixCls + '-handler-up-inner' });
    var downIcon = h(Icon, {
      attrs: { type: 'down' },
      'class': prefixCls + '-handler-down-inner' });

    var vcInputNumberprops = {
      props: _extends({
        prefixCls: prefixCls,
        upHandler: upIcon,
        downHandler: downIcon
      }, others),
      'class': inputNumberClass,
      ref: 'inputNumberRef',
      on: getListeners(this)
    };
    return h(VcInputNumber, vcInputNumberprops);
  }
};

/* istanbul ignore next */
InputNumber.install = function (Vue) {
  Vue.use(Base);
  Vue.component(InputNumber.name, InputNumber);
};

export default InputNumber;