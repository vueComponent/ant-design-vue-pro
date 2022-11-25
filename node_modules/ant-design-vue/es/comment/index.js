import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropsTypes from '../_util/vue-types';
import { getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
export var CommentProps = {
  actions: PropsTypes.array,
  /** The element to display as the comment author. */
  author: PropsTypes.any,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: PropsTypes.any,
  /** The main content of the comment */
  content: PropsTypes.any,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: PropsTypes.string,
  /** A datetime element containing the time to be displayed */
  datetime: PropsTypes.any
};

var Comment = {
  name: 'AComment',
  props: CommentProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    getAction: function getAction(actions) {
      var h = this.$createElement;

      if (!actions || !actions.length) {
        return null;
      }
      var actionList = actions.map(function (action, index) {
        return h(
          'li',
          { key: 'action-' + index },
          [action]
        );
      });
      return actionList;
    },
    renderNested: function renderNested(prefixCls, children) {
      var h = this.$createElement;

      return h(
        'div',
        { 'class': prefixCls + '-nested' },
        [children]
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.$props.prefixCls;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('comment', customizePrefixCls);

    var actions = getComponentFromProp(this, 'actions');
    var author = getComponentFromProp(this, 'author');
    var avatar = getComponentFromProp(this, 'avatar');
    var content = getComponentFromProp(this, 'content');
    var datetime = getComponentFromProp(this, 'datetime');

    var avatarDom = h(
      'div',
      { 'class': prefixCls + '-avatar' },
      [typeof avatar === 'string' ? h('img', {
        attrs: { src: avatar, alt: 'comment-avatar' }
      }) : avatar]
    );

    var actionDom = actions && actions.length ? h(
      'ul',
      { 'class': prefixCls + '-actions' },
      [this.getAction(actions)]
    ) : null;

    var authorContent = h(
      'div',
      { 'class': prefixCls + '-content-author' },
      [author && h(
        'span',
        { 'class': prefixCls + '-content-author-name' },
        [author]
      ), datetime && h(
        'span',
        { 'class': prefixCls + '-content-author-time' },
        [datetime]
      )]
    );

    var contentDom = h(
      'div',
      { 'class': prefixCls + '-content' },
      [authorContent, h(
        'div',
        { 'class': prefixCls + '-content-detail' },
        [content]
      ), actionDom]
    );

    var comment = h(
      'div',
      { 'class': prefixCls + '-inner' },
      [avatarDom, contentDom]
    );
    var children = this.$slots['default'];
    return h(
      'div',
      _mergeJSXProps([{ 'class': prefixCls }, { on: getListeners(this) }]),
      [comment, children ? this.renderNested(prefixCls, children) : null]
    );
  }
};

/* istanbul ignore next */
Comment.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Comment.name, Comment);
};
export default Comment;