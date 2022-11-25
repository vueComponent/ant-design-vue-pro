import PropTypes from '../_util/vue-types';
import { getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';
import Base from '../base';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';

export var IconMap = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning'
};

export var ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized
};

// ExceptionImageMap keys
var ExceptionStatus = Object.keys(ExceptionMap);

export var ResultProps = {
  prefixCls: PropTypes.string,
  icon: PropTypes.any,
  status: PropTypes.oneOf(['success', 'error', 'info', 'warning', '404', '403', '500']).def('info'),
  title: PropTypes.any,
  subTitle: PropTypes.any,
  extra: PropTypes.any
};

var renderIcon = function renderIcon(h, prefixCls, _ref) {
  var status = _ref.status,
      icon = _ref.icon;

  if (ExceptionStatus.includes('' + status)) {
    var SVGComponent = ExceptionMap[status];
    return h(
      'div',
      { 'class': prefixCls + '-icon ' + prefixCls + '-image' },
      [h(SVGComponent)]
    );
  }
  // prop `icon` require slot or VNode
  var iconString = IconMap[status];
  var iconNode = icon || h(Icon, {
    attrs: { type: iconString, theme: 'filled' }
  });
  return h(
    'div',
    { 'class': prefixCls + '-icon' },
    [iconNode]
  );
};

var renderExtra = function renderExtra(h, prefixCls, extra) {
  return extra && h(
    'div',
    { 'class': prefixCls + '-extra' },
    [extra]
  );
};

var Result = {
  name: 'AResult',
  props: ResultProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render(h) {
    var customizePrefixCls = this.prefixCls,
        status = this.status;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('result', customizePrefixCls);

    var title = getComponentFromProp(this, 'title');
    var subTitle = getComponentFromProp(this, 'subTitle');
    var icon = getComponentFromProp(this, 'icon');
    var extra = getComponentFromProp(this, 'extra');

    return h(
      'div',
      { 'class': prefixCls + ' ' + prefixCls + '-' + status },
      [renderIcon(h, prefixCls, { status: status, icon: icon }), h(
        'div',
        { 'class': prefixCls + '-title' },
        [title]
      ), subTitle && h(
        'div',
        { 'class': prefixCls + '-subtitle' },
        [subTitle]
      ), this.$slots['default'] && h(
        'div',
        { 'class': prefixCls + '-content' },
        [this.$slots['default']]
      ), renderExtra(h, prefixCls, extra)]
    );
  }
};

/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

/* istanbul ignore next */
Result.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Result.name, Result);
};
export default Result;