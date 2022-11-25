import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import omit from 'omit.js';
import KeyCode from '../../_util/KeyCode';
import BaseMixin from '../../_util/BaseMixin';
import { getSlots, hasProp, getOptionProps, getListeners, initDefaultProps } from '../../_util/props-util';
import warning from 'warning';
import { getBeforeSelectionText, getLastMeasureIndex, replaceWithMeasure, setInputSelection } from './util';
import KeywordTrigger from './KeywordTrigger';
import { vcMentionsProps, defaultProps } from './mentionsProps';

function noop() {}

var Mentions = {
  name: 'Mentions',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(vcMentionsProps, defaultProps),
  provide: function provide() {
    return {
      mentionsContext: this
    };
  },
  data: function data() {
    var _$props = this.$props,
        _$props$value = _$props.value,
        value = _$props$value === undefined ? '' : _$props$value,
        _$props$defaultValue = _$props.defaultValue,
        defaultValue = _$props$defaultValue === undefined ? '' : _$props$defaultValue;

    warning(this.$props.children, 'please children prop replace slots.default');
    return {
      _value: !hasProp(this, 'value') ? defaultValue : value,
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false
    };
  },

  watch: {
    value: function value(val) {
      this.$data._value = val;
    }
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      var measuring = _this.$data.measuring;

      // Sync measure div top with textarea for rc-trigger usage

      if (measuring) {
        _this.$refs.measure.scrollTop = _this.$refs.textarea.scrollTop;
      }
    });
  },

  methods: {
    triggerChange: function triggerChange(value) {
      var props = getOptionProps(this);
      if (!('value' in props)) {
        this.setState({ _value: value });
      } else {
        this.$forceUpdate();
      }
      this.$emit('change', value);
    },
    onChange: function onChange(_ref) {
      var _ref$target = _ref.target,
          value = _ref$target.value,
          composing = _ref$target.composing,
          isComposing = _ref.isComposing;

      if (isComposing || composing) return;
      this.triggerChange(value);
    },
    onKeyDown: function onKeyDown(event) {
      var which = event.which;
      var _$data = this.$data,
          activeIndex = _$data.activeIndex,
          measuring = _$data.measuring;
      // Skip if not measuring

      if (!measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        var optionLen = this.getOptions().length;
        var offset = which === KeyCode.UP ? -1 : 1;
        var newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
        this.setState({
          activeIndex: newActiveIndex
        });
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        this.stopMeasure();
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        event.preventDefault();
        var options = this.getOptions();
        if (!options.length) {
          this.stopMeasure();
          return;
        }
        var option = options[activeIndex];
        this.selectOption(option);
      }
    },

    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */
    onKeyUp: function onKeyUp(event) {
      var key = event.key,
          which = event.which;
      var _$data2 = this.$data,
          prevMeasureText = _$data2.measureText,
          measuring = _$data2.measuring;
      var _$props2 = this.$props,
          _$props2$prefix = _$props2.prefix,
          prefix = _$props2$prefix === undefined ? '' : _$props2$prefix,
          validateSearch = _$props2.validateSearch;

      var target = event.target;
      var selectionStartText = getBeforeSelectionText(target);

      var _getLastMeasureIndex = getLastMeasureIndex(selectionStartText, prefix),
          measureIndex = _getLastMeasureIndex.location,
          measurePrefix = _getLastMeasureIndex.prefix;

      // Skip if match the white key list


      if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
        return;
      }

      if (measureIndex !== -1) {
        var measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        var validateMeasure = validateSearch(measureText, this.$props);
        var matchOption = !!this.getOptions(measureText).length;

        if (validateMeasure) {
          if (key === measurePrefix || measuring || measureText !== prevMeasureText && matchOption) {
            this.startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          this.stopMeasure();
        }

        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */
        if (validateMeasure) {
          this.$emit('search', measureText, measurePrefix);
        }
      } else if (measuring) {
        this.stopMeasure();
      }
    },
    onInputFocus: function onInputFocus(event) {
      this.onFocus(event);
    },
    onInputBlur: function onInputBlur(event) {
      this.onBlur(event);
    },
    onDropdownFocus: function onDropdownFocus() {
      this.onFocus();
    },
    onDropdownBlur: function onDropdownBlur() {
      this.onBlur();
    },
    onFocus: function onFocus(event) {
      window.clearTimeout(this.focusId);
      var isFocus = this.$data.isFocus;

      if (!isFocus && event) {
        this.$emit('focus', event);
      }
      this.setState({ isFocus: true });
    },
    onBlur: function onBlur(event) {
      var _this2 = this;

      this.focusId = window.setTimeout(function () {
        _this2.setState({ isFocus: false });
        _this2.stopMeasure();
        _this2.$emit('blur', event);
      }, 0);
    },
    selectOption: function selectOption(option) {
      var _this3 = this;

      var _$data3 = this.$data,
          value = _$data3._value,
          measureLocation = _$data3.measureLocation,
          measurePrefix = _$data3.measurePrefix;
      var split = this.$props.split;
      var _option$value = option.value,
          mentionValue = _option$value === undefined ? '' : _option$value;

      var _replaceWithMeasure = replaceWithMeasure(value, {
        measureLocation: measureLocation,
        targetText: mentionValue,
        prefix: measurePrefix,
        selectionStart: this.$refs.textarea.selectionStart,
        split: split
      }),
          text = _replaceWithMeasure.text,
          selectionLocation = _replaceWithMeasure.selectionLocation;

      this.triggerChange(text);
      this.stopMeasure(function () {
        // We need restore the selection position
        setInputSelection(_this3.$refs.textarea, selectionLocation);
      });

      this.$emit('select', option, measurePrefix);
    },
    setActiveIndex: function setActiveIndex(activeIndex) {
      this.setState({
        activeIndex: activeIndex
      });
    },
    getOptions: function getOptions(measureText) {
      var targetMeasureText = measureText || this.$data.measureText || '';
      var _$props3 = this.$props,
          filterOption = _$props3.filterOption,
          _$props3$children = _$props3.children,
          children = _$props3$children === undefined ? [] : _$props3$children;

      var list = (Array.isArray(children) ? children : [children]).map(function (item) {
        var children = getSlots(item)['default'];
        return _extends({}, getOptionProps(item), { children: children });
      }).filter(function (option) {
        /** Return all result if `filterOption` is false. */
        if (filterOption === false) {
          return true;
        }
        return filterOption(targetMeasureText, option);
      });
      return list;
    },
    startMeasure: function startMeasure(measureText, measurePrefix, measureLocation) {
      this.setState({
        measuring: true,
        measureText: measureText,
        measurePrefix: measurePrefix,
        measureLocation: measureLocation,
        activeIndex: 0
      });
    },
    stopMeasure: function stopMeasure(callback) {
      this.setState({
        measuring: false,
        measureLocation: 0,
        measureText: null
      }, callback);
    },
    focus: function focus() {
      this.$refs.textarea.focus();
    },
    blur: function blur() {
      this.$refs.textarea.blur();
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$data4 = this.$data,
        value = _$data4._value,
        measureLocation = _$data4.measureLocation,
        measurePrefix = _$data4.measurePrefix,
        measuring = _$data4.measuring;

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        placement = _getOptionProps.placement,
        transitionName = _getOptionProps.transitionName,
        autoFocus = _getOptionProps.autoFocus,
        notFoundContent = _getOptionProps.notFoundContent,
        getPopupContainer = _getOptionProps.getPopupContainer,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'placement', 'transitionName', 'autoFocus', 'notFoundContent', 'getPopupContainer']);

    var inputProps = omit(restProps, ['value', 'defaultValue', 'prefix', 'split', 'children', 'validateSearch', 'filterOption']);

    var options = measuring ? this.getOptions() : [];

    return h(
      'div',
      { 'class': prefixCls },
      [h('textarea', _mergeJSXProps([{
        ref: 'textarea'
      }, {
        directives: [{ name: 'ant-input' }],
        attrs: _extends({}, inputProps, this.$attrs),
        domProps: {
          value: value
        },
        on: _extends({}, getListeners(this), {
          select: noop,
          change: noop,
          input: this.onChange,
          keydown: this.onKeyDown,
          keyup: this.onKeyUp,
          blur: this.onInputBlur
        })
      }])), measuring && h(
        'div',
        { ref: 'measure', 'class': prefixCls + '-measure' },
        [value.slice(0, measureLocation), h(
          KeywordTrigger,
          {
            attrs: {
              prefixCls: prefixCls,
              transitionName: transitionName,
              placement: placement,
              options: options,
              visible: true,
              getPopupContainer: getPopupContainer
            }
          },
          [h('span', [measurePrefix])]
        ), value.slice(measureLocation + measurePrefix.length)]
      )]
    );
  }
};

export default Mentions;