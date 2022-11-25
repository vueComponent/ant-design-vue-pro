'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Since search box is in different position with different mode.
 * - Single: in the popup box
 * - multiple: in the selector
 * Move the code as a SearchInput for easy management.
 */

var SearchInput = {
  name: 'SearchInput',
  props: {
    open: _vueTypes2['default'].bool,
    searchValue: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    renderPlaceholder: _vueTypes2['default'].func,
    needAlign: _vueTypes2['default'].bool,
    ariaId: _vueTypes2['default'].string
  },
  inject: {
    vcTreeSelect: { 'default': function _default() {
        return {};
      } }
  },
  data: function data() {
    return {
      mirrorSearchValue: this.searchValue
    };
  },

  watch: {
    searchValue: function searchValue(val) {
      this.mirrorSearchValue = val;
    }
  },
  created: function created() {
    this.inputRef = (0, _util.createRef)();
    this.mirrorInputRef = (0, _util.createRef)();
    this.prevProps = (0, _extends3['default'])({}, this.$props);
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var _$props = _this.$props,
          open = _$props.open,
          needAlign = _$props.needAlign;

      if (needAlign) {
        _this.alignInputWidth();
      }

      if (open) {
        _this.focus(true);
      }
    });
  },
  updated: function updated() {
    var _this2 = this;

    var _$props2 = this.$props,
        open = _$props2.open,
        searchValue = _$props2.searchValue,
        needAlign = _$props2.needAlign;
    var prevProps = this.prevProps;

    this.$nextTick(function () {
      if (open && prevProps.open !== open) {
        _this2.focus();
      }
      if (needAlign && searchValue !== prevProps.searchValue) {
        _this2.alignInputWidth();
      }
      _this2.prevProps = (0, _extends3['default'])({}, _this2.$props);
    });
  },

  methods: {
    /**
     * `scrollWidth` is not correct in IE, do the workaround.
     * ref: https://github.com/react-component/tree-select/issues/65
     *  clientWidth 0 when mounted in vue. why?
     */
    alignInputWidth: function alignInputWidth() {
      this.inputRef.current.style.width = (this.mirrorInputRef.current.clientWidth || this.mirrorInputRef.current.offsetWidth) + 'px';
    },


    /**
     * Need additional timeout for focus cause parent dom is not ready when didMount trigger
     */
    focus: function focus(isDidMount) {
      var _this3 = this;

      if (this.inputRef.current) {
        if (isDidMount) {
          setTimeout(function () {
            _this3.inputRef.current.focus();
          }, 0);
        } else {
          // set it into else, Avoid scrolling when focus
          this.inputRef.current.focus();
        }
      }
    },
    blur: function blur() {
      if (this.inputRef.current) {
        this.inputRef.current.blur();
      }
    },
    handleInputChange: function handleInputChange(e) {
      var _e$target = e.target,
          value = _e$target.value,
          composing = _e$target.composing;
      var _searchValue = this.searchValue,
          searchValue = _searchValue === undefined ? '' : _searchValue;

      if (e.isComposing || composing || searchValue === value) {
        this.mirrorSearchValue = value;
        return;
      }
      this.vcTreeSelect.onSearchInputChange(e);
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props3 = this.$props,
        searchValue = _$props3.searchValue,
        prefixCls = _$props3.prefixCls,
        disabled = _$props3.disabled,
        renderPlaceholder = _$props3.renderPlaceholder,
        open = _$props3.open,
        ariaId = _$props3.ariaId;
    var onSearchInputKeyDown = this.vcTreeSelect.onSearchInputKeyDown,
        handleInputChange = this.handleInputChange,
        mirrorSearchValue = this.mirrorSearchValue;

    return h(
      'span',
      { 'class': prefixCls + '-search__field__wrap' },
      [h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          type: 'text'
        }
      }, {
        directives: [{
          name: 'ant-ref',
          value: this.inputRef
        }, {
          name: 'ant-input'
        }]
      }, {
        on: {
          'input': handleInputChange,
          'keydown': onSearchInputKeyDown
        },
        domProps: {
          'value': searchValue
        },
        attrs: {
          disabled: disabled,

          'aria-label': 'filter select',
          'aria-autocomplete': 'list',
          'aria-controls': open ? ariaId : undefined,
          'aria-multiline': 'false'
        },
        'class': prefixCls + '-search__field' }])), h(
        'span',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          directives: [{
            name: 'ant-ref',
            value: this.mirrorInputRef
          }]
        }, {
          'class': prefixCls + '-search__field__mirror'
        }]),
        [mirrorSearchValue, '\xA0']
      ), renderPlaceholder && !mirrorSearchValue ? renderPlaceholder() : null]
    );
  }
};

exports['default'] = SearchInput;