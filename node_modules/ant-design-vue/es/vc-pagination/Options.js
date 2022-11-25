import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../_util/vue-types';
import KEYCODE from './KeyCode';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    disabled: PropTypes.bool,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.any,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '30', '40']),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    goButton: PropTypes.any
  },
  data: function data() {
    return {
      goInputText: ''
    };
  },

  methods: {
    getValidValue: function getValidValue() {
      var goInputText = this.goInputText,
          current = this.current;

      return !goInputText || isNaN(goInputText) ? current : Number(goInputText);
    },
    defaultBuildOptionText: function defaultBuildOptionText(opt) {
      return opt.value + ' ' + this.locale.items_per_page;
    },
    handleChange: function handleChange(e) {
      var _e$target = e.target,
          value = _e$target.value,
          composing = _e$target.composing;

      if (e.isComposing || composing || this.goInputText === value) return;
      this.setState({
        goInputText: value
      });
    },
    handleBlur: function handleBlur(e) {
      var _$props = this.$props,
          goButton = _$props.goButton,
          quickGo = _$props.quickGo,
          rootPrefixCls = _$props.rootPrefixCls;

      if (goButton) {
        return;
      }
      if (e.relatedTarget && (e.relatedTarget.className.indexOf(rootPrefixCls + '-prev') >= 0 || e.relatedTarget.className.indexOf(rootPrefixCls + '-next') >= 0)) {
        return;
      }
      quickGo(this.getValidValue());
    },
    go: function go(e) {
      var goInputText = this.goInputText;

      if (goInputText === '') {
        return;
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        // https://github.com/vueComponent/ant-design-vue/issues/1316
        this.quickGo(this.getValidValue());
        this.setState({
          goInputText: ''
        });
      }
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var rootPrefixCls = this.rootPrefixCls,
        locale = this.locale,
        changeSize = this.changeSize,
        quickGo = this.quickGo,
        goButton = this.goButton,
        Select = this.selectComponentClass,
        defaultBuildOptionText = this.defaultBuildOptionText,
        selectPrefixCls = this.selectPrefixCls,
        pageSize = this.pageSize,
        pageSizeOptions = this.pageSizeOptions,
        goInputText = this.goInputText,
        disabled = this.disabled;

    var prefixCls = rootPrefixCls + '-options';
    var changeSelect = null;
    var goInput = null;
    var gotoButton = null;

    if (!changeSize && !quickGo) {
      return null;
    }

    if (changeSize && Select) {
      var buildOptionText = this.buildOptionText || defaultBuildOptionText;
      var options = pageSizeOptions.map(function (opt, i) {
        return h(
          Select.Option,
          { key: i, attrs: { value: opt }
          },
          [buildOptionText({ value: opt })]
        );
      });

      changeSelect = h(
        Select,
        {
          attrs: {
            disabled: disabled,
            prefixCls: selectPrefixCls,
            showSearch: false,

            optionLabelProp: 'children',
            dropdownMatchSelectWidth: false,
            value: (pageSize || pageSizeOptions[0]).toString(),

            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            }
          },
          'class': prefixCls + '-size-changer', on: {
            'change': function change(value) {
              return _this.changeSize(Number(value));
            }
          }
        },
        [options]
      );
    }

    if (quickGo) {
      if (goButton) {
        gotoButton = typeof goButton === 'boolean' ? h(
          'button',
          {
            attrs: { type: 'button', disabled: disabled },
            on: {
              'click': this.go,
              'keyup': this.go
            }
          },
          [locale.jump_to_confirm]
        ) : h(
          'span',
          {
            on: {
              'click': this.go,
              'keyup': this.go
            }
          },
          [goButton]
        );
      }
      goInput = h(
        'div',
        { 'class': prefixCls + '-quick-jumper' },
        [locale.jump_to, h('input', _mergeJSXProps([{
          attrs: {
            disabled: disabled,
            type: 'text'
          },
          domProps: {
            'value': goInputText
          },
          on: {
            'input': this.handleChange,
            'keyup': this.go,
            'blur': this.handleBlur
          }
        }, {
          directives: [{
            name: 'ant-input'
          }]
        }])), locale.page, gotoButton]
      );
    }

    return h(
      'li',
      { 'class': '' + prefixCls },
      [changeSelect, goInput]
    );
  }
};