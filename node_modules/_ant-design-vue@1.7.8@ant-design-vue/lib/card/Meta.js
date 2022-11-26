'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACardMeta',
  props: {
    prefixCls: _vueTypes2['default'].string,
    title: _vueTypes2['default'].any,
    description: _vueTypes2['default'].any
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.$props.prefixCls;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('card', customizePrefixCls);

    var classString = (0, _defineProperty3['default'])({}, prefixCls + '-meta', true);

    var avatar = (0, _propsUtil.getComponentFromProp)(this, 'avatar');
    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var description = (0, _propsUtil.getComponentFromProp)(this, 'description');

    var avatarDom = avatar ? h(
      'div',
      { 'class': prefixCls + '-meta-avatar' },
      [avatar]
    ) : null;
    var titleDom = title ? h(
      'div',
      { 'class': prefixCls + '-meta-title' },
      [title]
    ) : null;
    var descriptionDom = description ? h(
      'div',
      { 'class': prefixCls + '-meta-description' },
      [description]
    ) : null;
    var MetaDetail = titleDom || descriptionDom ? h(
      'div',
      { 'class': prefixCls + '-meta-detail' },
      [titleDom, descriptionDom]
    ) : null;
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{ on: (0, _propsUtil.getListeners)(this) }, { 'class': classString }]),
      [avatarDom, MetaDetail]
    );
  }
};