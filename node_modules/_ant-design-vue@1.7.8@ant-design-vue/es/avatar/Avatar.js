import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';
import { getListeners, getComponentFromProp } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export default {
  name: 'AAvatar',
  props: {
    prefixCls: {
      type: String,
      'default': undefined
    },
    shape: {
      validator: function validator(val) {
        return ['circle', 'square'].includes(val);
      },
      'default': 'circle'
    },
    size: {
      validator: function validator(val) {
        return typeof val === 'number' || ['small', 'large', 'default'].includes(val);
      },
      'default': 'default'
    },
    src: String,
    /** Srcset of image avatar */
    srcSet: String,
    icon: PropTypes.any,
    alt: String,
    loadError: Function
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      isImgExist: true,
      isMounted: false,
      scale: 1
    };
  },

  watch: {
    src: function src() {
      var _this = this;

      this.$nextTick(function () {
        _this.isImgExist = true;
        _this.scale = 1;
        // force uodate for position
        _this.$forceUpdate();
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setScale();
      _this2.isMounted = true;
    });
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      _this3.setScale();
    });
  },

  methods: {
    setScale: function setScale() {
      if (!this.$refs.avatarChildren || !this.$refs.avatarNode) {
        return;
      }
      var childrenWidth = this.$refs.avatarChildren.offsetWidth; // offsetWidth avoid affecting be transform scale
      var nodeWidth = this.$refs.avatarNode.offsetWidth;
      // denominator is 0 is no meaning
      if (childrenWidth === 0 || nodeWidth === 0 || this.lastChildrenWidth === childrenWidth && this.lastNodeWidth === nodeWidth) {
        return;
      }
      this.lastChildrenWidth = childrenWidth;
      this.lastNodeWidth = nodeWidth;
      // add 4px gap for each side to get better performance
      this.scale = nodeWidth - 8 < childrenWidth ? (nodeWidth - 8) / childrenWidth : 1;
    },
    handleImgLoadError: function handleImgLoadError() {
      var loadError = this.$props.loadError;

      var errorFlag = loadError ? loadError() : undefined;
      if (errorFlag !== false) {
        this.isImgExist = false;
      }
    }
  },
  render: function render() {
    var _sizeCls, _extends3;

    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        shape = _$props.shape,
        size = _$props.size,
        src = _$props.src,
        alt = _$props.alt,
        srcSet = _$props.srcSet;

    var icon = getComponentFromProp(this, 'icon');
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('avatar', customizePrefixCls);

    var _$data = this.$data,
        isImgExist = _$data.isImgExist,
        scale = _$data.scale,
        isMounted = _$data.isMounted;


    var sizeCls = (_sizeCls = {}, _defineProperty(_sizeCls, prefixCls + '-lg', size === 'large'), _defineProperty(_sizeCls, prefixCls + '-sm', size === 'small'), _sizeCls);

    var classString = _extends(_defineProperty({}, prefixCls, true), sizeCls, (_extends3 = {}, _defineProperty(_extends3, prefixCls + '-' + shape, shape), _defineProperty(_extends3, prefixCls + '-image', src && isImgExist), _defineProperty(_extends3, prefixCls + '-icon', icon), _extends3));

    var sizeStyle = typeof size === 'number' ? {
      width: size + 'px',
      height: size + 'px',
      lineHeight: size + 'px',
      fontSize: icon ? size / 2 + 'px' : '18px'
    } : {};

    var children = this.$slots['default'];
    if (src && isImgExist) {
      children = h('img', {
        attrs: { src: src, srcSet: srcSet, alt: alt },
        on: {
          'error': this.handleImgLoadError
        }
      });
    } else if (icon) {
      if (typeof icon === 'string') {
        children = h(Icon, {
          attrs: { type: icon }
        });
      } else {
        children = icon;
      }
    } else {
      var childrenNode = this.$refs.avatarChildren;
      if (childrenNode || scale !== 1) {
        var transformString = 'scale(' + scale + ') translateX(-50%)';
        var childrenStyle = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString
        };
        var sizeChildrenStyle = typeof size === 'number' ? {
          lineHeight: size + 'px'
        } : {};
        children = h(
          'span',
          {
            'class': prefixCls + '-string',
            ref: 'avatarChildren',
            style: _extends({}, sizeChildrenStyle, childrenStyle)
          },
          [children]
        );
      } else {
        var _childrenStyle = {};
        if (!isMounted) {
          _childrenStyle.opacity = 0;
        }
        children = h(
          'span',
          { 'class': prefixCls + '-string', ref: 'avatarChildren', style: { opacity: 0 } },
          [children]
        );
      }
    }
    return h(
      'span',
      _mergeJSXProps([{ ref: 'avatarNode' }, { on: getListeners(this), 'class': classString, style: sizeStyle }]),
      [children]
    );
  }
};