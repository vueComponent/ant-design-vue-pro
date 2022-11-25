import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import { isMobile } from 'is-mobile';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'AInputSearch',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps, {
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: PropTypes.any
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    onChange: function onChange(e) {
      if (e && e.target && e.type === 'click') {
        this.$emit('search', e.target.value, e);
      }
      this.$emit('change', e);
    },
    onSearch: function onSearch(e) {
      if (this.loading || this.disabled) {
        return;
      }
      this.$emit('search', this.$refs.input.stateValue, e);
      if (!isMobile({ tablet: true })) {
        this.$refs.input.focus();
      }
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    renderLoading: function renderLoading(prefixCls) {
      var h = this.$createElement;
      var size = this.$props.size;

      var enterButton = getComponentFromProp(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (enterButton) {
        return h(
          Button,
          { 'class': prefixCls + '-button', attrs: { type: 'primary', size: size },
            key: 'enterButton' },
          [h(Icon, {
            attrs: { type: 'loading' }
          })]
        );
      }
      return h(Icon, { 'class': prefixCls + '-icon', attrs: { type: 'loading' },
        key: 'loadingIcon' });
    },
    renderSuffix: function renderSuffix(prefixCls) {
      var h = this.$createElement;
      var loading = this.loading;

      var suffix = getComponentFromProp(this, 'suffix');
      var enterButton = getComponentFromProp(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (loading && !enterButton) {
        return [suffix, this.renderLoading(prefixCls)];
      }

      if (enterButton) return suffix;

      var icon = h(Icon, { 'class': prefixCls + '-icon', attrs: { type: 'search' },
        key: 'searchIcon', on: {
          'click': this.onSearch
        }
      });

      if (suffix) {
        // let cloneSuffix = suffix;
        // if (isValidElement(cloneSuffix) && !cloneSuffix.key) {
        //   cloneSuffix = cloneElement(cloneSuffix, {
        //     key: 'originSuffix',
        //   });
        // }
        return [suffix, icon];
      }

      return icon;
    },
    renderAddonAfter: function renderAddonAfter(prefixCls) {
      var h = this.$createElement;
      var size = this.size,
          disabled = this.disabled,
          loading = this.loading;

      var btnClassName = prefixCls + '-button';
      var enterButton = getComponentFromProp(this, 'enterButton');
      enterButton = enterButton || enterButton === '';
      var addonAfter = getComponentFromProp(this, 'addonAfter');
      if (loading && enterButton) {
        return [this.renderLoading(prefixCls), addonAfter];
      }
      if (!enterButton) return addonAfter;
      var enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      var button = void 0;
      var isAntdButton = enterButtonAsElement.componentOptions && enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON;
      if (enterButtonAsElement.tag === 'button' || isAntdButton) {
        button = cloneElement(enterButtonAsElement, {
          key: 'enterButton',
          'class': isAntdButton ? btnClassName : '',
          props: isAntdButton ? { size: size } : {},
          on: {
            click: this.onSearch
          }
        });
      } else {
        button = h(
          Button,
          {
            'class': btnClassName,
            attrs: { type: 'primary',
              size: size,
              disabled: disabled
            },
            key: 'enterButton',
            on: {
              'click': this.onSearch
            }
          },
          [enterButton === true || enterButton === '' ? h(Icon, {
            attrs: { type: 'search' }
          }) : enterButton]
        );
      }
      if (addonAfter) {
        return [button, addonAfter];
      }

      return button;
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        customizeInputPrefixCls = _getOptionProps.inputPrefixCls,
        size = _getOptionProps.size,
        loading = _getOptionProps.loading,
        others = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'inputPrefixCls', 'size', 'loading']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input-search', customizePrefixCls);
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    var enterButton = getComponentFromProp(this, 'enterButton');
    var addonBefore = getComponentFromProp(this, 'addonBefore');
    enterButton = enterButton || enterButton === '';
    var inputClassName = void 0;
    if (enterButton) {
      var _classNames;

      inputClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-enter-button', !!enterButton), _defineProperty(_classNames, prefixCls + '-' + size, !!size), _classNames));
    } else {
      inputClassName = prefixCls;
    }

    var on = _extends({}, getListeners(this));
    delete on.search;
    var inputProps = {
      props: _extends({}, others, {
        prefixCls: inputPrefixCls,
        size: size,
        suffix: this.renderSuffix(prefixCls),
        prefix: getComponentFromProp(this, 'prefix'),
        addonAfter: this.renderAddonAfter(prefixCls),
        addonBefore: addonBefore,
        className: inputClassName
      }),
      attrs: this.$attrs,
      ref: 'input',
      on: _extends({
        pressEnter: this.onSearch
      }, on, {
        change: this.onChange
      })
    };
    return h(Input, inputProps);
  }
};