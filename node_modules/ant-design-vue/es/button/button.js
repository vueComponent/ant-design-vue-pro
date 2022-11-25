import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import Wave from '../_util/wave';
import Icon from '../icon';
import buttonTypes from './buttonTypes';
import { filterEmpty, getListeners, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

var rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
var isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
var props = buttonTypes();
export default {
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: props,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      },
      sLoading: !!this.loading,
      hasTwoCNChar: false
    };
  },

  computed: {
    classes: function classes() {
      var _ref;

      var customizePrefixCls = this.prefixCls,
          type = this.type,
          shape = this.shape,
          size = this.size,
          hasTwoCNChar = this.hasTwoCNChar,
          sLoading = this.sLoading,
          ghost = this.ghost,
          block = this.block,
          icon = this.icon,
          $slots = this.$slots;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('btn', customizePrefixCls);
      var autoInsertSpace = this.configProvider.autoInsertSpaceInButton !== false;

      // large => lg
      // small => sm
      var sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        default:
          break;
      }
      var iconType = sLoading ? 'loading' : icon;
      var children = filterEmpty($slots['default']);
      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + type, type), _defineProperty(_ref, prefixCls + '-' + shape, shape), _defineProperty(_ref, prefixCls + '-' + sizeCls, sizeCls), _defineProperty(_ref, prefixCls + '-icon-only', children.length === 0 && iconType), _defineProperty(_ref, prefixCls + '-loading', sLoading), _defineProperty(_ref, prefixCls + '-background-ghost', ghost || type === 'ghost'), _defineProperty(_ref, prefixCls + '-two-chinese-chars', hasTwoCNChar && autoInsertSpace), _defineProperty(_ref, prefixCls + '-block', block), _ref;
    }
  },
  watch: {
    loading: function loading(val, preVal) {
      var _this = this;

      if (preVal && typeof preVal !== 'boolean') {
        clearTimeout(this.delayTimeout);
      }
      if (val && typeof val !== 'boolean' && val.delay) {
        this.delayTimeout = setTimeout(function () {
          _this.sLoading = !!val;
        }, val.delay);
      } else {
        this.sLoading = !!val;
      }
    }
  },
  mounted: function mounted() {
    this.fixTwoCNChar();
  },
  updated: function updated() {
    this.fixTwoCNChar();
  },
  beforeDestroy: function beforeDestroy() {
    // if (this.timeout) {
    //   clearTimeout(this.timeout)
    // }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  },

  methods: {
    fixTwoCNChar: function fixTwoCNChar() {
      // Fix for HOC usage like <FormatMessage />
      var node = this.$refs.buttonNode;
      if (!node) {
        return;
      }
      var buttonText = node.textContent;
      if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
        if (!this.hasTwoCNChar) {
          this.hasTwoCNChar = true;
        }
      } else if (this.hasTwoCNChar) {
        this.hasTwoCNChar = false;
      }
    },
    handleClick: function handleClick(event) {
      var sLoading = this.$data.sLoading;

      if (sLoading) {
        return;
      }
      this.$emit('click', event);
    },
    insertSpace: function insertSpace(child, needInserted) {
      var h = this.$createElement;

      var SPACE = needInserted ? ' ' : '';
      if (typeof child.text === 'string') {
        var text = child.text.trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return h('span', [text]);
      }
      return child;
    },
    isNeedInserted: function isNeedInserted() {
      var $slots = this.$slots,
          type = this.type;

      var icon = getComponentFromProp(this, 'icon');
      return $slots['default'] && $slots['default'].length === 1 && !icon && type !== 'link';
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var type = this.type,
        htmlType = this.htmlType,
        classes = this.classes,
        disabled = this.disabled,
        handleClick = this.handleClick,
        sLoading = this.sLoading,
        $slots = this.$slots,
        $attrs = this.$attrs;

    var icon = getComponentFromProp(this, 'icon');
    var buttonProps = {
      attrs: _extends({}, $attrs, {
        disabled: disabled
      }),
      'class': classes,
      on: _extends({}, getListeners(this), {
        click: handleClick
      })
    };
    var iconType = sLoading ? 'loading' : icon;
    var iconNode = iconType ? h(Icon, {
      attrs: { type: iconType }
    }) : null;
    var children = filterEmpty($slots['default']);
    var autoInsertSpace = this.configProvider.autoInsertSpaceInButton !== false;
    var kids = children.map(function (child) {
      return _this2.insertSpace(child, _this2.isNeedInserted() && autoInsertSpace);
    });

    if ($attrs.href !== undefined) {
      return h(
        'a',
        _mergeJSXProps([buttonProps, { ref: 'buttonNode' }]),
        [iconNode, kids]
      );
    }

    var buttonNode = h(
      'button',
      _mergeJSXProps([buttonProps, { ref: 'buttonNode', attrs: { type: htmlType || 'button' }
      }]),
      [iconNode, kids]
    );

    if (type === 'link') {
      return buttonNode;
    }

    return h(Wave, [buttonNode]);
  }
};