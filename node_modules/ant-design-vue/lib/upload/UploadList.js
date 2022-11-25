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

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _utils = require('./utils');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _progress = require('../progress');

var _progress2 = _interopRequireDefault(_progress);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _interface = require('./interface');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AUploadList',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(_interface.UploadListProps, {
    listType: 'text', // or picture
    progressAttr: {
      strokeWidth: 2,
      showInfo: false
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: _utils.previewImage
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      var _$props = _this.$props,
          listType = _$props.listType,
          items = _$props.items,
          previewFile = _$props.previewFile;

      if (listType !== 'picture' && listType !== 'picture-card') {
        return;
      }
      (items || []).forEach(function (file) {
        if (typeof document === 'undefined' || typeof window === 'undefined' || !window.FileReader || !window.File || !(file.originFileObj instanceof File || file.originFileObj instanceof Blob) || file.thumbUrl !== undefined) {
          return;
        }
        /*eslint-disable */
        file.thumbUrl = '';
        if (previewFile) {
          previewFile(file.originFileObj).then(function (previewDataUrl) {
            // Need append '' to avoid dead loop
            file.thumbUrl = previewDataUrl || '';
            _this.$forceUpdate();
          });
        }
      });
    });
  },

  methods: {
    handlePreview: function handlePreview(file, e) {
      var _getListeners = (0, _propsUtil.getListeners)(this),
          preview = _getListeners.preview;

      if (!preview) {
        return;
      }
      e.preventDefault();
      return this.$emit('preview', file);
    },
    handleDownload: function handleDownload(file) {
      var _getListeners2 = (0, _propsUtil.getListeners)(this),
          download = _getListeners2.download;

      if (typeof download === 'function') {
        download(file);
      } else if (file.url) {
        window.open(file.url);
      }
    },
    handleClose: function handleClose(file) {
      this.$emit('remove', file);
    }
  },
  render: function render() {
    var _this2 = this,
        _classNames4;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        _getOptionProps$items = _getOptionProps.items,
        items = _getOptionProps$items === undefined ? [] : _getOptionProps$items,
        listType = _getOptionProps.listType,
        showPreviewIcon = _getOptionProps.showPreviewIcon,
        showRemoveIcon = _getOptionProps.showRemoveIcon,
        showDownloadIcon = _getOptionProps.showDownloadIcon,
        locale = _getOptionProps.locale,
        progressAttr = _getOptionProps.progressAttr;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('upload', customizePrefixCls);

    var list = items.map(function (file) {
      var _classNames, _classNames2;

      var progress = void 0;
      var icon = h(_icon2['default'], {
        attrs: { type: file.status === 'uploading' ? 'loading' : 'paper-clip' }
      });

      if (listType === 'picture' || listType === 'picture-card') {
        if (listType === 'picture-card' && file.status === 'uploading') {
          icon = h(
            'div',
            { 'class': prefixCls + '-list-item-uploading-text' },
            [locale.uploading]
          );
        } else if (!file.thumbUrl && !file.url) {
          icon = h(_icon2['default'], { 'class': prefixCls + '-list-item-thumbnail', attrs: { type: 'picture', theme: 'twoTone' }
          });
        } else {
          var thumbnail = (0, _utils.isImageUrl)(file) ? h('img', {
            attrs: {
              src: file.thumbUrl || file.url,
              alt: file.name
            },
            'class': prefixCls + '-list-item-image'
          }) : h(_icon2['default'], {
            attrs: { type: 'file', theme: 'twoTone' },
            'class': prefixCls + '-list-item-icon' });
          icon = h(
            'a',
            {
              'class': prefixCls + '-list-item-thumbnail',
              on: {
                'click': function click(e) {
                  return _this2.handlePreview(file, e);
                }
              },
              attrs: {
                href: file.url || file.thumbUrl,
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            },
            [thumbnail]
          );
        }
      }

      if (file.status === 'uploading') {
        var progressProps = {
          props: (0, _extends3['default'])({}, progressAttr, {
            type: 'line',
            percent: file.percent
          })
        };
        // show loading icon if upload progress listener is disabled
        var loadingProgress = 'percent' in file ? h(_progress2['default'], progressProps) : null;

        progress = h(
          'div',
          { 'class': prefixCls + '-list-item-progress', key: 'progress' },
          [loadingProgress]
        );
      }
      var infoUploadingClass = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-list-item', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-list-item-' + file.status, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-list-item-list-type-' + listType, true), _classNames));
      var linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

      var removeIcon = showRemoveIcon ? h(_icon2['default'], {
        attrs: { type: 'delete', title: locale.removeFile },
        on: {
          'click': function click() {
            return _this2.handleClose(file);
          }
        }
      }) : null;
      var downloadIcon = showDownloadIcon && file.status === 'done' ? h(_icon2['default'], {
        attrs: {
          type: 'download',
          title: locale.downloadFile
        },
        on: {
          'click': function click() {
            return _this2.handleDownload(file);
          }
        }
      }) : null;
      var downloadOrDelete = listType !== 'picture-card' && h(
        'span',
        {
          key: 'download-delete',
          'class': prefixCls + '-list-item-card-actions ' + (listType === 'picture' ? 'picture' : '')
        },
        [downloadIcon && h(
          'a',
          {
            attrs: { title: locale.downloadFile }
          },
          [downloadIcon]
        ), removeIcon && h(
          'a',
          {
            attrs: { title: locale.removeFile }
          },
          [removeIcon]
        )]
      );
      var listItemNameClass = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-list-item-name', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-list-item-name-icon-count-' + [downloadIcon, removeIcon].filter(function (x) {
        return x;
      }).length, true), _classNames2));

      var preview = file.url ? [h(
        'a',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          attrs: {
            target: '_blank',
            rel: 'noopener noreferrer',

            title: file.name
          },
          'class': listItemNameClass }, linkProps, {
          attrs: {
            href: file.url
          },
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          }
        }]),
        [file.name]
      ), downloadOrDelete] : [h(
        'span',
        {
          key: 'view',
          'class': prefixCls + '-list-item-name',
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          },
          attrs: {
            title: file.name
          }
        },
        [file.name]
      ), downloadOrDelete];
      var style = file.url || file.thumbUrl ? undefined : {
        pointerEvents: 'none',
        opacity: 0.5
      };
      var previewIcon = showPreviewIcon ? h(
        'a',
        {
          attrs: {
            href: file.url || file.thumbUrl,
            target: '_blank',
            rel: 'noopener noreferrer',

            title: locale.previewFile
          },
          style: style,
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          }
        },
        [h(_icon2['default'], {
          attrs: { type: 'eye-o' }
        })]
      ) : null;
      var actions = listType === 'picture-card' && file.status !== 'uploading' && h(
        'span',
        { 'class': prefixCls + '-list-item-actions' },
        [previewIcon, file.status === 'done' && downloadIcon, removeIcon]
      );
      var message = void 0;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = file.error && file.error.statusText || locale.uploadError;
      }
      var iconAndPreview = h('span', [icon, preview]);
      var transitionProps = (0, _getTransitionProps2['default'])('fade');
      var dom = h(
        'div',
        { 'class': infoUploadingClass, key: file.uid },
        [h(
          'div',
          { 'class': prefixCls + '-list-item-info' },
          [iconAndPreview]
        ), actions, h(
          'transition',
          transitionProps,
          [progress]
        )]
      );
      var listContainerNameClass = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, prefixCls + '-list-picture-card-container', listType === 'picture-card'));
      return h(
        'div',
        { key: file.uid, 'class': listContainerNameClass },
        [file.status === 'error' ? h(
          _tooltip2['default'],
          {
            attrs: { title: message }
          },
          [dom]
        ) : h('span', [dom])]
      );
    });
    var listClassNames = (0, _classnames2['default'])((_classNames4 = {}, (0, _defineProperty3['default'])(_classNames4, prefixCls + '-list', true), (0, _defineProperty3['default'])(_classNames4, prefixCls + '-list-' + listType, true), _classNames4));
    var animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
    var transitionGroupProps = (0, _getTransitionProps2['default'])(prefixCls + '-' + animationDirection);
    return h(
      'transition-group',
      (0, _babelHelperVueJsxMergeProps2['default'])([transitionGroupProps, {
        attrs: { tag: 'div' },
        'class': listClassNames }]),
      [list]
    );
  }
};