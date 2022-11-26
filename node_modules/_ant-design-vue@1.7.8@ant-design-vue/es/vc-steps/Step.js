import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';

function isString(str) {
  return typeof str === 'string';
}
function noop() {}
export default {
  name: 'Step',
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    itemWidth: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.any,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.string,
    stepIndex: PropTypes.number,
    description: PropTypes.any,
    title: PropTypes.any,
    subTitle: PropTypes.any,
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    tailContent: PropTypes.any,
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any
    }).loose
  },
  methods: {
    onClick: function onClick() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.$emit.apply(this, ['click'].concat(_toConsumableArray(args)));
      this.$emit('stepClick', this.stepIndex);
    },
    renderIconNode: function renderIconNode() {
      var _iconClassName;

      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          prefixCls = _getOptionProps.prefixCls,
          stepNumber = _getOptionProps.stepNumber,
          status = _getOptionProps.status,
          iconPrefix = _getOptionProps.iconPrefix,
          icons = _getOptionProps.icons;

      var progressDot = this.progressDot;
      if (progressDot === undefined) {
        progressDot = this.$scopedSlots.progressDot;
      }
      var icon = getComponentFromProp(this, 'icon');
      var title = getComponentFromProp(this, 'title');
      var description = getComponentFromProp(this, 'description');
      var iconNode = void 0;
      var iconClassName = (_iconClassName = {}, _defineProperty(_iconClassName, prefixCls + '-icon', true), _defineProperty(_iconClassName, iconPrefix + 'icon', true), _defineProperty(_iconClassName, iconPrefix + 'icon-' + icon, icon && isString(icon)), _defineProperty(_iconClassName, iconPrefix + 'icon-check', !icon && status === 'finish' && icons && !icons.finish), _defineProperty(_iconClassName, iconPrefix + 'icon-close', !icon && status === 'error' && icons && !icons.error), _iconClassName);
      var iconDot = h('span', { 'class': prefixCls + '-icon-dot' });
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = h(
            'span',
            { 'class': prefixCls + '-icon' },
            [progressDot({ index: stepNumber - 1, status: status, title: title, description: description, prefixCls: prefixCls })]
          );
        } else {
          iconNode = h(
            'span',
            { 'class': prefixCls + '-icon' },
            [iconDot]
          );
        }
      } else if (icon && !isString(icon)) {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [icon]
        );
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [icons.finish]
        );
      } else if (icons && icons.error && status === 'error') {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [icons.error]
        );
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = h('span', { 'class': iconClassName });
      } else {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [stepNumber]
        );
      }
      return iconNode;
    }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];

    var _getOptionProps2 = getOptionProps(this),
        prefixCls = _getOptionProps2.prefixCls,
        itemWidth = _getOptionProps2.itemWidth,
        active = _getOptionProps2.active,
        _getOptionProps2$stat = _getOptionProps2.status,
        status = _getOptionProps2$stat === undefined ? 'wait' : _getOptionProps2$stat,
        tailContent = _getOptionProps2.tailContent,
        adjustMarginRight = _getOptionProps2.adjustMarginRight,
        disabled = _getOptionProps2.disabled;

    var title = getComponentFromProp(this, 'title');
    var subTitle = getComponentFromProp(this, 'subTitle');
    var description = getComponentFromProp(this, 'description');

    var classString = (_classString = {}, _defineProperty(_classString, prefixCls + '-item', true), _defineProperty(_classString, prefixCls + '-item-' + status, true), _defineProperty(_classString, prefixCls + '-item-custom', getComponentFromProp(this, 'icon')), _defineProperty(_classString, prefixCls + '-item-active', active), _defineProperty(_classString, prefixCls + '-item-disabled', disabled === true), _classString);
    var stepProps = {
      'class': classString,
      on: getListeners(this)
    };
    var stepItemStyle = {};
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }
    var listeners = getListeners(this);
    var accessibilityProps = {
      attrs: {},
      on: {
        click: listeners.click || noop
      }
    };
    if (listeners.stepClick && !disabled) {
      accessibilityProps.attrs.role = 'button';
      accessibilityProps.attrs.tabIndex = 0;
      accessibilityProps.on.click = this.onClick;
    }
    return h(
      'div',
      _mergeJSXProps([stepProps, { style: stepItemStyle }]),
      [h(
        'div',
        _mergeJSXProps([accessibilityProps, { 'class': prefixCls + '-item-container' }]),
        [h(
          'div',
          { 'class': prefixCls + '-item-tail' },
          [tailContent]
        ), h(
          'div',
          { 'class': prefixCls + '-item-icon' },
          [this.renderIconNode()]
        ), h(
          'div',
          { 'class': prefixCls + '-item-content' },
          [h(
            'div',
            { 'class': prefixCls + '-item-title' },
            [title, subTitle && h(
              'div',
              {
                attrs: { title: subTitle },
                'class': prefixCls + '-item-subtitle' },
              [subTitle]
            )]
          ), description && h(
            'div',
            { 'class': prefixCls + '-item-description' },
            [description]
          )]
        )]
      )]
    );
  }
};