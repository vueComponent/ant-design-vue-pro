import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import DropdownMenu from './DropdownMenu';
import { OptionProps } from './Option';
import { PlaceMent } from './placement';

var BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

export default {
  name: 'KeywordTrigger',
  props: {
    loading: PropTypes.bool,
    options: PropTypes.arrayOf(OptionProps),
    prefixCls: PropTypes.string,
    placement: PropTypes.oneOf(PlaceMent),
    visible: PropTypes.bool,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func
  },
  methods: {
    getDropdownPrefix: function getDropdownPrefix() {
      return this.$props.prefixCls + '-dropdown';
    },
    getDropdownElement: function getDropdownElement() {
      var h = this.$createElement;
      var options = this.$props.options;

      return h(DropdownMenu, {
        attrs: { prefixCls: this.getDropdownPrefix(), options: options }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        visible = _$props.visible,
        placement = _$props.placement,
        transitionName = _$props.transitionName,
        getPopupContainer = _$props.getPopupContainer;
    var $slots = this.$slots;


    var children = $slots['default'];

    var popupElement = this.getDropdownElement();

    return h(
      Trigger,
      {
        attrs: {
          prefixCls: this.getDropdownPrefix(),
          popupVisible: visible,
          popup: popupElement,
          popupPlacement: placement === 'top' ? 'topRight' : 'bottomRight',
          popupTransitionName: transitionName,
          builtinPlacements: BUILT_IN_PLACEMENTS,
          getPopupContainer: getPopupContainer
        }
      },
      [children]
    );
  }
};