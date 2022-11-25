'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CommentProps = exports.CommentProps = {
  actions: _vueTypes2['default'].array,
  /** The element to display as the comment author. */
  author: _vueTypes2['default'].any,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: _vueTypes2['default'].any,
  /** The main content of the comment */
  content: _vueTypes2['default'].any,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: _vueTypes2['default'].string,
  /** A datetime element containing the time to be displayed */
  datetime: _vueTypes2['default'].any
};

var Comment = {
  name: 'AComment',
  props: CommentProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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

    var actions = (0, _propsUtil.getComponentFromProp)(this, 'actions');
    var author = (0, _propsUtil.getComponentFromProp)(this, 'author');
    var avatar = (0, _propsUtil.getComponentFromProp)(this, 'avatar');
    var content = (0, _propsUtil.getComponentFromProp)(this, 'content');
    var datetime = (0, _propsUtil.getComponentFromProp)(this, 'datetime');

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
      (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': prefixCls }, { on: (0, _propsUtil.getListeners)(this) }]),
      [comment, children ? this.renderNested(prefixCls, children) : null]
    );
  }
};

/* istanbul ignore next */
Comment.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Comment.name, Comment);
};
exports['default'] = Comment;