import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import ResizeObserver from '../vc-resize-observer';
import omit from 'omit.js';
import classNames from 'classnames';
import calculateNodeHeight from './calculateNodeHeight';
import raf from '../_util/raf';
import warning from '../_util/warning';
import BaseMixin from '../_util/BaseMixin';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getListeners } from '../_util/props-util';

var RESIZE_STATUS_NONE = 0;
var RESIZE_STATUS_RESIZING = 1;
var RESIZE_STATUS_RESIZED = 2;

var TextAreaProps = _extends({}, inputProps, {
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean])
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

  mixins: [BaseMixin],
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.resizeTextarea();
    });
  },
  beforeDestroy: function beforeDestroy() {
    raf.cancel(this.nextFrameActionId);
    raf.cancel(this.resizeFrameId);
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
      raf.cancel(this.nextFrameActionId);
      this.nextFrameActionId = raf(this.resizeTextarea);
    },
    resizeTextarea: function resizeTextarea() {
      var _this3 = this;

      var autoSize = this.$props.autoSize || this.$props.autosize;
      if (!autoSize || !this.$refs.textArea) {
        return;
      }
      var minRows = autoSize.minRows,
          maxRows = autoSize.maxRows;

      var textareaStyles = calculateNodeHeight(this.$refs.textArea, false, minRows, maxRows);
      this.setState({ textareaStyles: textareaStyles, resizeStatus: RESIZE_STATUS_RESIZING }, function () {
        raf.cancel(_this3.resizeFrameId);
        _this3.resizeFrameId = raf(function () {
          _this3.setState({ resizeStatus: RESIZE_STATUS_RESIZED }, function () {
            _this3.resizeFrameId = raf(function () {
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

      var props = getOptionProps(this);
      var prefixCls = props.prefixCls,
          autoSize = props.autoSize,
          autosize = props.autosize,
          disabled = props.disabled;
      var _$data = this.$data,
          textareaStyles = _$data.textareaStyles,
          resizeStatus = _$data.resizeStatus;

      warning(autosize === undefined, 'Input.TextArea', 'autosize is deprecated, please use autoSize instead.');
      var otherProps = omit(props, ['prefixCls', 'autoSize', 'autosize', 'defaultValue', 'allowClear', 'type', 'lazy', 'value']);
      var cls = classNames(prefixCls, _defineProperty({}, prefixCls + '-disabled', disabled));
      var domProps = {};
      // Fix https://github.com/ant-design/ant-design/issues/6776
      // Make sure it could be reset when using form.getFieldDecorator
      if ('value' in props) {
        domProps.value = props.value || '';
      }
      var style = _extends({}, textareaStyles, resizeStatus === RESIZE_STATUS_RESIZING ? { overflowX: 'hidden', overflowY: 'hidden' } : null);
      var textareaProps = {
        attrs: otherProps,
        domProps: domProps,
        style: style,
        'class': cls,
        on: omit(getListeners(this), 'pressEnter'),
        directives: [{
          name: 'ant-input'
        }]
      };
      return h(
        ResizeObserver,
        {
          on: {
            'resize': this.handleResize
          },
          attrs: { disabled: !(autoSize || autosize) }
        },
        [h('textarea', _mergeJSXProps([textareaProps, { ref: 'textArea' }]))]
      );
    }
  },

  render: function render() {
    return this.renderTextArea();
  }
};

export default ResizableTextArea;