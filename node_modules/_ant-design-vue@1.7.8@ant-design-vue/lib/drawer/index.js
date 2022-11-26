'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _src = require('../vc-drawer/src');

var _src2 = _interopRequireDefault(_src);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Drawer = {
  name: 'ADrawer',
  props: {
    closable: _vueTypes2['default'].bool.def(true),
    destroyOnClose: _vueTypes2['default'].bool,
    getContainer: _vueTypes2['default'].any,
    maskClosable: _vueTypes2['default'].bool.def(true),
    mask: _vueTypes2['default'].bool.def(true),
    maskStyle: _vueTypes2['default'].object,
    wrapStyle: _vueTypes2['default'].object,
    bodyStyle: _vueTypes2['default'].object,
    headerStyle: _vueTypes2['default'].object,
    drawerStyle: _vueTypes2['default'].object,
    title: _vueTypes2['default'].any,
    visible: _vueTypes2['default'].bool,
    width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]).def(256),
    height: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]).def(256),
    zIndex: _vueTypes2['default'].number,
    prefixCls: _vueTypes2['default'].string,
    placement: _vueTypes2['default'].oneOf(['top', 'right', 'bottom', 'left']).def('right'),
    level: _vueTypes2['default'].any.def(null),
    wrapClassName: _vueTypes2['default'].string, // not use class like react, vue will add class to root dom
    handle: _vueTypes2['default'].any,
    afterVisibleChange: _vueTypes2['default'].func,
    keyboard: _vueTypes2['default'].bool.def(true)
  },
  mixins: [_BaseMixin2['default']],
  data: function data() {
    this.destroyClose = false;
    this.preVisible = this.$props.visible;
    return {
      _push: false
    };
  },

  inject: {
    parentDrawer: {
      'default': function _default() {
        return null;
      }
    },
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  provide: function provide() {
    return {
      parentDrawer: this
    };
  },
  mounted: function mounted() {
    // fix: delete drawer in child and re-render, no push started.
    // <Drawer>{show && <Drawer />}</Drawer>
    var visible = this.visible;

    if (visible && this.parentDrawer) {
      this.parentDrawer.push();
    }
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.preVisible !== _this.visible && _this.parentDrawer) {
        if (_this.visible) {
          _this.parentDrawer.push();
        } else {
          _this.parentDrawer.pull();
        }
      }
      _this.preVisible = _this.visible;
    });
  },
  beforeDestroy: function beforeDestroy() {
    // unmount drawer in child, clear push.
    if (this.parentDrawer) {
      this.parentDrawer.pull();
    }
  },

  methods: {
    domFocus: function domFocus() {
      if (this.$refs.vcDrawer) {
        this.$refs.vcDrawer.domFocus();
      }
    },
    close: function close(e) {
      this.$emit('close', e);
    },

    // onMaskClick(e) {
    //   if (!this.maskClosable) {
    //     return;
    //   }
    //   this.close(e);
    // },
    push: function push() {
      this.setState({
        _push: true
      });
    },
    pull: function pull() {
      var _this2 = this;

      this.setState({
        _push: false
      }, function () {
        _this2.domFocus();
      });
    },
    onDestroyTransitionEnd: function onDestroyTransitionEnd() {
      var isDestroyOnClose = this.getDestroyOnClose();
      if (!isDestroyOnClose) {
        return;
      }
      if (!this.visible) {
        this.destroyClose = true;
        this.$forceUpdate();
      }
    },
    getDestroyOnClose: function getDestroyOnClose() {
      return this.destroyOnClose && !this.visible;
    },

    // get drawar push width or height
    getPushTransform: function getPushTransform(placement) {
      if (placement === 'left' || placement === 'right') {
        return 'translateX(' + (placement === 'left' ? 180 : -180) + 'px)';
      }
      if (placement === 'top' || placement === 'bottom') {
        return 'translateY(' + (placement === 'top' ? 180 : -180) + 'px)';
      }
    },
    getRcDrawerStyle: function getRcDrawerStyle() {
      var _$props = this.$props,
          zIndex = _$props.zIndex,
          placement = _$props.placement,
          wrapStyle = _$props.wrapStyle;
      var push = this.$data._push;

      return (0, _extends3['default'])({
        zIndex: zIndex,
        transform: push ? this.getPushTransform(placement) : undefined
      }, wrapStyle);
    },
    renderHeader: function renderHeader(prefixCls) {
      var h = this.$createElement;
      var _$props2 = this.$props,
          closable = _$props2.closable,
          headerStyle = _$props2.headerStyle;

      var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
      if (!title && !closable) {
        return null;
      }

      var headerClassName = title ? prefixCls + '-header' : prefixCls + '-header-no-title';
      return h(
        'div',
        { 'class': headerClassName, style: headerStyle },
        [title && h(
          'div',
          { 'class': prefixCls + '-title' },
          [title]
        ), closable ? this.renderCloseIcon(prefixCls) : null]
      );
    },
    renderCloseIcon: function renderCloseIcon(prefixCls) {
      var h = this.$createElement;
      var closable = this.closable;

      return closable && h(
        'button',
        { key: 'closer', on: {
            'click': this.close
          },
          attrs: { 'aria-label': 'Close' },
          'class': prefixCls + '-close' },
        [h(_icon2['default'], {
          attrs: { type: 'close' }
        })]
      );
    },

    // render drawer body dom
    renderBody: function renderBody(prefixCls) {
      var h = this.$createElement;

      if (this.destroyClose && !this.visible) {
        return null;
      }
      this.destroyClose = false;
      var _$props3 = this.$props,
          bodyStyle = _$props3.bodyStyle,
          drawerStyle = _$props3.drawerStyle;


      var containerStyle = {};

      var isDestroyOnClose = this.getDestroyOnClose();
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }

      return h(
        'div',
        {
          'class': prefixCls + '-wrapper-body',
          style: (0, _extends3['default'])({}, containerStyle, drawerStyle),
          on: {
            'transitionend': this.onDestroyTransitionEnd
          }
        },
        [this.renderHeader(prefixCls), h(
          'div',
          { key: 'body', 'class': prefixCls + '-body', style: bodyStyle },
          [this.$slots['default']]
        )]
      );
    }
  },
  render: function render() {
    var _classnames;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        width = props.width,
        height = props.height,
        visible = props.visible,
        placement = props.placement,
        wrapClassName = props.wrapClassName,
        mask = props.mask,
        rest = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'width', 'height', 'visible', 'placement', 'wrapClassName', 'mask']);

    var haveMask = mask ? '' : 'no-mask';
    var offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? width + 'px' : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? height + 'px' : height;
    }
    var handler = (0, _propsUtil.getComponentFromProp)(this, 'handle') || false;
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('drawer', customizePrefixCls);

    var vcDrawerProps = {
      ref: 'vcDrawer',
      props: (0, _extends3['default'])({}, (0, _omit2['default'])(rest, ['closable', 'destroyOnClose', 'drawerStyle', 'headerStyle', 'bodyStyle', 'title', 'push', 'visible', 'getPopupContainer', 'rootPrefixCls', 'getPrefixCls', 'renderEmpty', 'csp', 'pageHeader', 'autoInsertSpaceInButton']), {
        handler: handler
      }, offsetStyle, {
        prefixCls: prefixCls,
        open: visible,
        showMask: mask,
        placement: placement,
        className: (0, _classnames3['default'])((_classnames = {}, (0, _defineProperty3['default'])(_classnames, wrapClassName, !!wrapClassName), (0, _defineProperty3['default'])(_classnames, haveMask, !!haveMask), _classnames)),
        wrapStyle: this.getRcDrawerStyle()
      }),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this))
    };
    return h(
      _src2['default'],
      vcDrawerProps,
      [this.renderBody(prefixCls)]
    );
  }
};

/* istanbul ignore next */
Drawer.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Drawer.name, Drawer);
};

exports['default'] = Drawer;