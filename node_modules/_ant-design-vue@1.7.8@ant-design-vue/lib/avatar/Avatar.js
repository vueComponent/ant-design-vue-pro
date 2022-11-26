'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _propsUtil = require('../_util/props-util');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
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
    icon: _vueTypes2['default'].any,
    alt: String,
    loadError: Function
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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

    var icon = (0, _propsUtil.getComponentFromProp)(this, 'icon');
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('avatar', customizePrefixCls);

    var _$data = this.$data,
        isImgExist = _$data.isImgExist,
        scale = _$data.scale,
        isMounted = _$data.isMounted;


    var sizeCls = (_sizeCls = {}, (0, _defineProperty3['default'])(_sizeCls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_sizeCls, prefixCls + '-sm', size === 'small'), _sizeCls);

    var classString = (0, _extends5['default'])((0, _defineProperty3['default'])({}, prefixCls, true), sizeCls, (_extends3 = {}, (0, _defineProperty3['default'])(_extends3, prefixCls + '-' + shape, shape), (0, _defineProperty3['default'])(_extends3, prefixCls + '-image', src && isImgExist), (0, _defineProperty3['default'])(_extends3, prefixCls + '-icon', icon), _extends3));

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
        children = h(_icon2['default'], {
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
            style: (0, _extends5['default'])({}, sizeChildrenStyle, childrenStyle)
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
      (0, _babelHelperVueJsxMergeProps2['default'])([{ ref: 'avatarNode' }, { on: (0, _propsUtil.getListeners)(this), 'class': classString, style: sizeStyle }]),
      [children]
    );
  }
};