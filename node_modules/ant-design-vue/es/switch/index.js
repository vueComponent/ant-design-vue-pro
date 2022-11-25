import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../_util/vue-types';
import hasProp, { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import VcSwitch from '../vc-switch';
import Wave from '../_util/wave';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import warning from '../_util/warning';

var Switch = {
  name: 'ASwitch',
  __ANT_SWITCH: true,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: PropTypes.string,
    // size=default and size=large are the same
    size: PropTypes.oneOf(['small', 'default', 'large']),
    disabled: PropTypes.bool,
    checkedChildren: PropTypes.any,
    unCheckedChildren: PropTypes.any,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    autoFocus: PropTypes.bool,
    loading: PropTypes.bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },
  created: function created() {
    warning(hasProp(this, 'checked') || !hasProp(this, 'value'), 'Switch', '`value` is not validate prop, do you mean `checked`?');
  },
  render: function render() {
    var _classes;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        loading = _getOptionProps.loading,
        disabled = _getOptionProps.disabled,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'size', 'loading', 'disabled']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('switch', customizePrefixCls);

    var classes = (_classes = {}, _defineProperty(_classes, prefixCls + '-small', size === 'small'), _defineProperty(_classes, prefixCls + '-loading', loading), _classes);
    var loadingIcon = loading ? h(Icon, {
      attrs: { type: 'loading' },
      'class': prefixCls + '-loading-icon' }) : null;
    var switchProps = {
      props: _extends({}, restProps, {
        prefixCls: prefixCls,
        loadingIcon: loadingIcon,
        checkedChildren: getComponentFromProp(this, 'checkedChildren'),
        unCheckedChildren: getComponentFromProp(this, 'unCheckedChildren'),
        disabled: disabled || loading
      }),
      on: getListeners(this),
      'class': classes,
      ref: 'refSwitchNode'
    };
    return h(
      Wave,
      {
        attrs: { insertExtraNode: true }
      },
      [h(VcSwitch, switchProps)]
    );
  }
};

/* istanbul ignore next */
Switch.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Switch.name, Switch);
};

export default Switch;