import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import Icon from '../icon';
import Input from '../input';

export var TransferSearchProps = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleClear: PropTypes.func,
  disabled: PropTypes.bool
};

export default {
  name: 'Search',
  props: initDefaultProps(TransferSearchProps, {
    placeholder: ''
  }),
  methods: {
    handleChange: function handleChange(e) {
      this.$emit('change', e);
    },
    handleClear2: function handleClear2(e) {
      e.preventDefault();
      var _$props = this.$props,
          handleClear = _$props.handleClear,
          disabled = _$props.disabled;

      if (!disabled && handleClear) {
        handleClear(e);
      }
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        placeholder = _getOptionProps.placeholder,
        value = _getOptionProps.value,
        prefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled;

    var icon = value && value.length > 0 ? h(
      'a',
      {
        attrs: { href: '#' },
        'class': prefixCls + '-action', on: {
          'click': this.handleClear2
        }
      },
      [h(Icon, {
        attrs: { type: 'close-circle', theme: 'filled' }
      })]
    ) : h(
      'span',
      { 'class': prefixCls + '-action' },
      [h(Icon, {
        attrs: { type: 'search' }
      })]
    );

    return h('div', [h(Input, {
      attrs: {
        placeholder: placeholder,

        value: value,

        disabled: disabled
      },
      'class': prefixCls, on: {
        'change': this.handleChange
      }
    }), icon]);
  }
};