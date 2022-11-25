import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp } from '../_util/props-util';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var AnchorLinkProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.any,
  target: PropTypes.string
};

export default {
  name: 'AAnchorLink',
  props: initDefaultProps(AnchorLinkProps, {
    href: '#'
  }),
  inject: {
    antAnchor: { 'default': function _default() {
        return {};
      } },
    antAnchorContext: { 'default': function _default() {
        return {};
      } },
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  watch: {
    href: function href(val, oldVal) {
      var _this = this;

      this.$nextTick(function () {
        _this.antAnchor.unregisterLink(oldVal);
        _this.antAnchor.registerLink(val);
      });
    }
  },

  mounted: function mounted() {
    this.antAnchor.registerLink(this.href);
  },
  beforeDestroy: function beforeDestroy() {
    this.antAnchor.unregisterLink(this.href);
  },

  methods: {
    handleClick: function handleClick(e) {
      this.antAnchor.scrollTo(this.href);
      var scrollTo = this.antAnchor.scrollTo;
      var _$props = this.$props,
          href = _$props.href,
          title = _$props.title;

      if (this.antAnchorContext.$emit) {
        this.antAnchorContext.$emit('click', e, { title: title, href: href });
      }
      scrollTo(href);
    }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        href = this.href,
        $slots = this.$slots,
        target = this.target;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('anchor', customizePrefixCls);

    var title = getComponentFromProp(this, 'title');
    var active = this.antAnchor.$data.activeLink === href;
    var wrapperClassName = classNames(prefixCls + '-link', _defineProperty({}, prefixCls + '-link-active', active));
    var titleClassName = classNames(prefixCls + '-link-title', _defineProperty({}, prefixCls + '-link-title-active', active));
    return h(
      'div',
      { 'class': wrapperClassName },
      [h(
        'a',
        {
          'class': titleClassName,
          attrs: { href: href,
            title: typeof title === 'string' ? title : '',
            target: target
          },
          on: {
            'click': this.handleClick
          }
        },
        [title]
      ), $slots['default']]
    );
  }
};