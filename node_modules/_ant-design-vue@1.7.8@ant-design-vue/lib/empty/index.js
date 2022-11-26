'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptyProps = exports.TransferLocale = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _empty = require('./empty');

var _empty2 = _interopRequireDefault(_empty);

var _simple = require('./simple');

var _simple2 = _interopRequireDefault(_simple);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TransferLocale = exports.TransferLocale = function TransferLocale() {
  return {
    description: _vueTypes2['default'].string
  };
};

var EmptyProps = exports.EmptyProps = function EmptyProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    image: _vueTypes2['default'].any,
    description: _vueTypes2['default'].any,
    imageStyle: _vueTypes2['default'].object
  };
};

var Empty = {
  name: 'AEmpty',
  props: (0, _extends3['default'])({}, EmptyProps()),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    renderEmpty: function renderEmpty(contentLocale) {
      var h = this.$createElement;
      var _$props = this.$props,
          customizePrefixCls = _$props.prefixCls,
          imageStyle = _$props.imageStyle;
      var getPrefixCls = this.configProvider.getPrefixCls;

      var prefixCls = getPrefixCls('empty', customizePrefixCls);
      var image = (0, _propsUtil.getComponentFromProp)(this, 'image') || h(_empty2['default']);
      var description = (0, _propsUtil.getComponentFromProp)(this, 'description');

      var des = typeof description !== 'undefined' ? description : contentLocale.description;
      var alt = typeof des === 'string' ? des : 'empty';
      var cls = (0, _defineProperty3['default'])({}, prefixCls, true);
      var imageNode = null;
      if (typeof image === 'string') {
        imageNode = h('img', {
          attrs: { alt: alt, src: image }
        });
      } else if ((typeof image === 'undefined' ? 'undefined' : (0, _typeof3['default'])(image)) === 'object' && image.PRESENTED_IMAGE_SIMPLE) {
        var Image = image;
        imageNode = h(Image);
        cls[prefixCls + '-normal'] = true;
      } else {
        imageNode = image;
      }
      return h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': cls }, { on: (0, _propsUtil.getListeners)(this) }]),
        [h(
          'div',
          { 'class': prefixCls + '-image', style: imageStyle },
          [imageNode]
        ), des && h(
          'p',
          { 'class': prefixCls + '-description' },
          [des]
        ), this.$slots['default'] && h(
          'div',
          { 'class': prefixCls + '-footer' },
          [this.$slots['default']]
        )]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: { componentName: 'Empty' },
      scopedSlots: { 'default': this.renderEmpty } });
  }
};

Empty.PRESENTED_IMAGE_DEFAULT = _empty2['default'];
Empty.PRESENTED_IMAGE_SIMPLE = _simple2['default'];

/* istanbul ignore next */
Empty.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Empty.name, Empty);
};

exports['default'] = Empty;