import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps, hasProp, initDefaultProps, getAttrs, getListeners } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'Checkbox',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: initDefaultProps({
    prefixCls: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
    // onChange: PropTypes.func,
    // onClick: PropTypes.func,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.any
  }, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false
  }),
  data: function data() {
    var checked = hasProp(this, 'checked') ? this.checked : this.defaultChecked;
    return {
      sChecked: checked
    };
  },

  watch: {
    checked: function checked(val) {
      this.sChecked = val;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.$refs.input && _this.$refs.input.focus();
      }
    });
  },

  methods: {
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    handleChange: function handleChange(e) {
      var props = getOptionProps(this);
      if (props.disabled) {
        return;
      }
      if (!('checked' in props)) {
        this.sChecked = e.target.checked;
      }
      this.$forceUpdate(); // change前，维持现有状态
      e.shiftKey = this.eventShiftKey;
      this.__emit('change', {
        target: _extends({}, props, {
          checked: e.target.checked
        }),
        stopPropagation: function stopPropagation() {
          e.stopPropagation();
        },
        preventDefault: function preventDefault() {
          e.preventDefault();
        },

        nativeEvent: e
      });
      this.eventShiftKey = false;
      // fix https://github.com/vueComponent/ant-design-vue/issues/3047
      if ('checked' in props) {
        this.$refs.input.checked = props.checked;
      }
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
      // onChange没能获取到shiftKey，使用onClick hack
      this.eventShiftKey = e.shiftKey;
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        name = _getOptionProps.name,
        id = _getOptionProps.id,
        type = _getOptionProps.type,
        disabled = _getOptionProps.disabled,
        readOnly = _getOptionProps.readOnly,
        tabIndex = _getOptionProps.tabIndex,
        autoFocus = _getOptionProps.autoFocus,
        value = _getOptionProps.value,
        others = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'name', 'id', 'type', 'disabled', 'readOnly', 'tabIndex', 'autoFocus', 'value']);

    var attrs = getAttrs(this);
    var globalProps = Object.keys(_extends({}, others, attrs)).reduce(function (prev, key) {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    var sChecked = this.sChecked;

    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-checked', sChecked), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));

    return h(
      'span',
      { 'class': classString },
      [h('input', _mergeJSXProps([{
        attrs: {
          name: name,
          id: id,
          type: type,
          readOnly: readOnly,
          disabled: disabled,
          tabIndex: tabIndex,

          autoFocus: autoFocus
        },
        'class': prefixCls + '-input',
        domProps: {
          'checked': !!sChecked,
          'value': value
        },
        ref: 'input'
      }, {
        attrs: globalProps,
        on: _extends({}, getListeners(this), {
          change: this.handleChange,
          click: this.onClick
        })
      }])), h('span', { 'class': prefixCls + '-inner' })]
    );
  }
};