import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, hasProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Avatar, { SkeletonAvatarProps } from './Avatar';
import Title, { SkeletonTitleProps } from './Title';
import Paragraph, { SkeletonParagraphProps } from './Paragraph';
import Base from '../base';

export var SkeletonProps = {
  active: PropTypes.bool,
  loading: PropTypes.bool,
  prefixCls: PropTypes.string,
  children: PropTypes.any,
  avatar: PropTypes.oneOfType([PropTypes.string, SkeletonAvatarProps, PropTypes.bool]),
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, SkeletonTitleProps]),
  paragraph: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, SkeletonParagraphProps])
};

function getComponentProps(prop) {
  if (prop && (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
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
  props: initDefaultProps(SkeletonProps, {
    avatar: false,
    title: true,
    paragraph: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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

    if (loading || !hasProp(this, 'loading')) {
      var _classNames;

      var hasAvatar = !!avatar || avatar === '';
      var hasTitle = !!title;
      var hasParagraph = !!paragraph;

      // Avatar
      var avatarNode = void 0;
      if (hasAvatar) {
        var avatarProps = {
          props: _extends({
            prefixCls: prefixCls + '-avatar'
          }, getAvatarBasicProps(hasTitle, hasParagraph), getComponentProps(avatar))
        };

        avatarNode = h(
          'div',
          { 'class': prefixCls + '-header' },
          [h(Avatar, avatarProps)]
        );
      }

      var contentNode = void 0;
      if (hasTitle || hasParagraph) {
        // Title
        var $title = void 0;
        if (hasTitle) {
          var titleProps = {
            props: _extends({
              prefixCls: prefixCls + '-title'
            }, getTitleBasicProps(hasAvatar, hasParagraph), getComponentProps(title))
          };

          $title = h(Title, titleProps);
        }

        // Paragraph
        var paragraphNode = void 0;
        if (hasParagraph) {
          var paragraphProps = {
            props: _extends({
              prefixCls: prefixCls + '-paragraph'
            }, getParagraphBasicProps(hasAvatar, hasTitle), getComponentProps(paragraph))
          };

          paragraphNode = h(Paragraph, paragraphProps);
        }

        contentNode = h(
          'div',
          { 'class': prefixCls + '-content' },
          [$title, paragraphNode]
        );
      }

      var cls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-with-avatar', hasAvatar), _defineProperty(_classNames, prefixCls + '-active', active), _classNames));

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
  Vue.use(Base);
  Vue.component(Skeleton.name, Skeleton);
};
export default Skeleton;