import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'ACheckableTag',
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: PropTypes.string,
    checked: Boolean
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  computed: {
    classes: function classes() {
      var _ref;

      var checked = this.checked,
          customizePrefixCls = this.prefixCls;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('tag', customizePrefixCls);
      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-checkable', true), _defineProperty(_ref, prefixCls + '-checkable-checked', checked), _ref;
    }
  },
  methods: {
    handleClick: function handleClick() {
      var checked = this.checked;

      this.$emit('input', !checked);
      this.$emit('change', !checked);
    }
  },
  render: function render() {
    var h = arguments[0];
    var classes = this.classes,
        handleClick = this.handleClick,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': classes, on: {
          'click': handleClick
        }
      },
      [$slots['default']]
    );
  }
};