import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

var Divider = {
  name: 'ADivider',
  props: {
    prefixCls: PropTypes.string,
    type: PropTypes.oneOf(['horizontal', 'vertical', '']).def('horizontal'),
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right', 'center'])
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        type = this.type,
        $slots = this.$slots,
        dashed = this.dashed,
        _orientation = this.orientation,
        orientation = _orientation === undefined ? 'center' : _orientation;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('divider', customizePrefixCls);
    var orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;

    var classString = (_classString = {}, _defineProperty(_classString, prefixCls, true), _defineProperty(_classString, prefixCls + '-' + type, true), _defineProperty(_classString, prefixCls + '-with-text' + orientationPrefix, $slots['default']), _defineProperty(_classString, prefixCls + '-dashed', !!dashed), _classString);

    return h(
      'div',
      { 'class': classString, attrs: { role: 'separator' }
      },
      [$slots['default'] && h(
        'span',
        { 'class': prefixCls + '-inner-text' },
        [$slots['default']]
      )]
    );
  }
};

/* istanbul ignore next */
Divider.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Divider.name, Divider);
};

export default Divider;