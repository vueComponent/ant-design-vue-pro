import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import classnames from 'classnames';
import omit from 'omit.js';
import VcDrawer from '../vc-drawer/src';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Icon from '../icon';
import { getComponentFromProp, getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

var Drawer = {
  name: 'ADrawer',
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.any,
    maskClosable: PropTypes.bool.def(true),
    mask: PropTypes.bool.def(true),
    maskStyle: PropTypes.object,
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    drawerStyle: PropTypes.object,
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('right'),
    level: PropTypes.any.def(null),
    wrapClassName: PropTypes.string, // not use class like react, vue will add class to root dom
    handle: PropTypes.any,
    afterVisibleChange: PropTypes.func,
    keyboard: PropTypes.bool.def(true)
  },
  mixins: [BaseMixin],
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
        return ConfigConsumerProps;
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

      return _extends({
        zIndex: zIndex,
        transform: push ? this.getPushTransform(placement) : undefined
      }, wrapStyle);
    },
    renderHeader: function renderHeader(prefixCls) {
      var h = this.$createElement;
      var _$props2 = this.$props,
          closable = _$props2.closable,
          headerStyle = _$props2.headerStyle;

      var title = getComponentFromProp(this, 'title');
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
        [h(Icon, {
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
          style: _extends({}, containerStyle, drawerStyle),
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

    var props = getOptionProps(this);

    var customizePrefixCls = props.prefixCls,
        width = props.width,
        height = props.height,
        visible = props.visible,
        placement = props.placement,
        wrapClassName = props.wrapClassName,
        mask = props.mask,
        rest = _objectWithoutProperties(props, ['prefixCls', 'width', 'height', 'visible', 'placement', 'wrapClassName', 'mask']);

    var haveMask = mask ? '' : 'no-mask';
    var offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? width + 'px' : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? height + 'px' : height;
    }
    var handler = getComponentFromProp(this, 'handle') || false;
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('drawer', customizePrefixCls);

    var vcDrawerProps = {
      ref: 'vcDrawer',
      props: _extends({}, omit(rest, ['closable', 'destroyOnClose', 'drawerStyle', 'headerStyle', 'bodyStyle', 'title', 'push', 'visible', 'getPopupContainer', 'rootPrefixCls', 'getPrefixCls', 'renderEmpty', 'csp', 'pageHeader', 'autoInsertSpaceInButton']), {
        handler: handler
      }, offsetStyle, {
        prefixCls: prefixCls,
        open: visible,
        showMask: mask,
        placement: placement,
        className: classnames((_classnames = {}, _defineProperty(_classnames, wrapClassName, !!wrapClassName), _defineProperty(_classnames, haveMask, !!haveMask), _classnames)),
        wrapStyle: this.getRcDrawerStyle()
      }),
      on: _extends({}, getListeners(this))
    };
    return h(
      VcDrawer,
      vcDrawerProps,
      [this.renderBody(prefixCls)]
    );
  }
};

/* istanbul ignore next */
Drawer.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;