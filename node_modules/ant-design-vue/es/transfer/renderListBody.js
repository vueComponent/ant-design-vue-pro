import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import raf from '../_util/raf';
import ListItem from './ListItem';
import PropTypes from '../_util/vue-types';
import getTransitionProps from '../_util/getTransitionProps';
function noop() {}
var ListBody = {
  name: 'ListBody',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    filteredRenderItems: PropTypes.array.def([]),
    lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool
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
          raf.cancel(_this.lazyId);
          _this.lazyId = raf(function () {
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

    this.mountId = raf(function () {
      _this2.mounted = true;
    });
  },
  beforeDestroy: function beforeDestroy() {
    raf.cancel(this.mountId);
    raf.cancel(this.lazyId);
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

      return h(ListItem, {
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
    var transitionProps = getTransitionProps(mounted ? prefixCls + '-content-item-highlight' : '', {
      tag: 'ul',
      nativeOn: {
        scroll: this.onScroll
      },
      leave: noop
    });
    return h(
      'transition-group',
      _mergeJSXProps([{ 'class': prefixCls + '-content' }, transitionProps]),
      [items]
    );
  }
};

export default (function (h, props) {
  return h(ListBody, props);
});