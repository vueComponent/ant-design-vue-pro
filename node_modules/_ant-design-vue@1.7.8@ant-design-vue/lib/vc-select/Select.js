'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _vcMenu = require('../vc-menu');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _OptGroup = require('./OptGroup');

var _OptGroup2 = _interopRequireDefault(_OptGroup);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _vnode = require('../_util/vnode');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _proxyComponent = require('../_util/proxyComponent');

var _proxyComponent2 = _interopRequireDefault(_proxyComponent);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _util = require('./util');

var _PropTypes = require('./PropTypes');

var _contains = require('../vc-util/Dom/contains');

var _contains2 = _interopRequireDefault(_contains);

var _env = require('../_util/env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' });
var SELECT_EMPTY_VALUE_KEY = 'RC_SELECT_EMPTY_VALUE_KEY';

var noop = function noop() {
  return null;
};

// Where el is the DOM element you'd like to test for visibility
function isHidden(node) {
  return !node || node.offsetParent === null;
}

function chaining() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    // eslint-disable-line
    // eslint-disable-line
    for (var i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(chaining, args);
      }
    }
  };
}
var Select = {
  inheritAttrs: false,
  Option: _Option2['default'],
  OptGroup: _OptGroup2['default'],
  name: 'Select',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends3['default'])({}, _PropTypes.SelectPropTypes, {
    prefixCls: _PropTypes.SelectPropTypes.prefixCls.def('rc-select'),
    defaultOpen: _vueTypes2['default'].bool.def(false),
    labelInValue: _PropTypes.SelectPropTypes.labelInValue.def(false),
    defaultActiveFirstOption: _PropTypes.SelectPropTypes.defaultActiveFirstOption.def(true),
    showSearch: _PropTypes.SelectPropTypes.showSearch.def(true),
    allowClear: _PropTypes.SelectPropTypes.allowClear.def(false),
    placeholder: _PropTypes.SelectPropTypes.placeholder.def(''),
    // showArrow: SelectPropTypes.showArrow.def(true),
    dropdownMatchSelectWidth: _vueTypes2['default'].bool.def(true),
    dropdownStyle: _PropTypes.SelectPropTypes.dropdownStyle.def(function () {
      return {};
    }),
    dropdownMenuStyle: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    optionFilterProp: _PropTypes.SelectPropTypes.optionFilterProp.def('value'),
    optionLabelProp: _PropTypes.SelectPropTypes.optionLabelProp.def('value'),
    notFoundContent: _vueTypes2['default'].any.def('Not Found'),
    backfill: _vueTypes2['default'].bool.def(false),
    showAction: _PropTypes.SelectPropTypes.showAction.def(['click']),
    combobox: _vueTypes2['default'].bool.def(false),
    tokenSeparators: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string).def([]),
    autoClearSearchValue: _vueTypes2['default'].bool.def(true),
    tabIndex: _vueTypes2['default'].any.def(0),
    dropdownRender: _vueTypes2['default'].func.def(function (menu) {
      return menu;
    })
    // onChange: noop,
    // onFocus: noop,
    // onBlur: noop,
    // onSelect: noop,
    // onSearch: noop,
    // onDeselect: noop,
    // onInputKeydown: noop,
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  created: function created() {
    this.saveInputRef = (0, _util.saveRef)(this, 'inputRef');
    this.saveInputMirrorRef = (0, _util.saveRef)(this, 'inputMirrorRef');
    this.saveTopCtrlRef = (0, _util.saveRef)(this, 'topCtrlRef');
    this.saveSelectTriggerRef = (0, _util.saveRef)(this, 'selectTriggerRef');
    this.saveRootRef = (0, _util.saveRef)(this, 'rootRef');
    this.saveSelectionRef = (0, _util.saveRef)(this, 'selectionRef');
    this._focused = false;
    this._mouseDown = false;
    this._options = [];
    this._empty = false;
  },
  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var optionsInfo = this.getOptionsInfoFromProps(props);
    (0, _warning2['default'])(this.__propsSymbol__, 'Replace slots.default with props.children and pass props.__propsSymbol__');
    if (props.tags && typeof props.filterOption !== 'function') {
      var isDisabledExist = Object.keys(optionsInfo).some(function (key) {
        return optionsInfo[key].disabled;
      });
      (0, _warning2['default'])(!isDisabledExist, 'Please avoid setting option to disabled in tags mode since user can always type text as tag.');
    }
    var state = {
      _value: this.getValueFromProps(props, true), // true: use default value
      _inputValue: props.combobox ? this.getInputValueForCombobox(props, optionsInfo, true // use default value
      ) : '',
      _open: props.defaultOpen,
      _optionsInfo: optionsInfo,
      _backfillValue: '',
      // a flag for aviod redundant getOptionsInfoFromProps call
      _skipBuildOptionsInfo: true,
      _ariaId: (0, _util.generateUUID)()
    };
    return (0, _extends3['default'])({}, state, {
      _mirrorInputValue: state._inputValue }, this.getDerivedState(props, state));
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      // when defaultOpen is true, we should auto focus search input
      // https://github.com/ant-design/ant-design/issues/14254
      if (_this.autoFocus || _this._open) {
        _this.focus();
      }
      // this.setState({
      //   _ariaId: generateUUID(),
      // });
    });
  },

  watch: {
    __propsSymbol__: function __propsSymbol__() {
      (0, _extends3['default'])(this.$data, this.getDerivedState((0, _propsUtil.getOptionProps)(this), this.$data));
    },
    '$data._inputValue': function $data_inputValue(val) {
      this.$data._mirrorInputValue = val;
    }
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      if ((0, _util.isMultipleOrTags)(_this2.$props)) {
        var inputNode = _this2.getInputDOMNode();
        var mirrorNode = _this2.getInputMirrorDOMNode();
        if (inputNode && inputNode.value && mirrorNode) {
          inputNode.style.width = '';
          inputNode.style.width = mirrorNode.clientWidth + 10 + 'px';
        } else if (inputNode) {
          inputNode.style.width = '';
        }
      }
      _this2.forcePopupAlign();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearFocusTime();
    this.clearBlurTime();
    this.clearComboboxTime();
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  methods: {
    getDerivedState: function getDerivedState(nextProps, prevState) {
      var optionsInfo = prevState._skipBuildOptionsInfo ? prevState._optionsInfo : this.getOptionsInfoFromProps(nextProps, prevState);

      var newState = {
        _optionsInfo: optionsInfo,
        _skipBuildOptionsInfo: false
      };

      if ('open' in nextProps) {
        newState._open = nextProps.open;
      }

      if ('value' in nextProps) {
        var value = this.getValueFromProps(nextProps);
        newState._value = value;
        if (nextProps.combobox) {
          newState._inputValue = this.getInputValueForCombobox(nextProps, optionsInfo);
        }
      }
      return newState;
    },
    getOptionsFromChildren: function getOptionsFromChildren() {
      var _this3 = this;

      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          _this3.getOptionsFromChildren(child.componentOptions.children, options);
        } else {
          options.push(child);
        }
      });
      return options;
    },
    getInputValueForCombobox: function getInputValueForCombobox(props, optionsInfo, useDefaultValue) {
      var value = [];
      if ('value' in props && !useDefaultValue) {
        value = (0, _util.toArray)(props.value);
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = (0, _util.toArray)(props.defaultValue);
      }
      if (value.length) {
        value = value[0];
      } else {
        return '';
      }
      var label = value;
      if (props.labelInValue) {
        label = value.label;
      } else if (optionsInfo[(0, _util.getMapKey)(value)]) {
        label = optionsInfo[(0, _util.getMapKey)(value)].label;
      }
      if (label === undefined) {
        label = '';
      }
      return label;
    },
    getLabelFromOption: function getLabelFromOption(props, option) {
      return (0, _util.getPropValue)(option, props.optionLabelProp);
    },
    getOptionsInfoFromProps: function getOptionsInfoFromProps(props, preState) {
      var _this4 = this;

      var options = this.getOptionsFromChildren(this.$props.children);
      var optionsInfo = {};
      options.forEach(function (option) {
        var singleValue = (0, _util.getValuePropValue)(option);
        optionsInfo[(0, _util.getMapKey)(singleValue)] = {
          option: option,
          value: singleValue,
          label: _this4.getLabelFromOption(props, option),
          title: (0, _propsUtil.getValueByProp)(option, 'title'),
          disabled: (0, _propsUtil.getValueByProp)(option, 'disabled')
        };
      });
      if (preState) {
        // keep option info in pre state value.
        var oldOptionsInfo = preState._optionsInfo;
        var value = preState._value;
        if (value) {
          value.forEach(function (v) {
            var key = (0, _util.getMapKey)(v);
            if (!optionsInfo[key] && oldOptionsInfo[key] !== undefined) {
              optionsInfo[key] = oldOptionsInfo[key];
            }
          });
        }
      }
      return optionsInfo;
    },
    getValueFromProps: function getValueFromProps(props, useDefaultValue) {
      var value = [];
      if ('value' in props && !useDefaultValue) {
        value = (0, _util.toArray)(props.value);
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = (0, _util.toArray)(props.defaultValue);
      }
      if (props.labelInValue) {
        value = value.map(function (v) {
          return v.key;
        });
      }
      return value;
    },
    onInputChange: function onInputChange(e) {
      var _e$target = e.target,
          val = _e$target.value,
          composing = _e$target.composing;

      var _$data$_inputValue = this.$data._inputValue,
          _inputValue = _$data$_inputValue === undefined ? '' : _$data$_inputValue;

      if (e.isComposing || composing || _inputValue === val) {
        this.setState({
          _mirrorInputValue: val
        });
        return;
      }
      var tokenSeparators = this.$props.tokenSeparators;

      if ((0, _util.isMultipleOrTags)(this.$props) && tokenSeparators.length && (0, _util.includesSeparators)(val, tokenSeparators)) {
        var nextValue = this.getValueByInput(val);
        if (nextValue !== undefined) {
          this.fireChange(nextValue);
        }
        this.setOpenState(false, { needFocus: true });
        this.setInputValue('', false);
        return;
      }
      this.setInputValue(val);
      this.setState({
        _open: true
      });
      if ((0, _util.isCombobox)(this.$props)) {
        this.fireChange([val]);
      }
    },
    onDropdownVisibleChange: function onDropdownVisibleChange(open) {
      if (open && !this._focused) {
        this.clearBlurTime();
        this.timeoutFocus();
        this._focused = true;
        this.updateFocusClassName();
      }
      this.setOpenState(open);
    },


    // combobox ignore
    onKeyDown: function onKeyDown(event) {
      var open = this.$data._open;
      var disabled = this.$props.disabled;

      if (disabled) {
        return;
      }
      var keyCode = event.keyCode;
      if (open && !this.getInputDOMNode()) {
        this.onInputKeydown(event);
      } else if (keyCode === _KeyCode2['default'].ENTER || keyCode === _KeyCode2['default'].DOWN) {
        // vue state是同步更新，onKeyDown在onMenuSelect后会再次调用，单选时不在调用setOpenState
        // https://github.com/vueComponent/ant-design-vue/issues/1142
        if (keyCode === _KeyCode2['default'].ENTER && !(0, _util.isMultipleOrTags)(this.$props)) {
          this.maybeFocus(true);
        } else if (!open) {
          this.setOpenState(true);
        }
        event.preventDefault();
      } else if (keyCode === _KeyCode2['default'].SPACE) {
        // Not block space if popup is shown
        if (!open) {
          this.setOpenState(true);
          event.preventDefault();
        }
      }
    },
    onInputKeydown: function onInputKeydown(event) {
      var _this5 = this;

      var _$props = this.$props,
          disabled = _$props.disabled,
          combobox = _$props.combobox,
          defaultActiveFirstOption = _$props.defaultActiveFirstOption;

      if (disabled) {
        return;
      }
      var state = this.$data;
      var isRealOpen = this.getRealOpenState(state);
      var keyCode = event.keyCode;
      if ((0, _util.isMultipleOrTags)(this.$props) && !event.target.value && keyCode === _KeyCode2['default'].BACKSPACE) {
        event.preventDefault();
        var value = state._value;

        if (value.length) {
          this.removeSelected(value[value.length - 1]);
        }
        return;
      }
      if (keyCode === _KeyCode2['default'].DOWN) {
        if (!state._open) {
          this.openIfHasChildren();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      } else if (keyCode === _KeyCode2['default'].ENTER && state._open) {
        // Aviod trigger form submit when select item
        // https://github.com/ant-design/ant-design/issues/10861
        // https://github.com/ant-design/ant-design/issues/14544
        if (isRealOpen || !combobox) {
          event.preventDefault();
        }
        // Hard close popup to avoid lock of non option in combobox mode
        if (isRealOpen && combobox && defaultActiveFirstOption === false) {
          this.comboboxTimer = setTimeout(function () {
            _this5.setOpenState(false);
          });
        }
      } else if (keyCode === _KeyCode2['default'].ESC) {
        if (state._open) {
          this.setOpenState(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (isRealOpen && this.selectTriggerRef) {
        var menu = this.selectTriggerRef.getInnerMenu();
        if (menu && menu.onKeyDown(event, this.handleBackfill)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    onMenuSelect: function onMenuSelect(_ref) {
      var item = _ref.item;

      if (!item) {
        return;
      }
      var value = this.$data._value;
      var props = this.$props;
      var selectedValue = (0, _util.getValuePropValue)(item);
      var lastValue = value[value.length - 1];
      var skipTrigger = false;

      if ((0, _util.isMultipleOrTags)(props)) {
        if ((0, _util.findIndexInValueBySingleValue)(value, selectedValue) !== -1) {
          skipTrigger = true;
        } else {
          value = value.concat([selectedValue]);
        }
      } else {
        if (!(0, _util.isCombobox)(props) && lastValue !== undefined && lastValue === selectedValue && selectedValue !== this.$data._backfillValue) {
          this.setOpenState(false, { needFocus: true, fireSearch: false });
          skipTrigger = true;
        } else {
          value = [selectedValue];
          this.setOpenState(false, { needFocus: true, fireSearch: false });
        }
      }
      if (!skipTrigger) {
        this.fireChange(value);
      }
      if (!skipTrigger) {
        this.fireSelect(selectedValue);
        var inputValue = (0, _util.isCombobox)(props) ? (0, _util.getPropValue)(item, props.optionLabelProp) : '';

        if (props.autoClearSearchValue) {
          this.setInputValue(inputValue, false);
        }
      }
    },
    onMenuDeselect: function onMenuDeselect(_ref2) {
      var item = _ref2.item,
          domEvent = _ref2.domEvent;

      if (domEvent.type === 'keydown' && domEvent.keyCode === _KeyCode2['default'].ENTER) {
        var menuItemDomNode = item.$el;
        // https://github.com/ant-design/ant-design/issues/20465#issuecomment-569033796
        if (!isHidden(menuItemDomNode)) {
          this.removeSelected((0, _util.getValuePropValue)(item));
        }
        return;
      }
      if (domEvent.type === 'click') {
        this.removeSelected((0, _util.getValuePropValue)(item));
      }
      if (this.autoClearSearchValue) {
        this.setInputValue('');
      }
    },
    onArrowClick: function onArrowClick(e) {
      e.stopPropagation();
      e.preventDefault();
      this.clearBlurTime();
      if (!this.disabled) {
        this.setOpenState(!this.$data._open, { needFocus: !this.$data._open });
      }
    },
    onPlaceholderClick: function onPlaceholderClick() {
      if (this.getInputDOMNode() && this.getInputDOMNode()) {
        this.getInputDOMNode().focus();
      }
    },
    onPopupFocus: function onPopupFocus() {
      // fix ie scrollbar, focus element again
      this.maybeFocus(true, true);
    },
    onClearSelection: function onClearSelection(event) {
      var props = this.$props;
      var state = this.$data;
      if (props.disabled) {
        return;
      }
      var inputValue = state._inputValue,
          value = state._value;

      event.stopPropagation();
      if (inputValue || value.length) {
        if (value.length) {
          this.fireChange([]);
        }
        this.setOpenState(false, { needFocus: true });
        if (inputValue) {
          this.setInputValue('');
        }
      }
    },
    onChoiceAnimationLeave: function onChoiceAnimationLeave() {
      this.forcePopupAlign();
    },
    getOptionInfoBySingleValue: function getOptionInfoBySingleValue(value, optionsInfo) {
      var h = this.$createElement;

      var info = void 0;
      optionsInfo = optionsInfo || this.$data._optionsInfo;
      if (optionsInfo[(0, _util.getMapKey)(value)]) {
        info = optionsInfo[(0, _util.getMapKey)(value)];
      }
      if (info) {
        return info;
      }
      var defaultLabel = value;
      if (this.$props.labelInValue) {
        var valueLabel = (0, _util.getLabelFromPropsValue)(this.$props.value, value);
        var defaultValueLabel = (0, _util.getLabelFromPropsValue)(this.$props.defaultValue, value);
        if (valueLabel !== undefined) {
          defaultLabel = valueLabel;
        } else if (defaultValueLabel !== undefined) {
          defaultLabel = defaultValueLabel;
        }
      }
      var defaultInfo = {
        option: h(
          _Option2['default'],
          {
            attrs: { value: value },
            key: value },
          [value]
        ),
        value: value,
        label: defaultLabel
      };
      return defaultInfo;
    },
    getOptionBySingleValue: function getOptionBySingleValue(value) {
      var _getOptionInfoBySingl = this.getOptionInfoBySingleValue(value),
          option = _getOptionInfoBySingl.option;

      return option;
    },
    getOptionsBySingleValue: function getOptionsBySingleValue(values) {
      var _this6 = this;

      return values.map(function (value) {
        return _this6.getOptionBySingleValue(value);
      });
    },
    getValueByLabel: function getValueByLabel(label) {
      var _this7 = this;

      if (label === undefined) {
        return null;
      }
      var value = null;
      Object.keys(this.$data._optionsInfo).forEach(function (key) {
        var info = _this7.$data._optionsInfo[key];
        var disabled = info.disabled;

        if (disabled) {
          return;
        }
        var oldLable = (0, _util.toArray)(info.label);
        if (oldLable && oldLable.join('') === label) {
          value = info.value;
        }
      });
      return value;
    },
    getVLBySingleValue: function getVLBySingleValue(value) {
      if (this.$props.labelInValue) {
        return {
          key: value,
          label: this.getLabelBySingleValue(value)
        };
      }
      return value;
    },
    getVLForOnChange: function getVLForOnChange(vlsS) {
      var _this8 = this;

      var vls = vlsS;
      if (vls !== undefined) {
        if (!this.labelInValue) {
          vls = vls.map(function (v) {
            return v;
          });
        } else {
          vls = vls.map(function (vl) {
            return {
              key: vl,
              label: _this8.getLabelBySingleValue(vl)
            };
          });
        }
        return (0, _util.isMultipleOrTags)(this.$props) ? vls : vls[0];
      }
      return vls;
    },
    getLabelBySingleValue: function getLabelBySingleValue(value, optionsInfo) {
      var _getOptionInfoBySingl2 = this.getOptionInfoBySingleValue(value, optionsInfo),
          label = _getOptionInfoBySingl2.label;

      return label;
    },
    getDropdownContainer: function getDropdownContainer() {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div');
        document.body.appendChild(this.dropdownContainer);
      }
      return this.dropdownContainer;
    },
    getPlaceholderElement: function getPlaceholderElement() {
      var h = this.$createElement;
      var props = this.$props,
          state = this.$data;

      var hidden = false;
      if (state._mirrorInputValue) {
        hidden = true;
      }
      var value = state._value;
      if (value.length) {
        hidden = true;
      }
      if (!state._mirrorInputValue && (0, _util.isCombobox)(props) && value.length === 1 && state._value && !state._value[0]) {
        hidden = false;
      }
      var placeholder = props.placeholder;
      if (placeholder) {
        var p = {
          on: {
            mousedown: _util.preventDefaultEvent,
            click: this.onPlaceholderClick
          },
          attrs: _util.UNSELECTABLE_ATTRIBUTE,
          style: (0, _extends3['default'])({
            display: hidden ? 'none' : 'block'
          }, _util.UNSELECTABLE_STYLE),
          'class': props.prefixCls + '-selection__placeholder'
        };
        return h(
          'div',
          p,
          [placeholder]
        );
      }
      return null;
    },
    inputClick: function inputClick(e) {
      if (this.$data._open) {
        this.clearBlurTime();
        e.stopPropagation();
      } else {
        this._focused = false;
      }
    },
    inputBlur: function inputBlur(e) {
      var _this9 = this;

      var target = e.relatedTarget || document.activeElement;

      // https://github.com/vueComponent/ant-design-vue/issues/999
      // https://github.com/vueComponent/ant-design-vue/issues/1223
      if ((_env.isIE || _env.isEdge) && (e.relatedTarget === this.$refs.arrow || target && this.selectTriggerRef && this.selectTriggerRef.getInnerMenu() && this.selectTriggerRef.getInnerMenu().$el === target || (0, _contains2['default'])(e.target, target))) {
        e.target.focus();
        e.preventDefault();
        return;
      }
      this.clearBlurTime();
      if (this.disabled) {
        e.preventDefault();
        return;
      }
      this.blurTimer = setTimeout(function () {
        _this9._focused = false;
        _this9.updateFocusClassName();
        var props = _this9.$props;
        var value = _this9.$data._value;
        var inputValue = _this9.$data._inputValue;

        if ((0, _util.isSingleMode)(props) && props.showSearch && inputValue && props.defaultActiveFirstOption) {
          var options = _this9._options || [];
          if (options.length) {
            var firstOption = (0, _util.findFirstMenuItem)(options);
            if (firstOption) {
              value = [(0, _util.getValuePropValue)(firstOption)];
              _this9.fireChange(value);
            }
          }
        } else if ((0, _util.isMultipleOrTags)(props) && inputValue) {
          if (_this9._mouseDown) {
            // need update dropmenu when not blur
            _this9.setInputValue('');
          } else {
            // why not use setState?
            _this9.$data._inputValue = '';
            if (_this9.getInputDOMNode && _this9.getInputDOMNode()) {
              _this9.getInputDOMNode().value = '';
            }
          }
          var tmpValue = _this9.getValueByInput(inputValue);
          if (tmpValue !== undefined) {
            value = tmpValue;
            _this9.fireChange(value);
          }
        }
        // if click the rest space of Select in multiple mode
        if ((0, _util.isMultipleOrTags)(props) && _this9._mouseDown) {
          _this9.maybeFocus(true, true);
          _this9._mouseDown = false;
          return;
        }
        _this9.setOpenState(false);
        _this9.$emit('blur', _this9.getVLForOnChange(value));
      }, 200);
    },
    inputFocus: function inputFocus(e) {
      if (this.$props.disabled) {
        e.preventDefault();
        return;
      }
      this.clearBlurTime();

      // In IE11, onOuterFocus will be trigger twice when focus input
      // First one: e.target is div
      // Second one: e.target is input
      // other browser only trigger second one
      // https://github.com/ant-design/ant-design/issues/15942
      // Here we ignore the first one when e.target is div
      var inputNode = this.getInputDOMNode();
      if (inputNode && e.target === this.rootRef) {
        return;
      }
      if (!(0, _util.isMultipleOrTagsOrCombobox)(this.$props) && e.target === inputNode) {
        return;
      }
      if (this._focused) {
        return;
      }
      this._focused = true;
      this.updateFocusClassName();
      // only effect multiple or tag mode
      if (!(0, _util.isMultipleOrTags)(this.$props) || !this._mouseDown) {
        this.timeoutFocus();
      }
    },
    _getInputElement: function _getInputElement() {
      var h = this.$createElement;

      var props = this.$props;
      var _$data = this.$data,
          inputValue = _$data._inputValue,
          _mirrorInputValue = _$data._mirrorInputValue;

      var attrs = (0, _propsUtil.getAttrs)(this);
      var defaultInput = h('input', {
        attrs: { id: attrs.id, autoComplete: 'off' }
      });

      var inputElement = props.getInputElement ? props.getInputElement() : defaultInput;
      var inputCls = (0, _classnames3['default'])((0, _propsUtil.getClass)(inputElement), (0, _defineProperty3['default'])({}, props.prefixCls + '-search__field', true));
      var inputEvents = (0, _propsUtil.getEvents)(inputElement);
      // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
      // Add space to the end of the inputValue as the width measurement tolerance
      inputElement.data = inputElement.data || {};
      return h(
        'div',
        { 'class': props.prefixCls + '-search__field__wrap', on: {
            'click': this.inputClick
          }
        },
        [(0, _vnode.cloneElement)(inputElement, {
          props: {
            disabled: props.disabled,
            value: inputValue
          },
          attrs: (0, _extends3['default'])({}, inputElement.data.attrs || {}, {
            disabled: props.disabled,
            value: inputValue
          }),
          domProps: {
            value: inputValue
          },
          'class': inputCls,
          directives: [{
            name: 'ant-ref',
            value: this.saveInputRef
          }, {
            name: 'ant-input'
          }],
          on: {
            input: this.onInputChange,
            keydown: chaining(this.onInputKeydown, inputEvents.keydown, (0, _propsUtil.getListeners)(this).inputKeydown),
            focus: chaining(this.inputFocus, inputEvents.focus),
            blur: chaining(this.inputBlur, inputEvents.blur)
          }
        }), h(
          'span',
          (0, _babelHelperVueJsxMergeProps2['default'])([{
            directives: [{
              name: 'ant-ref',
              value: this.saveInputMirrorRef
            }]
          }, {
            // ref='inputMirrorRef'
            'class': props.prefixCls + '-search__field__mirror'
          }]),
          [_mirrorInputValue, '\xA0']
        )]
      );
    },
    getInputDOMNode: function getInputDOMNode() {
      return this.topCtrlRef ? this.topCtrlRef.querySelector('input,textarea,div[contentEditable]') : this.inputRef;
    },
    getInputMirrorDOMNode: function getInputMirrorDOMNode() {
      return this.inputMirrorRef;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      if (this.selectTriggerRef) {
        return this.selectTriggerRef.getPopupDOMNode();
      }
    },
    getPopupMenuComponent: function getPopupMenuComponent() {
      if (this.selectTriggerRef) {
        return this.selectTriggerRef.getInnerMenu();
      }
    },
    setOpenState: function setOpenState(open) {
      var _this10 = this;

      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var props = this.$props,
          state = this.$data;
      var needFocus = config.needFocus,
          fireSearch = config.fireSearch;

      if (state._open === open) {
        this.maybeFocus(open, !!needFocus);
        return;
      }
      this.__emit('dropdownVisibleChange', open);
      var nextState = {
        _open: open,
        _backfillValue: ''
      };
      // clear search input value when open is false in singleMode.
      if (!open && (0, _util.isSingleMode)(props) && props.showSearch) {
        this.setInputValue('', fireSearch);
      }
      if (!open) {
        this.maybeFocus(open, !!needFocus);
      }
      this.setState(nextState, function () {
        if (open) {
          _this10.maybeFocus(open, !!needFocus);
        }
      });
    },
    setInputValue: function setInputValue(inputValue) {
      var fireSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (inputValue !== this.$data._inputValue) {
        this.setState({
          _inputValue: inputValue
        }, this.forcePopupAlign);
        if (fireSearch) {
          this.$emit('search', inputValue);
        }
      }
    },
    getValueByInput: function getValueByInput(str) {
      var _this11 = this;

      var _$props2 = this.$props,
          multiple = _$props2.multiple,
          tokenSeparators = _$props2.tokenSeparators;

      var nextValue = this.$data._value;
      var hasNewValue = false;
      (0, _util.splitBySeparators)(str, tokenSeparators).forEach(function (label) {
        var selectedValue = [label];
        if (multiple) {
          var value = _this11.getValueByLabel(label);
          if (value && (0, _util.findIndexInValueBySingleValue)(nextValue, value) === -1) {
            nextValue = nextValue.concat(value);
            hasNewValue = true;
            _this11.fireSelect(value);
          }
        } else if ((0, _util.findIndexInValueBySingleValue)(nextValue, label) === -1) {
          nextValue = nextValue.concat(selectedValue);
          hasNewValue = true;
          _this11.fireSelect(label);
        }
      });
      return hasNewValue ? nextValue : undefined;
    },
    getRealOpenState: function getRealOpenState(state) {
      var _open = this.$props.open;

      if (typeof _open === 'boolean') {
        return _open;
      }

      var open = (state || this.$data)._open;
      var options = this._options || [];
      if ((0, _util.isMultipleOrTagsOrCombobox)(this.$props) || !this.$props.showSearch) {
        if (open && !options.length) {
          open = false;
        }
      }
      return open;
    },
    focus: function focus() {
      if ((0, _util.isSingleMode)(this.$props) && this.selectionRef) {
        this.selectionRef.focus();
      } else if (this.getInputDOMNode()) {
        this.getInputDOMNode().focus();
      }
    },
    blur: function blur() {
      if ((0, _util.isSingleMode)(this.$props) && this.selectionRef) {
        this.selectionRef.blur();
      } else if (this.getInputDOMNode()) {
        this.getInputDOMNode().blur();
      }
    },
    markMouseDown: function markMouseDown() {
      this._mouseDown = true;
    },
    markMouseLeave: function markMouseLeave() {
      this._mouseDown = false;
    },
    handleBackfill: function handleBackfill(item) {
      if (!this.backfill || !((0, _util.isSingleMode)(this.$props) || (0, _util.isCombobox)(this.$props))) {
        return;
      }

      var key = (0, _util.getValuePropValue)(item);

      if ((0, _util.isCombobox)(this.$props)) {
        this.setInputValue(key, false);
      }

      this.setState({
        _value: [key],
        _backfillValue: key
      });
    },
    _filterOption: function _filterOption(input, child) {
      var defaultFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _util.defaultFilterFn;
      var _$data2 = this.$data,
          value = _$data2._value,
          backfillValue = _$data2._backfillValue;

      var lastValue = value[value.length - 1];
      if (!input || lastValue && lastValue === backfillValue) {
        return true;
      }
      var filterFn = this.$props.filterOption;
      if ((0, _propsUtil.hasProp)(this, 'filterOption')) {
        if (filterFn === true) {
          filterFn = defaultFilter.bind(this);
        }
      } else {
        filterFn = defaultFilter.bind(this);
      }
      if (!filterFn) {
        return true;
      } else if (typeof filterFn === 'function') {
        return filterFn.call(this, input, child);
      } else if ((0, _propsUtil.getValueByProp)(child, 'disabled')) {
        return false;
      }
      return true;
    },
    timeoutFocus: function timeoutFocus() {
      var _this12 = this;

      if (this.focusTimer) {
        this.clearFocusTime();
      }
      this.focusTimer = window.setTimeout(function () {
        // this._focused = true
        // this.updateFocusClassName()
        _this12.$emit('focus');
      }, 10);
    },
    clearFocusTime: function clearFocusTime() {
      if (this.focusTimer) {
        clearTimeout(this.focusTimer);
        this.focusTimer = null;
      }
    },
    clearBlurTime: function clearBlurTime() {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      }
    },
    clearComboboxTime: function clearComboboxTime() {
      if (this.comboboxTimer) {
        clearTimeout(this.comboboxTimer);
        this.comboboxTimer = null;
      }
    },
    updateFocusClassName: function updateFocusClassName() {
      var rootRef = this.rootRef,
          prefixCls = this.prefixCls;
      // avoid setState and its side effect

      if (this._focused) {
        (0, _componentClasses2['default'])(rootRef).add(prefixCls + '-focused');
      } else {
        (0, _componentClasses2['default'])(rootRef).remove(prefixCls + '-focused');
      }
    },
    maybeFocus: function maybeFocus(open, needFocus) {
      if (needFocus || open) {
        var input = this.getInputDOMNode();
        var _document = document,
            activeElement = _document.activeElement;

        if (input && (open || (0, _util.isMultipleOrTagsOrCombobox)(this.$props))) {
          if (activeElement !== input) {
            input.focus();
            this._focused = true;
          }
        } else if (activeElement !== this.selectionRef && this.selectionRef) {
          this.selectionRef.focus();
          this._focused = true;
        }
      }
    },
    removeSelected: function removeSelected(selectedKey, e) {
      var props = this.$props;
      if (props.disabled || this.isChildDisabled(selectedKey)) {
        return;
      }
      // Do not trigger Trigger popup
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      var oldValue = this.$data._value;
      var value = oldValue.filter(function (singleValue) {
        return singleValue !== selectedKey;
      });
      var canMultiple = (0, _util.isMultipleOrTags)(props);

      if (canMultiple) {
        var event = selectedKey;
        if (props.labelInValue) {
          event = {
            key: selectedKey,
            label: this.getLabelBySingleValue(selectedKey)
          };
        }
        this.$emit('deselect', event, this.getOptionBySingleValue(selectedKey));
      }
      this.fireChange(value);
    },
    openIfHasChildren: function openIfHasChildren() {
      var $props = this.$props;

      if ($props.children && $props.children.length || (0, _util.isSingleMode)($props)) {
        this.setOpenState(true);
      }
    },
    fireSelect: function fireSelect(value) {
      this.$emit('select', this.getVLBySingleValue(value), this.getOptionBySingleValue(value));
    },
    fireChange: function fireChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({
          _value: value
        }, this.forcePopupAlign);
      }
      var vls = this.getVLForOnChange(value);
      var options = this.getOptionsBySingleValue(value);
      this._valueOptions = options;
      this.$emit('change', vls, (0, _util.isMultipleOrTags)(this.$props) ? options : options[0]);
    },
    isChildDisabled: function isChildDisabled(key) {
      return (this.$props.children || []).some(function (child) {
        var childValue = (0, _util.getValuePropValue)(child);
        return childValue === key && (0, _propsUtil.getValueByProp)(child, 'disabled');
      });
    },
    forcePopupAlign: function forcePopupAlign() {
      if (!this.$data._open) {
        return;
      }
      if (this.selectTriggerRef && this.selectTriggerRef.triggerRef) {
        this.selectTriggerRef.triggerRef.forcePopupAlign();
      }
    },
    renderFilterOptions: function renderFilterOptions() {
      var h = this.$createElement;
      var inputValue = this.$data._inputValue;
      var _$props3 = this.$props,
          children = _$props3.children,
          tags = _$props3.tags,
          notFoundContent = _$props3.notFoundContent;

      var menuItems = [];
      var childrenKeys = [];
      var empty = false;
      var options = this.renderFilterOptionsFromChildren(children, childrenKeys, menuItems);
      if (tags) {
        // tags value must be string
        var value = this.$data._value;
        value = value.filter(function (singleValue) {
          return childrenKeys.indexOf(singleValue) === -1 && (!inputValue || String(singleValue).indexOf(String(inputValue)) > -1);
        });

        // sort by length
        value.sort(function (val1, val2) {
          return val1.length - val2.length;
        });

        value.forEach(function (singleValue) {
          var key = singleValue;
          var attrs = (0, _extends3['default'])({}, _util.UNSELECTABLE_ATTRIBUTE, {
            role: 'option'
          });
          var menuItem = h(
            _vcMenu.Item,
            (0, _babelHelperVueJsxMergeProps2['default'])([{ style: _util.UNSELECTABLE_STYLE }, { attrs: attrs }, {
              attrs: { value: key },
              key: key }]),
            [key]
          );
          options.push(menuItem);
          menuItems.push(menuItem);
        });
        // ref: https://github.com/ant-design/ant-design/issues/14090
        if (inputValue && menuItems.every(function (option) {
          return (0, _util.getValuePropValue)(option) !== inputValue;
        })) {
          var p = {
            attrs: _util.UNSELECTABLE_ATTRIBUTE,
            key: inputValue,
            props: {
              value: inputValue,
              role: 'option'
            },
            style: _util.UNSELECTABLE_STYLE
          };
          options.unshift(h(
            _vcMenu.Item,
            p,
            [inputValue]
          ));
        }
      }

      if (!options.length && notFoundContent) {
        empty = true;
        var _p = {
          attrs: _util.UNSELECTABLE_ATTRIBUTE,
          key: 'NOT_FOUND',
          props: {
            value: 'NOT_FOUND',
            disabled: true,
            role: 'option'
          },
          style: _util.UNSELECTABLE_STYLE
        };
        options = [h(
          _vcMenu.Item,
          _p,
          [notFoundContent]
        )];
      }
      return { empty: empty, options: options };
    },
    renderFilterOptionsFromChildren: function renderFilterOptionsFromChildren() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _this13 = this;

      var childrenKeys = arguments[1];
      var menuItems = arguments[2];
      var h = this.$createElement;

      var sel = [];
      var props = this.$props;
      var inputValue = this.$data._inputValue;

      var tags = props.tags;
      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          var label = (0, _propsUtil.getComponentFromProp)(child, 'label');
          var key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          var childChildren = (0, _propsUtil.getSlots)(child)['default'];
          childChildren = typeof childChildren === 'function' ? childChildren() : childChildren;
          // Match option group label
          if (inputValue && _this13._filterOption(inputValue, child)) {
            var innerItems = childChildren.map(function (subChild) {
              var childValueSub = (0, _util.getValuePropValue)(subChild) || subChild.key;
              return h(
                _vcMenu.Item,
                (0, _babelHelperVueJsxMergeProps2['default'])([{ key: childValueSub, attrs: { value: childValueSub }
                }, subChild.data]),
                [subChild.componentOptions.children]
              );
            });

            sel.push(h(
              _vcMenu.ItemGroup,
              { key: key, attrs: { title: label },
                'class': (0, _propsUtil.getClass)(child) },
              [innerItems]
            ));

            // Not match
          } else {
            var _innerItems = _this13.renderFilterOptionsFromChildren(childChildren, childrenKeys, menuItems);
            if (_innerItems.length) {
              sel.push(h(
                _vcMenu.ItemGroup,
                (0, _babelHelperVueJsxMergeProps2['default'])([{ key: key, attrs: { title: label }
                }, child.data]),
                [_innerItems]
              ));
            }
          }

          return;
        }
        (0, _warning2['default'])((0, _propsUtil.getSlotOptions)(child).isSelectOption, 'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' + ('instead of `' + ((0, _propsUtil.getSlotOptions)(child).name || (0, _propsUtil.getSlotOptions)(child)) + '`.'));

        var childValue = (0, _util.getValuePropValue)(child);

        (0, _util.validateOptionValue)(childValue, _this13.$props);
        if (_this13._filterOption(inputValue, child)) {
          var p = {
            attrs: (0, _extends3['default'])({}, _util.UNSELECTABLE_ATTRIBUTE, (0, _propsUtil.getAttrs)(child)),
            key: childValue,
            props: (0, _extends3['default'])({
              value: childValue
            }, (0, _propsUtil.getPropsData)(child), {
              role: 'option'
            }),
            style: _util.UNSELECTABLE_STYLE,
            on: (0, _propsUtil.getEvents)(child),
            'class': (0, _propsUtil.getClass)(child)
          };
          var menuItem = h(
            _vcMenu.Item,
            p,
            [child.componentOptions.children]
          );
          sel.push(menuItem);
          menuItems.push(menuItem);
        }
        if (tags) {
          childrenKeys.push(childValue);
        }
      });

      return sel;
    },
    renderTopControlNode: function renderTopControlNode() {
      var _this14 = this;

      var h = this.$createElement;
      var props = this.$props;
      var _$data3 = this.$data,
          value = _$data3._value,
          inputValue = _$data3._inputValue,
          open = _$data3._open;
      var choiceTransitionName = props.choiceTransitionName,
          prefixCls = props.prefixCls,
          maxTagTextLength = props.maxTagTextLength,
          maxTagCount = props.maxTagCount,
          maxTagPlaceholder = props.maxTagPlaceholder,
          showSearch = props.showSearch;

      var removeIcon = (0, _propsUtil.getComponentFromProp)(this, 'removeIcon');
      var className = prefixCls + '-selection__rendered';
      // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
      var innerNode = null;
      if ((0, _util.isSingleMode)(props)) {
        var selectedValue = null;
        if (value.length) {
          var showSelectedValue = false;
          var opacity = 1;
          if (!showSearch) {
            showSelectedValue = true;
          } else if (open) {
            showSelectedValue = !inputValue;
            if (showSelectedValue) {
              opacity = 0.4;
            }
          } else {
            showSelectedValue = true;
          }
          var singleValue = value[0];

          var _getOptionInfoBySingl3 = this.getOptionInfoBySingleValue(singleValue),
              label = _getOptionInfoBySingl3.label,
              title = _getOptionInfoBySingl3.title;

          selectedValue = h(
            'div',
            {
              key: 'value',
              'class': prefixCls + '-selection-selected-value',
              attrs: { title: (0, _util.toTitle)(title || label)
              },
              style: {
                display: showSelectedValue ? 'block' : 'none',
                opacity: opacity
              }
            },
            [label]
          );
        }
        if (!showSearch) {
          innerNode = [selectedValue];
        } else {
          innerNode = [selectedValue, h(
            'div',
            {
              'class': prefixCls + '-search ' + prefixCls + '-search--inline',
              key: 'input',
              style: {
                display: open ? 'block' : 'none'
              }
            },
            [this._getInputElement()]
          )];
        }
      } else {
        var selectedValueNodes = [];
        var limitedCountValue = value;
        var maxTagPlaceholderEl = void 0;
        if (maxTagCount !== undefined && value.length > maxTagCount) {
          limitedCountValue = limitedCountValue.slice(0, maxTagCount);
          var omittedValues = this.getVLForOnChange(value.slice(maxTagCount, value.length));
          var content = '+ ' + (value.length - maxTagCount) + ' ...';
          if (maxTagPlaceholder) {
            content = typeof maxTagPlaceholder === 'function' ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
          }
          var attrs = (0, _extends3['default'])({}, _util.UNSELECTABLE_ATTRIBUTE, {
            role: 'presentation',
            title: (0, _util.toTitle)(content)
          });
          maxTagPlaceholderEl = h(
            'li',
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              style: _util.UNSELECTABLE_STYLE
            }, { attrs: attrs }, {
              on: {
                'mousedown': _util.preventDefaultEvent
              },

              'class': prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled',
              key: 'maxTagPlaceholder'
            }]),
            [h(
              'div',
              { 'class': prefixCls + '-selection__choice__content' },
              [content]
            )]
          );
        }
        if ((0, _util.isMultipleOrTags)(props)) {
          selectedValueNodes = limitedCountValue.map(function (singleValue) {
            var info = _this14.getOptionInfoBySingleValue(singleValue);
            var content = info.label;
            var title = info.title || content;
            if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
              content = content.slice(0, maxTagTextLength) + '...';
            }
            var disabled = _this14.isChildDisabled(singleValue);
            var choiceClassName = disabled ? prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled' : prefixCls + '-selection__choice';
            // attrs 放在一起，避免动态title混乱问题，很奇怪的问题 https://github.com/vueComponent/ant-design-vue/issues/588
            var attrs = (0, _extends3['default'])({}, _util.UNSELECTABLE_ATTRIBUTE, {
              role: 'presentation',
              title: (0, _util.toTitle)(title)
            });
            return h(
              'li',
              (0, _babelHelperVueJsxMergeProps2['default'])([{
                style: _util.UNSELECTABLE_STYLE
              }, { attrs: attrs }, {
                on: {
                  'mousedown': _util.preventDefaultEvent
                },

                'class': choiceClassName,
                key: singleValue || SELECT_EMPTY_VALUE_KEY
              }]),
              [h(
                'div',
                { 'class': prefixCls + '-selection__choice__content' },
                [content]
              ), disabled ? null : h(
                'span',
                {
                  on: {
                    'click': function click(event) {
                      _this14.removeSelected(singleValue, event);
                    }
                  },

                  'class': prefixCls + '-selection__choice__remove'
                },
                [removeIcon || h(
                  'i',
                  { 'class': prefixCls + '-selection__choice__remove-icon' },
                  ['\xD7']
                )]
              )]
            );
          });
        }
        if (maxTagPlaceholderEl) {
          selectedValueNodes.push(maxTagPlaceholderEl);
        }
        selectedValueNodes.push(h(
          'li',
          { 'class': prefixCls + '-search ' + prefixCls + '-search--inline', key: '__input' },
          [this._getInputElement()]
        ));

        if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
          var transitionProps = (0, _getTransitionProps2['default'])(choiceTransitionName, {
            tag: 'ul',
            afterLeave: this.onChoiceAnimationLeave
          });
          innerNode = h(
            'transition-group',
            transitionProps,
            [selectedValueNodes]
          );
        } else {
          innerNode = h('ul', [selectedValueNodes]);
        }
      }
      return h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          'class': className
        }, {
          directives: [{
            name: 'ant-ref',
            value: this.saveTopCtrlRef
          }]
        }, {
          on: {
            'click': this.topCtrlContainerClick
          }
        }]),
        [this.getPlaceholderElement(), innerNode]
      );
    },
    renderArrow: function renderArrow(multiple) {
      var h = this.$createElement;

      // showArrow : Set to true if not multiple by default but keep set value.
      var _$props4 = this.$props,
          _$props4$showArrow = _$props4.showArrow,
          showArrow = _$props4$showArrow === undefined ? !multiple : _$props4$showArrow,
          loading = _$props4.loading,
          prefixCls = _$props4.prefixCls;

      var inputIcon = (0, _propsUtil.getComponentFromProp)(this, 'inputIcon');
      if (!showArrow && !loading) {
        return null;
      }
      // if loading  have loading icon
      var defaultIcon = loading ? h('i', { 'class': prefixCls + '-arrow-loading' }) : h('i', { 'class': prefixCls + '-arrow-icon' });
      return h(
        'span',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          key: 'arrow',
          'class': prefixCls + '-arrow',
          style: _util.UNSELECTABLE_STYLE
        }, { attrs: _util.UNSELECTABLE_ATTRIBUTE }, {
          on: {
            'click': this.onArrowClick
          },

          ref: 'arrow'
        }]),
        [inputIcon || defaultIcon]
      );
    },
    topCtrlContainerClick: function topCtrlContainerClick(e) {
      if (this.$data._open && !(0, _util.isSingleMode)(this.$props)) {
        e.stopPropagation();
      }
    },
    renderClear: function renderClear() {
      var h = this.$createElement;
      var _$props5 = this.$props,
          prefixCls = _$props5.prefixCls,
          allowClear = _$props5.allowClear;
      var _$data4 = this.$data,
          value = _$data4._value,
          inputValue = _$data4._inputValue;

      var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
      var clear = h(
        'span',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          key: 'clear',
          'class': prefixCls + '-selection__clear',
          on: {
            'mousedown': _util.preventDefaultEvent
          },

          style: _util.UNSELECTABLE_STYLE
        }, { attrs: _util.UNSELECTABLE_ATTRIBUTE }, {
          on: {
            'click': this.onClearSelection
          }
        }]),
        [clearIcon || h(
          'i',
          { 'class': prefixCls + '-selection__clear-icon' },
          ['\xD7']
        )]
      );
      if (!allowClear) {
        return null;
      }
      if ((0, _util.isCombobox)(this.$props)) {
        if (inputValue) {
          return clear;
        }
        return null;
      }
      if (inputValue || value.length) {
        return clear;
      }
      return null;
    },
    selectionRefClick: function selectionRefClick() {
      //e.stopPropagation();
      if (!this.disabled) {
        var input = this.getInputDOMNode();
        if (this._focused && this.$data._open) {
          // this._focused = false;
          this.setOpenState(false, false);
          input && input.blur();
        } else {
          this.clearBlurTime();
          //this._focused = true;
          this.setOpenState(true, true);
          input && input.focus();
        }
      }
    },
    selectionRefFocus: function selectionRefFocus(e) {
      if (this._focused || this.disabled || (0, _util.isMultipleOrTagsOrCombobox)(this.$props)) {
        e.preventDefault();
        return;
      }
      this._focused = true;
      this.updateFocusClassName();
      this.$emit('focus');
    },
    selectionRefBlur: function selectionRefBlur(e) {
      if ((0, _util.isMultipleOrTagsOrCombobox)(this.$props)) {
        e.preventDefault();
        return;
      }
      this.inputBlur(e);
    }
  },

  render: function render() {
    var _rootCls;

    var h = arguments[0];

    var props = this.$props;
    var multiple = (0, _util.isMultipleOrTags)(props);
    // Default set showArrow to true if not set (not set directly in defaultProps to handle multiple case)
    var _props$showArrow = props.showArrow,
        showArrow = _props$showArrow === undefined ? true : _props$showArrow;

    var state = this.$data;
    var disabled = props.disabled,
        prefixCls = props.prefixCls,
        loading = props.loading;

    var ctrlNode = this.renderTopControlNode();
    var _$data5 = this.$data,
        open = _$data5._open,
        inputValue = _$data5._inputValue,
        value = _$data5._value;

    if (open) {
      var filterOptions = this.renderFilterOptions();
      this._empty = filterOptions.empty;
      this._options = filterOptions.options;
    }
    var realOpen = this.getRealOpenState();
    var empty = this._empty;
    var options = this._options || [];

    var _getListeners = (0, _propsUtil.getListeners)(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        _getListeners$popupSc = _getListeners.popupScroll,
        popupScroll = _getListeners$popupSc === undefined ? noop : _getListeners$popupSc;

    var selectionProps = {
      props: {},
      attrs: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'true',
        'aria-expanded': realOpen,
        'aria-controls': this.$data._ariaId
      },
      on: {
        // click: this.selectionRefClick,
      },
      'class': prefixCls + '-selection ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
      // directives: [
      //   {
      //     name: 'ant-ref',
      //     value: this.saveSelectionRef,
      //   },
      // ],
      key: 'selection'
    };
    //if (!isMultipleOrTagsOrCombobox(props)) {
    // selectionProps.on.keydown = this.onKeyDown;
    // selectionProps.on.focus = this.selectionRefFocus;
    // selectionProps.on.blur = this.selectionRefBlur;
    // selectionProps.attrs.tabIndex = props.disabled ? -1 : props.tabIndex;
    //}
    var extraSelectionProps = { attrs: { tabIndex: -1 } };
    if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
      extraSelectionProps.attrs.tabIndex = props.disabled ? -1 : props.tabIndex;
    }
    var rootCls = (_rootCls = {}, (0, _defineProperty3['default'])(_rootCls, prefixCls, true), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-open', open), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-focused', open || !!this._focused), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-combobox', (0, _util.isCombobox)(props)), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-enabled', !disabled), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-allow-clear', !!props.allowClear), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-no-arrow', !showArrow), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-loading', !!loading), _rootCls);
    return h(
      _SelectTrigger2['default'],
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          dropdownAlign: props.dropdownAlign,
          dropdownClassName: props.dropdownClassName,
          dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
          defaultActiveFirstOption: props.defaultActiveFirstOption,
          dropdownMenuStyle: props.dropdownMenuStyle,
          transitionName: props.transitionName,
          animation: props.animation,
          prefixCls: props.prefixCls,
          dropdownStyle: props.dropdownStyle,
          combobox: props.combobox,
          showSearch: props.showSearch,
          options: options,
          empty: empty,
          multiple: multiple,
          disabled: disabled,
          visible: realOpen,
          inputValue: inputValue,
          value: value,
          backfillValue: state._backfillValue,
          firstActiveValue: props.firstActiveValue,

          getPopupContainer: props.getPopupContainer,

          showAction: props.showAction,
          menuItemSelectedIcon: (0, _propsUtil.getComponentFromProp)(this, 'menuItemSelectedIcon')
        },
        on: {
          'dropdownVisibleChange': this.onDropdownVisibleChange,
          'menuSelect': this.onMenuSelect,
          'menuDeselect': this.onMenuDeselect,
          'popupScroll': popupScroll,
          'popupFocus': this.onPopupFocus,
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.saveSelectTriggerRef
        }]
      }, {
        attrs: {
          dropdownRender: props.dropdownRender,
          ariaId: this.$data._ariaId
        }
      }]),
      [h(
        'div',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          directives: [{
            name: 'ant-ref',
            value: chaining(this.saveRootRef, this.saveSelectionRef)
          }]
        }, {
          style: (0, _propsUtil.getStyle)(this),
          'class': (0, _classnames3['default'])(rootCls),
          on: {
            'mousedown': this.markMouseDown,
            'mouseup': this.markMouseLeave,
            'mouseout': this.markMouseLeave
          }
        }, extraSelectionProps, {
          on: {
            'blur': this.selectionRefBlur,
            'focus': this.selectionRefFocus,
            'click': this.selectionRefClick,
            'keydown': (0, _util.isMultipleOrTagsOrCombobox)(props) ? noop : this.onKeyDown
          }
        }]),
        [h(
          'div',
          selectionProps,
          [ctrlNode, this.renderClear(), this.renderArrow(!!multiple)]
        )]
      )]
    );
  }
};
exports.Select = Select;
exports['default'] = (0, _proxyComponent2['default'])(Select);