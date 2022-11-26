import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import VcRate from '../vc-rate';
import Icon from '../icon';
import Tooltip from '../tooltip';
import Base from '../base';

export var RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autoFocus: PropTypes.bool
};

var Rate = {
  name: 'ARate',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: RateProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    characterRender: function characterRender(node, _ref) {
      var index = _ref.index;
      var h = this.$createElement;
      var tooltips = this.$props.tooltips;

      if (!tooltips) return node;
      return h(
        Tooltip,
        {
          attrs: { title: tooltips[index] }
        },
        [node]
      );
    },
    focus: function focus() {
      this.$refs.refRate.focus();
    },
    blur: function blur() {
      this.$refs.refRate.blur();
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('rate', customizePrefixCls);

    var character = getComponentFromProp(this, 'character') || h(Icon, {
      attrs: { type: 'star', theme: 'filled' }
    });
    var rateProps = {
      props: _extends({
        character: character,
        characterRender: this.characterRender,
        prefixCls: prefixCls
      }, omit(restProps, ['tooltips'])),
      on: getListeners(this),
      ref: 'refRate'
    };
    return h(VcRate, rateProps);
  }
};

/* istanbul ignore next */
Rate.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Rate.name, Rate);
};
export default Rate;