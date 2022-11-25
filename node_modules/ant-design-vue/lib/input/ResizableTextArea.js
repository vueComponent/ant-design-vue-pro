'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcResizeObserver = require('../vc-resize-observer');

var _vcResizeObserver2 = _interopRequireDefault(_vcResizeObserver);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _calculateNodeHeight = require('./calculateNodeHeight');

var _calculateNodeHeight2 = _interopRequireDefault(_calculateNodeHeight);

var _raf = require('../_util/raf');

var _raf2 = _interopRequireDefault(_raf);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RESIZE_STATUS_NONE = 0;
var RESIZE_STATUS_RESIZING = 1;
var RESIZE_STATUS_RESIZED = 2;

var TextAreaProps = (0, _extends3['default'])({}, _inputProps2['default'], {
  autosize: _vueTypes2['default'].oneOfType([Object, Boolean]),
  autoSize: _vueTypes2['default'].oneOfType([Object, Boolean])
});
var ResizableTextArea = {
  name: 'ResizableTextArea',
  props: TextAreaProps,
  data: function data() {
    return {
      textareaStyles: {},
      resizeStatus: RESIZE_STATUS_NONE
    };
  },

  mixins: [_BaseMixin2['default']],
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.resizeTextarea();
    });
  },
  beforeDestroy: function beforeDestroy() {
    _raf2['default'].cancel(this.nextFrameActionId);
    _raf2['default'].cancel(this.resizeFrameId);
  },

  watch: {
    value: function value() {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.resizeTextarea();
      });
    }
  },
  methods: {
    handleResize: function handleResize(size) {
      var resizeStatus = this.$data.resizeStatus;
      var autoSize = this.$props.autoSize;


      if (resizeStatus !== RESIZE_STATUS_NONE) {
        return;
      }
      this.$emit('resize', size);
      if (autoSize) {
        this.resizeOnNextFrame();
      }
    },
    resizeOnNextFrame: function resizeOnNextFrame() {
      _raf2['default'].cancel(this.nextFrameActionId);
      this.nextFrameActionId = (0, _raf2['default'])(this.resizeTextarea);
    },
    resizeTextarea: function resizeTextarea() {
      var _this3 = this;

      var autoSize = this.$props.autoSize || this.$props.autosize;
      if (!autoSize || !this.$refs.textArea) {
        return;
      }
      var minRows = autoSize.minRows,
          maxRows = autoSize.maxRows;

      var textareaStyles = (0, _calculateNodeHeight2['default'])(this.$refs.textArea, false, minRows, maxRows);
      this.setState({ textareaStyles: textareaStyles, resizeStatus: RESIZE_STATUS_RESIZING }, function () {
        _raf2['default'].cancel(_this3.resizeFrameId);
        _this3.resizeFrameId = (0, _raf2['default'])(function () {
          _this3.setState({ resizeStatus: RESIZE_STATUS_RESIZED }, function () {
            _this3.resizeFrameId = (0, _raf2['default'])(function () {
              _this3.setState({ resizeStatus: RESIZE_STATUS_NONE });
              _this3.fixFirefoxAutoScroll();
            });
          });
        });
      });
    },

    // https://github.com/ant-design/ant-design/issues/21870
    fixFirefoxAutoScroll: function fixFirefoxAutoScroll() {
      try {
        if (document.activeElement === this.$refs.textArea) {
          var currentStart = this.$refs.textArea.selectionStart;
          var currentEnd = this.$refs.textArea.selectionEnd;
          this.$refs.textArea.setSelectionRange(currentStart, currentEnd);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },
    renderTextArea: function renderTextArea() {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var prefixCls = props.prefixCls,
          autoSize = props.autoSize,
          autosize = props.autosize,
          disabled = props.disabled;
      var _$data = this.$data,
          textareaStyles = _$data.textareaStyles,
          resizeStatus = _$data.resizeStatus;

      (0, _warning2['default'])(autosize === undefined, 'Input.TextArea', 'autosize is deprecated, please use autoSize instead.');
      var otherProps = (0, _omit2['default'])(props, ['prefixCls', 'autoSize', 'autosize', 'defaultValue', 'allowClear', 'type', 'lazy', 'value']);
      var cls = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-disabled', disabled));
      var domProps = {};
      // Fix https://github.com/ant-design/ant-design/issues/6776
      // Make sure it could be reset when using form.getFieldDecorator
      if ('value' in props) {
        domProps.value = props.value || '';
      }
      var style = (0, _extends3['default'])({}, textareaStyles, resizeStatus === RESIZE_STATUS_RESIZING ? { overflowX: 'hidden', overflowY: 'hidden' } : null);
      var textareaProps = {
        attrs: otherProps,
        domProps: domProps,
        style: style,
        'class': cls,
        on: (0, _omit2['default'])((0, _propsUtil.getListeners)(this), 'pressEnter'),
        directives: [{
          name: 'ant-input'
        }]
      };
      return h(
        _vcResizeObserver2['default'],
        {
          on: {
            'resize': this.handleResize
          },
          attrs: { disabled: !(autoSize || autosize) }
        },
        [h('textarea', (0, _babelHelperVueJsxMergeProps2['default'])([textareaProps, { ref: 'textArea' }]))]
      );
    }
  },

  render: function render() {
    return this.renderTextArea();
  }
};

exports['default'] = ResizableTextArea;