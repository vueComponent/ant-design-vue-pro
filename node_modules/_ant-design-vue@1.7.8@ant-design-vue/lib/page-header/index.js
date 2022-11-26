'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageHeaderProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _breadcrumb = require('../breadcrumb');

var _breadcrumb2 = _interopRequireDefault(_breadcrumb);

var _avatar = require('../avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _transButton = require('../_util/transButton');

var _transButton2 = _interopRequireDefault(_transButton);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PageHeaderProps = exports.PageHeaderProps = {
  backIcon: _vueTypes2['default'].any,
  prefixCls: _vueTypes2['default'].string,
  title: _vueTypes2['default'].any,
  subTitle: _vueTypes2['default'].any,
  breadcrumb: _vueTypes2['default'].object,
  tags: _vueTypes2['default'].any,
  footer: _vueTypes2['default'].any,
  extra: _vueTypes2['default'].any,
  avatar: _vueTypes2['default'].object,
  ghost: _vueTypes2['default'].bool
};

var renderBack = function renderBack(instance, prefixCls, backIcon, onBack) {
  // eslint-disable-next-line no-unused-vars
  var h = instance.$createElement;
  if (!backIcon || !onBack) {
    return null;
  }
  return h(
    _LocaleReceiver2['default'],
    {
      attrs: { componentName: 'PageHeader' }
    },
    [function (_ref) {
      var back = _ref.back;
      return h(
        'div',
        { 'class': prefixCls + '-back' },
        [h(
          _transButton2['default'],
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
  return h(_breadcrumb2['default'], breadcrumb);
};

var renderTitle = function renderTitle(h, prefixCls, instance) {
  var avatar = instance.avatar;

  var title = (0, _propsUtil.getComponentFromProp)(instance, 'title');
  var subTitle = (0, _propsUtil.getComponentFromProp)(instance, 'subTitle');
  var tags = (0, _propsUtil.getComponentFromProp)(instance, 'tags');
  var extra = (0, _propsUtil.getComponentFromProp)(instance, 'extra');
  var backIcon = (0, _propsUtil.getComponentFromProp)(instance, 'backIcon') !== undefined ? (0, _propsUtil.getComponentFromProp)(instance, 'backIcon') : h(_icon2['default'], {
    attrs: { type: 'arrow-left' }
  });
  var onBack = instance.$listeners.back;
  var headingPrefixCls = prefixCls + '-heading';
  if (title || subTitle || tags || extra) {
    var backIconDom = renderBack(instance, prefixCls, backIcon, onBack);
    return h(
      'div',
      { 'class': headingPrefixCls },
      [backIconDom, avatar && h(_avatar2['default'], avatar), title && h(
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
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render(h) {
    var _configProvider = this.configProvider,
        getPrefixCls = _configProvider.getPrefixCls,
        pageHeader = _configProvider.pageHeader;

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        breadcrumb = props.breadcrumb;

    var footer = (0, _propsUtil.getComponentFromProp)(this, 'footer');
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
    var className = [prefixCls, (0, _defineProperty3['default'])({
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
  Vue.use(_base2['default']);
  Vue.component(PageHeader.name, PageHeader);
};

exports['default'] = PageHeader;