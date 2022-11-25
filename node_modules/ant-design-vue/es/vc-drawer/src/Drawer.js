import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import classnames from 'classnames';
import Vue from 'vue';
import ref from 'vue-ref';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, getEvents, getListeners } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import getScrollBarSize from '../../_util/getScrollBarSize';
import { IDrawerProps } from './IDrawerPropTypes';
import KeyCode from '../../_util/KeyCode';
import { dataToArray, transitionEnd, transitionStr, addEventListener, removeEventListener, transformArguments, isNumeric } from './utils';
import Portal from '../../_util/Portal';

function noop() {}

var currentDrawer = {};
var windowIsUndefined = !(typeof window !== 'undefined' && window.document && window.document.createElement);

Vue.use(ref, { name: 'ant-ref' });
var Drawer = {
  mixins: [BaseMixin],
  props: initDefaultProps(IDrawerProps, {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    duration: '.3s',
    ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    firstEnter: false, // 记录首次进入.
    showMask: true,
    handler: true,
    maskStyle: {},
    wrapperClassName: '',
    className: ''
  }),
  data: function data() {
    this.levelDom = [];
    this.contentDom = null;
    this.maskDom = null;
    this.handlerdom = null;
    this.mousePos = null;
    this.sFirstEnter = this.firstEnter;
    this.timeout = null;
    this.children = null;
    this.drawerId = Number((Date.now() + Math.random()).toString().replace('.', Math.round(Math.random() * 9))).toString(16);
    var open = this.open !== undefined ? this.open : !!this.defaultOpen;
    currentDrawer[this.drawerId] = open;
    this.orignalOpen = this.open;
    this.preProps = _extends({}, this.$props);
    return {
      sOpen: open
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (!windowIsUndefined) {
        var passiveSupported = false;
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
          get: function get() {
            passiveSupported = true;
            return null;
          }
        }));
        _this.passive = passiveSupported ? { passive: false } : false;
      }
      var open = _this.getOpen();
      if (_this.handler || open || _this.sFirstEnter) {
        _this.getDefault(_this.$props);
        if (open) {
          _this.isOpenChange = true;
          _this.$nextTick(function () {
            _this.domFocus();
          });
        }
        _this.$forceUpdate();
      }
    });
  },

  watch: {
    open: function (_open) {
      function open(_x) {
        return _open.apply(this, arguments);
      }

      open.toString = function () {
        return _open.toString();
      };

      return open;
    }(function (val) {
      var _this2 = this;

      if (val !== undefined && val !== this.preProps.open) {
        this.isOpenChange = true;
        // 没渲染 dom 时，获取默认数据;
        if (!this.container) {
          this.getDefault(this.$props);
        }
        this.setState({
          sOpen: open
        });
      }
      this.preProps.open = val;
      if (val) {
        this.$nextTick(function () {
          _this2.domFocus();
        });
      }
    }),
    placement: function placement(val) {
      if (val !== this.preProps.placement) {
        // test 的 bug, 有动画过场，删除 dom
        this.contentDom = null;
      }
      this.preProps.placement = val;
    },
    level: function level(val) {
      if (this.preProps.level !== val) {
        this.getParentAndLevelDom(this.$props);
      }
      this.preProps.level = val;
    }
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      // dom 没渲染时，重走一遍。
      if (!_this3.sFirstEnter && _this3.container) {
        _this3.$forceUpdate();
        _this3.sFirstEnter = true;
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    delete currentDrawer[this.drawerId];
    delete this.isOpenChange;
    if (this.container) {
      if (this.sOpen) {
        this.setLevelDomTransform(false, true);
      }
      document.body.style.overflow = '';
    }
    this.sFirstEnter = false;
    clearTimeout(this.timeout);
  },

  methods: {
    domFocus: function domFocus() {
      if (this.dom) {
        this.dom.focus();
      }
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === KeyCode.ESC) {
        e.stopPropagation();
        this.$emit('close', e);
      }
    },
    onMaskTouchEnd: function onMaskTouchEnd(e) {
      this.$emit('close', e);
      this.onTouchEnd(e, true);
    },
    onIconTouchEnd: function onIconTouchEnd(e) {
      this.$emit('handleClick', e);
      this.onTouchEnd(e);
    },
    onTouchEnd: function onTouchEnd(e, close) {
      if (this.open !== undefined) {
        return;
      }
      var open = close || this.sOpen;
      this.isOpenChange = true;
      this.setState({
        sOpen: !open
      });
    },
    onWrapperTransitionEnd: function onWrapperTransitionEnd(e) {
      if (e.target === this.contentWrapper && e.propertyName.match(/transform$/)) {
        var _open2 = this.getOpen();
        this.dom.style.transition = '';
        if (!_open2 && this.getCurrentDrawerSome()) {
          document.body.style.overflowX = '';
          if (this.maskDom) {
            this.maskDom.style.left = '';
            this.maskDom.style.width = '';
          }
        }
        if (this.afterVisibleChange) {
          this.afterVisibleChange(!!_open2);
        }
      }
    },
    getDefault: function getDefault(props) {
      this.getParentAndLevelDom(props);
      if (props.getContainer || props.parent) {
        this.container = this.defaultGetContainer();
      }
    },
    getCurrentDrawerSome: function getCurrentDrawerSome() {
      return !Object.keys(currentDrawer).some(function (key) {
        return currentDrawer[key];
      });
    },
    getSelfContainer: function getSelfContainer() {
      return this.container;
    },
    getParentAndLevelDom: function getParentAndLevelDom(props) {
      var _this4 = this;

      if (windowIsUndefined) {
        return;
      }
      var level = props.level,
          getContainer = props.getContainer;

      this.levelDom = [];
      if (getContainer) {
        if (typeof getContainer === 'string') {
          var dom = document.querySelectorAll(getContainer)[0];
          this.parent = dom;
        }
        if (typeof getContainer === 'function') {
          this.parent = getContainer();
        }
        if ((typeof getContainer === 'undefined' ? 'undefined' : _typeof(getContainer)) === 'object' && getContainer instanceof window.HTMLElement) {
          this.parent = getContainer;
        }
      }
      if (!getContainer && this.container) {
        this.parent = this.container.parentNode;
      }
      if (level === 'all') {
        var children = Array.prototype.slice.call(this.parent.children);
        children.forEach(function (child) {
          if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE' && child.nodeName !== 'LINK' && child !== _this4.container) {
            _this4.levelDom.push(child);
          }
        });
      } else if (level) {
        dataToArray(level).forEach(function (key) {
          document.querySelectorAll(key).forEach(function (item) {
            _this4.levelDom.push(item);
          });
        });
      }
    },
    setLevelDomTransform: function setLevelDomTransform(open, openTransition, placementName, value) {
      var _this5 = this;

      var _$props = this.$props,
          placement = _$props.placement,
          levelMove = _$props.levelMove,
          duration = _$props.duration,
          ease = _$props.ease,
          getContainer = _$props.getContainer;

      if (!windowIsUndefined) {
        this.levelDom.forEach(function (dom) {
          if (_this5.isOpenChange || openTransition) {
            /* eslint no-param-reassign: "error" */
            dom.style.transition = 'transform ' + duration + ' ' + ease;
            addEventListener(dom, transitionEnd, _this5.trnasitionEnd);
            var levelValue = open ? value : 0;
            if (levelMove) {
              var $levelMove = transformArguments(levelMove, { target: dom, open: open });
              levelValue = open ? $levelMove[0] : $levelMove[1] || 0;
            }
            var $value = typeof levelValue === 'number' ? levelValue + 'px' : levelValue;
            var placementPos = placement === 'left' || placement === 'top' ? $value : '-' + $value;
            dom.style.transform = levelValue ? placementName + '(' + placementPos + ')' : '';
            dom.style.msTransform = levelValue ? placementName + '(' + placementPos + ')' : '';
          }
        });
        // 处理 body 滚动
        if (getContainer === 'body') {
          var eventArray = ['touchstart'];
          var domArray = [document.body, this.maskDom, this.handlerdom, this.contentDom];
          var right = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth ? getScrollBarSize(1) : 0;
          var widthTransition = 'width ' + duration + ' ' + ease;
          var trannsformTransition = 'transform ' + duration + ' ' + ease;
          if (open && document.body.style.overflow !== 'hidden') {
            document.body.style.overflow = 'hidden';
            if (right) {
              document.body.style.position = 'relative';
              document.body.style.width = 'calc(100% - ' + right + 'px)';
              this.dom.style.transition = 'none';
              switch (placement) {
                case 'right':
                  this.dom.style.transform = 'translateX(-' + right + 'px)';
                  this.dom.style.msTransform = 'translateX(-' + right + 'px)';
                  break;
                case 'top':
                case 'bottom':
                  this.dom.style.width = 'calc(100% - ' + right + 'px)';
                  this.dom.style.transform = 'translateZ(0)';
                  break;
                default:
                  break;
              }
              clearTimeout(this.timeout);
              this.timeout = setTimeout(function () {
                _this5.dom.style.transition = trannsformTransition + ',' + widthTransition;
                _this5.dom.style.width = '';
                _this5.dom.style.transform = '';
                _this5.dom.style.msTransform = '';
              });
            }
            // 手机禁滚
            domArray.forEach(function (item, i) {
              if (!item) {
                return;
              }
              addEventListener(item, eventArray[i] || 'touchmove', i ? _this5.removeMoveHandler : _this5.removeStartHandler, _this5.passive);
            });
          } else if (this.getCurrentDrawerSome()) {
            document.body.style.overflow = '';
            if ((this.isOpenChange || openTransition) && right) {
              document.body.style.position = '';
              document.body.style.width = '';
              if (transitionStr) {
                document.body.style.overflowX = 'hidden';
              }
              this.dom.style.transition = 'none';
              var heightTransition = void 0;
              switch (placement) {
                case 'right':
                  {
                    this.dom.style.transform = 'translateX(' + right + 'px)';
                    this.dom.style.msTransform = 'translateX(' + right + 'px)';
                    this.dom.style.width = '100%';
                    widthTransition = 'width 0s ' + ease + ' ' + duration;
                    if (this.maskDom) {
                      this.maskDom.style.left = '-' + right + 'px';
                      this.maskDom.style.width = 'calc(100% + ' + right + 'px)';
                    }
                    break;
                  }
                case 'top':
                case 'bottom':
                  {
                    this.dom.style.width = 'calc(100% + ' + right + 'px)';
                    this.dom.style.height = '100%';
                    this.dom.style.transform = 'translateZ(0)';
                    heightTransition = 'height 0s ' + ease + ' ' + duration;
                    break;
                  }
                default:
                  break;
              }
              clearTimeout(this.timeout);
              this.timeout = setTimeout(function () {
                _this5.dom.style.transition = trannsformTransition + ',' + (heightTransition ? heightTransition + ',' : '') + widthTransition;
                _this5.dom.style.transform = '';
                _this5.dom.style.msTransform = '';
                _this5.dom.style.width = '';
                _this5.dom.style.height = '';
              });
            }
            domArray.forEach(function (item, i) {
              if (!item) {
                return;
              }
              removeEventListener(item, eventArray[i] || 'touchmove', i ? _this5.removeMoveHandler : _this5.removeStartHandler, _this5.passive);
            });
          }
        }
      }

      var _getListeners = getListeners(this),
          change = _getListeners.change;

      if (change && this.isOpenChange && this.sFirstEnter) {
        change(open);
        this.isOpenChange = false;
      }
    },
    getChildToRender: function getChildToRender(open) {
      var _classnames,
          _this6 = this;

      var h = this.$createElement;
      var _$props2 = this.$props,
          className = _$props2.className,
          prefixCls = _$props2.prefixCls,
          placement = _$props2.placement,
          handler = _$props2.handler,
          showMask = _$props2.showMask,
          maskStyle = _$props2.maskStyle,
          width = _$props2.width,
          height = _$props2.height,
          wrapStyle = _$props2.wrapStyle,
          keyboard = _$props2.keyboard,
          maskClosable = _$props2.maskClosable;

      var children = this.$slots['default'];
      var wrapperClassname = classnames(prefixCls, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-' + placement, true), _defineProperty(_classnames, prefixCls + '-open', open), _defineProperty(_classnames, className, !!className), _defineProperty(_classnames, 'no-mask', !showMask), _classnames));
      var isOpenChange = this.isOpenChange;
      var isHorizontal = placement === 'left' || placement === 'right';
      var placementName = 'translate' + (isHorizontal ? 'X' : 'Y');
      // 百分比与像素动画不同步，第一次打用后全用像素动画。
      // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
      var placementPos = placement === 'left' || placement === 'top' ? '-100%' : '100%';
      var transform = open ? '' : placementName + '(' + placementPos + ')';
      if (isOpenChange === undefined || isOpenChange) {
        var contentValue = this.contentDom ? this.contentDom.getBoundingClientRect()[isHorizontal ? 'width' : 'height'] : 0;
        var value = (isHorizontal ? width : height) || contentValue;
        this.setLevelDomTransform(open, false, placementName, value);
      }
      var handlerChildren = void 0;
      if (handler !== false) {
        var handlerDefalut = h(
          'div',
          { 'class': 'drawer-handle' },
          [h('i', { 'class': 'drawer-handle-icon' })]
        );
        var handlerSlot = this.handler;

        var handlerSlotVnode = handlerSlot && handlerSlot[0] || handlerDefalut;

        var _getEvents = getEvents(handlerSlotVnode),
            handleIconClick = _getEvents.click;

        handlerChildren = cloneElement(handlerSlotVnode, {
          on: {
            click: function click(e) {
              handleIconClick && handleIconClick();
              _this6.onIconTouchEnd(e);
            }
          },
          directives: [{
            name: 'ant-ref',
            value: function value(c) {
              _this6.handlerdom = c;
            }
          }]
        });
      }
      var domContProps = {
        'class': wrapperClassname,
        directives: [{
          name: 'ant-ref',
          value: function value(c) {
            _this6.dom = c;
          }
        }],
        on: {
          transitionend: this.onWrapperTransitionEnd,
          keydown: open && keyboard ? this.onKeyDown : noop
        },
        style: wrapStyle
      };
      var directivesMaskDom = [{
        name: 'ant-ref',
        value: function value(c) {
          _this6.maskDom = c;
        }
      }];
      var directivesContentWrapper = [{
        name: 'ant-ref',
        value: function value(c) {
          _this6.contentWrapper = c;
        }
      }];
      var directivesContentDom = [{
        name: 'ant-ref',
        value: function value(c) {
          _this6.contentDom = c;
        }
      }];
      return h(
        'div',
        _mergeJSXProps([domContProps, {
          attrs: { tabIndex: -1 }
        }]),
        [showMask && h('div', _mergeJSXProps([{
          key: open // 第二次渲染时虚拟DOM没有改变，没有出发dom更新，使用key强制更新 https://github.com/vueComponent/ant-design-vue/issues/2407
          , 'class': prefixCls + '-mask',
          on: {
            'click': maskClosable ? this.onMaskTouchEnd : noop
          },

          style: maskStyle
        }, { directives: directivesMaskDom }])), h(
          'div',
          _mergeJSXProps([{
            'class': prefixCls + '-content-wrapper',
            style: {
              transform: transform,
              msTransform: transform,
              width: isNumeric(width) ? width + 'px' : width,
              height: isNumeric(height) ? height + 'px' : height
            }
          }, { directives: directivesContentWrapper }]),
          [h(
            'div',
            _mergeJSXProps([{
              'class': prefixCls + '-content'
            }, { directives: directivesContentDom }, {
              on: {
                'touchstart': open ? this.removeStartHandler : noop,
                'touchmove': open ? this.removeMoveHandler : noop
              }
            }]),
            [children]
          ), handlerChildren]
        )]
      );
    },
    getOpen: function getOpen() {
      return this.open !== undefined ? this.open : this.sOpen;
    },
    getTouchParentScroll: function getTouchParentScroll(root, currentTarget, differX, differY) {
      if (!currentTarget || currentTarget === document) {
        return false;
      }
      // root 为 drawer-content 设定了 overflow, 判断为 root 的 parent 时结束滚动；
      if (currentTarget === root.parentNode) {
        return true;
      }

      var isY = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differY);
      var isX = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differX);

      var scrollY = currentTarget.scrollHeight - currentTarget.clientHeight;
      var scrollX = currentTarget.scrollWidth - currentTarget.clientWidth;
      /**
       * <div style="height: 300px">
       *   <div style="height: 900px"></div>
       * </div>
       * 在没设定 overflow: auto 或 scroll 时，currentTarget 里获取不到 scrollTop 或 scrollLeft,
       * 预先用 scrollTo 来滚动，如果取出的值跟滚动前取出不同，则 currnetTarget 被设定了 overflow; 否则就是上面这种。
       */
      var t = currentTarget.scrollTop;
      var l = currentTarget.scrollLeft;
      if (currentTarget.scrollTo) {
        currentTarget.scrollTo(currentTarget.scrollLeft + 1, currentTarget.scrollTop + 1);
      }
      var currentT = currentTarget.scrollTop;
      var currentL = currentTarget.scrollLeft;
      if (currentTarget.scrollTo) {
        currentTarget.scrollTo(currentTarget.scrollLeft - 1, currentTarget.scrollTop - 1);
      }
      if (isY && (!scrollY || !(currentT - t) || scrollY && (currentTarget.scrollTop >= scrollY && differY < 0 || currentTarget.scrollTop <= 0 && differY > 0)) || isX && (!scrollX || !(currentL - l) || scrollX && (currentTarget.scrollLeft >= scrollX && differX < 0 || currentTarget.scrollLeft <= 0 && differX > 0))) {
        return this.getTouchParentScroll(root, currentTarget.parentNode, differX, differY);
      }
      return false;
    },
    removeStartHandler: function removeStartHandler(e) {
      if (e.touches.length > 1) {
        return;
      }
      this.startPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    },
    removeMoveHandler: function removeMoveHandler(e) {
      if (e.changedTouches.length > 1) {
        return;
      }
      var currentTarget = e.currentTarget;
      var differX = e.changedTouches[0].clientX - this.startPos.x;
      var differY = e.changedTouches[0].clientY - this.startPos.y;
      if (currentTarget === this.maskDom || currentTarget === this.handlerdom || currentTarget === this.contentDom && this.getTouchParentScroll(currentTarget, e.target, differX, differY)) {
        e.preventDefault();
      }
    },
    trnasitionEnd: function trnasitionEnd(e) {
      removeEventListener(e.target, transitionEnd, this.trnasitionEnd);
      e.target.style.transition = '';
    },
    defaultGetContainer: function defaultGetContainer() {
      if (windowIsUndefined) {
        return null;
      }
      var container = document.createElement('div');
      this.parent.appendChild(container);
      if (this.wrapperClassName) {
        container.className = this.wrapperClassName;
      }
      return container;
    }
  },

  render: function render() {
    var _this7 = this;

    var h = arguments[0];
    var _$props3 = this.$props,
        getContainer = _$props3.getContainer,
        wrapperClassName = _$props3.wrapperClassName,
        handler = _$props3.handler,
        forceRender = _$props3.forceRender;

    var open = this.getOpen();
    var portal = null;
    currentDrawer[this.drawerId] = open ? this.container : open;
    var children = this.getChildToRender(this.sFirstEnter ? open : false);
    if (!getContainer) {
      var directives = [{
        name: 'ant-ref',
        value: function value(c) {
          _this7.container = c;
        }
      }];
      return h(
        'div',
        _mergeJSXProps([{ 'class': wrapperClassName }, { directives: directives }]),
        [children]
      );
    }
    if (!this.container || !open && !this.sFirstEnter) {
      return null;
    }
    // 如果有 handler 为内置强制渲染；
    var $forceRender = !!handler || forceRender;
    if ($forceRender || open || this.dom) {
      portal = h(Portal, {
        attrs: { getContainer: this.getSelfContainer, children: children }
      });
    }
    return portal;
  }
};

export default Drawer;