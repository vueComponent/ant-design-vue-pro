'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Title = require('./Title');

var _Title2 = _interopRequireDefault(_Title);

var _Paragraph = require('./Paragraph');

var _Paragraph2 = _interopRequireDefault(_Paragraph);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SkeletonProps = exports.SkeletonProps = {
  active: _vueTypes2['default'].bool,
  loading: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  children: _vueTypes2['default'].any,
  avatar: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _Avatar.SkeletonAvatarProps, _vueTypes2['default'].bool]),
  title: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].string, _Title.SkeletonTitleProps]),
  paragraph: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].string, _Paragraph.SkeletonParagraphProps])
};

function getComponentProps(prop) {
  if (prop && (typeof prop === 'undefined' ? 'undefined' : (0, _typeof3['default'])(prop)) === 'object') {
    return prop;
  }
  return {};
}

function getAvatarBasicProps(hasTitle, hasParagraph) {
  if (hasTitle && !hasParagraph) {
    return { shape: 'square' };
  }

  return { shape: 'circle' };
}

function getTitleBasicProps(hasAvatar, hasParagraph) {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar, hasTitle) {
  var basicProps = {};

  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%';
  }

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

var Skeleton = {
  name: 'ASkeleton',
  props: (0, _propsUtil.initDefaultProps)(SkeletonProps, {
    avatar: false,
    title: true,
    paragraph: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        loading = _$props.loading,
        avatar = _$props.avatar,
        title = _$props.title,
        paragraph = _$props.paragraph,
        active = _$props.active;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('skeleton', customizePrefixCls);

    if (loading || !(0, _propsUtil.hasProp)(this, 'loading')) {
      var _classNames;

      var hasAvatar = !!avatar || avatar === '';
      var hasTitle = !!title;
      var hasParagraph = !!paragraph;

      // Avatar
      var avatarNode = void 0;
      if (hasAvatar) {
        var avatarProps = {
          props: (0, _extends3['default'])({
            prefixCls: prefixCls + '-avatar'
          }, getAvatarBasicProps(hasTitle, hasParagraph), getComponentProps(avatar))
        };

        avatarNode = h(
          'div',
          { 'class': prefixCls + '-header' },
          [h(_Avatar2['default'], avatarProps)]
        );
      }

      var contentNode = void 0;
      if (hasTitle || hasParagraph) {
        // Title
        var $title = void 0;
        if (hasTitle) {
          var titleProps = {
            props: (0, _extends3['default'])({
              prefixCls: prefixCls + '-title'
            }, getTitleBasicProps(hasAvatar, hasParagraph), getComponentProps(title))
          };

          $title = h(_Title2['default'], titleProps);
        }

        // Paragraph
        var paragraphNode = void 0;
        if (hasParagraph) {
          var paragraphProps = {
            props: (0, _extends3['default'])({
              prefixCls: prefixCls + '-paragraph'
            }, getParagraphBasicProps(hasAvatar, hasTitle), getComponentProps(paragraph))
          };

          paragraphNode = h(_Paragraph2['default'], paragraphProps);
        }

        contentNode = h(
          'div',
          { 'class': prefixCls + '-content' },
          [$title, paragraphNode]
        );
      }

      var cls = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-with-avatar', hasAvatar), (0, _defineProperty3['default'])(_classNames, prefixCls + '-active', active), _classNames));

      return h(
        'div',
        { 'class': cls },
        [avatarNode, contentNode]
      );
    }
    var children = this.$slots['default'];
    return children && children.length === 1 ? children[0] : h('span', [children]);
  }
};
/* istanbul ignore next */
Skeleton.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Skeleton.name, Skeleton);
};
exports['default'] = Skeleton;