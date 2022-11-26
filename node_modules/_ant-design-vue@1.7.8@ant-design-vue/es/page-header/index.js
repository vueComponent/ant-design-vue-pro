import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';
import Breadcrumb from '../breadcrumb';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import Base from '../base';

export var PageHeaderProps = {
  backIcon: PropTypes.any,
  prefixCls: PropTypes.string,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  breadcrumb: PropTypes.object,
  tags: PropTypes.any,
  footer: PropTypes.any,
  extra: PropTypes.any,
  avatar: PropTypes.object,
  ghost: PropTypes.bool
};

var renderBack = function renderBack(instance, prefixCls, backIcon, onBack) {
  // eslint-disable-next-line no-unused-vars
  var h = instance.$createElement;
  if (!backIcon || !onBack) {
    return null;
  }
  return h(
    LocaleReceiver,
    {
      attrs: { componentName: 'PageHeader' }
    },
    [function (_ref) {
      var back = _ref.back;
      return h(
        'div',
        { 'class': prefixCls + '-back' },
        [h(
          TransButton,
          {
            on: {
              'click': function click(e) {
                instance.$emit('back', e);
              }
            },

            'class': prefixCls + '-back-button',
            attrs: { 'aria-label': back
            }
          },
          [backIcon]
        )]
      );
    }]
  );
};

var renderBreadcrumb = function renderBreadcrumb(h, breadcrumb) {
  return h(Breadcrumb, breadcrumb);
};

var renderTitle = function renderTitle(h, prefixCls, instance) {
  var avatar = instance.avatar;

  var title = getComponentFromProp(instance, 'title');
  var subTitle = getComponentFromProp(instance, 'subTitle');
  var tags = getComponentFromProp(instance, 'tags');
  var extra = getComponentFromProp(instance, 'extra');
  var backIcon = getComponentFromProp(instance, 'backIcon') !== undefined ? getComponentFromProp(instance, 'backIcon') : h(Icon, {
    attrs: { type: 'arrow-left' }
  });
  var onBack = instance.$listeners.back;
  var headingPrefixCls = prefixCls + '-heading';
  if (title || subTitle || tags || extra) {
    var backIconDom = renderBack(instance, prefixCls, backIcon, onBack);
    return h(
      'div',
      { 'class': headingPrefixCls },
      [backIconDom, avatar && h(Avatar, avatar), title && h(
        'span',
        { 'class': headingPrefixCls + '-title' },
        [title]
      ), subTitle && h(
        'span',
        { 'class': headingPrefixCls + '-sub-title' },
        [subTitle]
      ), tags && h(
        'span',
        { 'class': headingPrefixCls + '-tags' },
        [tags]
      ), extra && h(
        'span',
        { 'class': headingPrefixCls + '-extra' },
        [extra]
      )]
    );
  }
  return null;
};

var renderFooter = function renderFooter(h, prefixCls, footer) {
  if (footer) {
    return h(
      'div',
      { 'class': prefixCls + '-footer' },
      [footer]
    );
  }
  return null;
};

var renderChildren = function renderChildren(h, prefixCls, children) {
  return h(
    'div',
    { 'class': prefixCls + '-content' },
    [children]
  );
};

var PageHeader = {
  name: 'APageHeader',
  props: PageHeaderProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render(h) {
    var _configProvider = this.configProvider,
        getPrefixCls = _configProvider.getPrefixCls,
        pageHeader = _configProvider.pageHeader;

    var props = getOptionProps(this);
    var customizePrefixCls = props.prefixCls,
        breadcrumb = props.breadcrumb;

    var footer = getComponentFromProp(this, 'footer');
    var children = this.$slots['default'];

    var ghost = true;

    // Use `ghost` from `props` or from `ConfigProvider` instead.
    if ('ghost' in props) {
      ghost = props.ghost;
    } else if (pageHeader && 'ghost' in pageHeader) {
      ghost = pageHeader.ghost;
    }
    var prefixCls = getPrefixCls('page-header', customizePrefixCls);
    var breadcrumbDom = breadcrumb && breadcrumb.props && breadcrumb.props.routes ? renderBreadcrumb(h, breadcrumb) : null;
    var className = [prefixCls, _defineProperty({
      'has-breadcrumb': breadcrumbDom,
      'has-footer': footer
    }, prefixCls + '-ghost', ghost)];

    return h(
      'div',
      { 'class': className },
      [breadcrumbDom, renderTitle(h, prefixCls, this), children && renderChildren(h, prefixCls, children), renderFooter(h, prefixCls, footer)]
    );
  }
};

/* istanbul ignore next */
PageHeader.install = function (Vue) {
  Vue.use(Base);
  Vue.component(PageHeader.name, PageHeader);
};

export default PageHeader;