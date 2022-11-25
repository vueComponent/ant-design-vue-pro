import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';
import VcUpload from '../vc-upload';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps, hasProp, getListeners } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Dragger from './Dragger';
import UploadList from './UploadList';
import { UploadProps } from './interface';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';

export { UploadProps };

export default {
  name: 'AUpload',
  mixins: [BaseMixin],
  inheritAttrs: false,
  Dragger: Dragger,
  props: initDefaultProps(UploadProps, {
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: T,
    showUploadList: true,
    listType: 'text', // or pictrue
    disabled: false,
    supportServerRender: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  // recentUploadStatus: boolean | PromiseLike<any>;
  data: function data() {
    this.progressTimer = null;
    return {
      sFileList: this.fileList || this.defaultFileList || [],
      dragState: 'drop'
    };
  },

  watch: {
    fileList: function fileList(val) {
      this.sFileList = val || [];
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.clearProgressTimer();
  },

  methods: {
    onStart: function onStart(file) {
      var targetItem = fileToObject(file);
      targetItem.status = 'uploading';
      var nextFileList = this.sFileList.concat();
      var fileIndex = findIndex(nextFileList, function (_ref) {
        var uid = _ref.uid;
        return uid === targetItem.uid;
      });
      if (fileIndex === -1) {
        nextFileList.push(targetItem);
      } else {
        nextFileList[fileIndex] = targetItem;
      }
      this.onChange({
        file: targetItem,
        fileList: nextFileList
      });
      // fix ie progress
      if (!window.File || process.env.TEST_IE) {
        this.autoUpdateProgress(0, targetItem);
      }
    },
    onSuccess: function onSuccess(response, file, xhr) {
      this.clearProgressTimer();
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }
      var fileList = this.sFileList;
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.status = 'done';
      targetItem.response = response;
      targetItem.xhr = xhr;
      this.onChange({
        file: _extends({}, targetItem),
        fileList: fileList
      });
    },
    onProgress: function onProgress(e, file) {
      var fileList = this.sFileList;
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.percent = e.percent;
      this.onChange({
        event: e,
        file: _extends({}, targetItem),
        fileList: this.sFileList
      });
    },
    onError: function onError(error, response, file) {
      this.clearProgressTimer();
      var fileList = this.sFileList;
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';
      this.onChange({
        file: _extends({}, targetItem),
        fileList: fileList
      });
    },
    onReject: function onReject(fileList) {
      this.$emit('reject', fileList);
    },
    handleRemove: function handleRemove(file) {
      var _this = this;

      var onRemove = this.remove;
      var fileList = this.$data.sFileList;


      Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then(function (ret) {
        // Prevent removing file
        if (ret === false) {
          return;
        }

        var removedFileList = removeFileItem(file, fileList);

        if (removedFileList) {
          file.status = 'removed'; // eslint-disable-line

          if (_this.upload) {
            _this.upload.abort(file);
          }

          _this.onChange({
            file: file,
            fileList: removedFileList
          });
        }
      });
    },
    handleManualRemove: function handleManualRemove(file) {
      if (this.$refs.uploadRef) {
        this.$refs.uploadRef.abort(file);
      }
      this.handleRemove(file);
    },
    onChange: function onChange(info) {
      if (!hasProp(this, 'fileList')) {
        this.setState({ sFileList: info.fileList });
      }
      this.$emit('change', info);
    },
    onFileDrop: function onFileDrop(e) {
      this.setState({
        dragState: e.type
      });
    },
    reBeforeUpload: function reBeforeUpload(file, fileList) {
      var beforeUpload = this.$props.beforeUpload;
      var stateFileList = this.$data.sFileList;

      if (!beforeUpload) {
        return true;
      }
      var result = beforeUpload(file, fileList);
      if (result === false) {
        this.onChange({
          file: file,
          fileList: uniqBy(stateFileList.concat(fileList.map(fileToObject)), function (item) {
            return item.uid;
          })
        });
        return false;
      }
      if (result && result.then) {
        return result;
      }
      return true;
    },
    clearProgressTimer: function clearProgressTimer() {
      clearInterval(this.progressTimer);
    },
    autoUpdateProgress: function autoUpdateProgress(_, file) {
      var _this2 = this;

      var getPercent = genPercentAdd();
      var curPercent = 0;
      this.clearProgressTimer();
      this.progressTimer = setInterval(function () {
        curPercent = getPercent(curPercent);
        _this2.onProgress({
          percent: curPercent * 100
        }, file);
      }, 200);
    },
    renderUploadList: function renderUploadList(locale) {
      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          _getOptionProps$showU = _getOptionProps.showUploadList,
          showUploadList = _getOptionProps$showU === undefined ? {} : _getOptionProps$showU,
          listType = _getOptionProps.listType,
          previewFile = _getOptionProps.previewFile,
          disabled = _getOptionProps.disabled,
          propLocale = _getOptionProps.locale;

      var showRemoveIcon = showUploadList.showRemoveIcon,
          showPreviewIcon = showUploadList.showPreviewIcon,
          showDownloadIcon = showUploadList.showDownloadIcon;
      var fileList = this.$data.sFileList;

      var uploadListProps = {
        props: {
          listType: listType,
          items: fileList,
          previewFile: previewFile,
          showRemoveIcon: !disabled && showRemoveIcon,
          showPreviewIcon: showPreviewIcon,
          showDownloadIcon: showDownloadIcon,
          locale: _extends({}, locale, propLocale)
        },
        on: _extends({
          remove: this.handleManualRemove
        }, pick(getListeners(this), ['download', 'preview']))
      };
      return h(UploadList, uploadListProps);
    }
  },
  render: function render() {
    var _classNames2;

    var h = arguments[0];

    var _getOptionProps2 = getOptionProps(this),
        customizePrefixCls = _getOptionProps2.prefixCls,
        showUploadList = _getOptionProps2.showUploadList,
        listType = _getOptionProps2.listType,
        type = _getOptionProps2.type,
        disabled = _getOptionProps2.disabled;

    var _$data = this.$data,
        fileList = _$data.sFileList,
        dragState = _$data.dragState;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('upload', customizePrefixCls);

    var vcUploadProps = {
      props: _extends({}, this.$props, {
        prefixCls: prefixCls,
        beforeUpload: this.reBeforeUpload
      }),
      on: {
        start: this.onStart,
        error: this.onError,
        progress: this.onProgress,
        success: this.onSuccess,
        reject: this.onReject
      },
      ref: 'uploadRef',
      attrs: _extends({}, this.$attrs)
    };
    var children = this.$slots['default'];
    // Remove id to avoid open by label when trigger is hidden
    // https://github.com/ant-design/ant-design/issues/14298
    if (!children || disabled) {
      delete vcUploadProps.props.id;
      delete vcUploadProps.attrs.id;
    }
    var uploadList = showUploadList ? h(LocaleReceiver, {
      attrs: {
        componentName: 'Upload',
        defaultLocale: defaultLocale.Upload
      },
      scopedSlots: { 'default': this.renderUploadList }
    }) : null;

    if (type === 'drag') {
      var _classNames;

      var dragCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-drag', true), _defineProperty(_classNames, prefixCls + '-drag-uploading', fileList.some(function (file) {
        return file.status === 'uploading';
      })), _defineProperty(_classNames, prefixCls + '-drag-hover', dragState === 'dragover'), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));
      return h('span', [h(
        'div',
        {
          'class': dragCls,
          on: {
            'drop': this.onFileDrop,
            'dragover': this.onFileDrop,
            'dragleave': this.onFileDrop
          }
        },
        [h(
          VcUpload,
          _mergeJSXProps([vcUploadProps, { 'class': prefixCls + '-btn' }]),
          [h(
            'div',
            { 'class': prefixCls + '-drag-container' },
            [children]
          )]
        )]
      ), uploadList]);
    }

    var uploadButtonCls = classNames(prefixCls, (_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-select', true), _defineProperty(_classNames2, prefixCls + '-select-' + listType, true), _defineProperty(_classNames2, prefixCls + '-disabled', disabled), _classNames2));

    var uploadButton = h(
      'div',
      { 'class': uploadButtonCls, style: children ? undefined : { display: 'none' } },
      [h(
        VcUpload,
        vcUploadProps,
        [children]
      )]
    );

    if (listType === 'picture-card') {
      return h(
        'span',
        { 'class': prefixCls + '-picture-card-wrapper' },
        [uploadList, uploadButton]
      );
    }
    return h('span', [uploadButton, uploadList]);
  }
};