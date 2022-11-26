import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getComponentFromProp, getListeners } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import Base from '../base';

export var TransferLocale = function TransferLocale() {
  return {
    description: PropTypes.string
  };
};

export var EmptyProps = function EmptyProps() {
  return {
    prefixCls: PropTypes.string,
    image: PropTypes.any,
    description: PropTypes.any,
    imageStyle: PropTypes.object
  };
};

var Empty = {
  name: 'AEmpty',
  props: _extends({}, EmptyProps()),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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
      var image = getComponentFromProp(this, 'image') || h(DefaultEmptyImg);
      var description = getComponentFromProp(this, 'description');

      var des = typeof description !== 'undefined' ? description : contentLocale.description;
      var alt = typeof des === 'string' ? des : 'empty';
      var cls = _defineProperty({}, prefixCls, true);
      var imageNode = null;
      if (typeof image === 'string') {
        imageNode = h('img', {
          attrs: { alt: alt, src: image }
        });
      } else if ((typeof image === 'undefined' ? 'undefined' : _typeof(image)) === 'object' && image.PRESENTED_IMAGE_SIMPLE) {
        var Image = image;
        imageNode = h(Image);
        cls[prefixCls + '-normal'] = true;
      } else {
        imageNode = image;
      }
      return h(
        'div',
        _mergeJSXProps([{ 'class': cls }, { on: getListeners(this) }]),
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

    return h(LocaleReceiver, {
      attrs: { componentName: 'Empty' },
      scopedSlots: { 'default': this.renderEmpty } });
  }
};

Empty.PRESENTED_IMAGE_DEFAULT = DefaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = SimpleEmptyImg;

/* istanbul ignore next */
Empty.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Empty.name, Empty);
};

export default Empty;