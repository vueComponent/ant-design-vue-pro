'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _raf = require('../_util/raf');

var _raf2 = _interopRequireDefault(_raf);

var _ListItem = require('./ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var ListBody = {
  name: 'ListBody',
  inheritAttrs: false,
  props: {
    prefixCls: _vueTypes2['default'].string,
    filteredRenderItems: _vueTypes2['default'].array.def([]),
    lazy: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    selectedKeys: _vueTypes2['default'].array,
    disabled: _vueTypes2['default'].bool
  },
  data: function data() {
    return {
      mounted: false
    };
  },

  computed: {
    itemsLength: function itemsLength() {
      return this.filteredRenderItems ? this.filteredRenderItems.length : 0;
    }
  },
  watch: {
    itemsLength: function itemsLength() {
      var _this = this;

      this.$nextTick(function () {
        var lazy = _this.$props.lazy;

        if (lazy !== false) {
          var container = _this.$el;
          _raf2['default'].cancel(_this.lazyId);
          _this.lazyId = (0, _raf2['default'])(function () {
            if (container) {
              var scrollEvent = new Event('scroll', { bubbles: true });
              container.dispatchEvent(scrollEvent);
            }
          });
        }
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.mountId = (0, _raf2['default'])(function () {
      _this2.mounted = true;
    });
  },
  beforeDestroy: function beforeDestroy() {
    _raf2['default'].cancel(this.mountId);
    _raf2['default'].cancel(this.lazyId);
  },

  methods: {
    onItemSelect: function onItemSelect(item) {
      var selectedKeys = this.$props.selectedKeys;

      var checked = selectedKeys.indexOf(item.key) >= 0;
      this.$emit('itemSelect', item.key, !checked);
    },
    onScroll: function onScroll(e) {
      this.$emit('scroll', e);
    }
  },
  render: function render() {
    var _this3 = this;

    var h = arguments[0];
    var mounted = this.$data.mounted;
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        filteredRenderItems = _$props.filteredRenderItems,
        lazy = _$props.lazy,
        selectedKeys = _$props.selectedKeys,
        globalDisabled = _$props.disabled;

    var items = filteredRenderItems.map(function (_ref) {
      var renderedEl = _ref.renderedEl,
          renderedText = _ref.renderedText,
          item = _ref.item;
      var disabled = item.disabled;

      var checked = selectedKeys.indexOf(item.key) >= 0;

      return h(_ListItem2['default'], {
        attrs: {
          disabled: globalDisabled || disabled,

          item: item,
          lazy: lazy,
          renderedText: renderedText,
          renderedEl: renderedEl,
          checked: checked,
          prefixCls: prefixCls
        },
        key: item.key, on: {
          'click': _this3.onItemSelect
        }
      });
    });
    var transitionProps = (0, _getTransitionProps2['default'])(mounted ? prefixCls + '-content-item-highlight' : '', {
      tag: 'ul',
      nativeOn: {
        scroll: this.onScroll
      },
      leave: noop
    });
    return h(
      'transition-group',
      (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': prefixCls + '-content' }, transitionProps]),
      [items]
    );
  }
};

exports['default'] = function (h, props) {
  return h(ListBody, props);
};