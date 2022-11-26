'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _partition = require('lodash/partition');

var _partition2 = _interopRequireDefault(_partition);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

var _attrAccept = require('./attr-accept');

var _attrAccept2 = _interopRequireDefault(_attrAccept);

var _traverseFileTree = require('./traverseFileTree');

var _traverseFileTree2 = _interopRequireDefault(_traverseFileTree);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var upLoadPropTypes = {
  componentTag: _vueTypes2['default'].string,
  // style: PropTypes.object,
  prefixCls: _vueTypes2['default'].string,
  name: _vueTypes2['default'].string,
  // className: PropTypes.string,
  multiple: _vueTypes2['default'].bool,
  directory: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  accept: _vueTypes2['default'].string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
  action: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func]),
  headers: _vueTypes2['default'].object,
  beforeUpload: _vueTypes2['default'].func,
  customRequest: _vueTypes2['default'].func,
  // onProgress: PropTypes.func,
  withCredentials: _vueTypes2['default'].bool,
  openFileDialogOnClick: _vueTypes2['default'].bool,
  transformFile: _vueTypes2['default'].func,
  method: _vueTypes2['default'].string
};

var AjaxUploader = {
  inheritAttrs: false,
  name: 'ajaxUploader',
  mixins: [_BaseMixin2['default']],
  props: upLoadPropTypes,
  data: function data() {
    this.reqs = {};
    return {
      uid: (0, _uid2['default'])()
    };
  },
  mounted: function mounted() {
    this._isMounted = true;
  },
  beforeDestroy: function beforeDestroy() {
    this._isMounted = false;
    this.abort();
  },

  methods: {
    onChange: function onChange(e) {
      var files = e.target.files;
      this.uploadFiles(files);
      this.reset();
    },
    onClick: function onClick() {
      var el = this.$refs.fileInputRef;
      if (!el) {
        return;
      }
      el.click();
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter') {
        this.onClick();
      }
    },
    onFileDrop: function onFileDrop(e) {
      var _this = this;

      var multiple = this.$props.multiple;

      e.preventDefault();
      if (e.type === 'dragover') {
        return;
      }
      if (this.directory) {
        (0, _traverseFileTree2['default'])(e.dataTransfer.items, this.uploadFiles, function (_file) {
          return (0, _attrAccept2['default'])(_file, _this.accept);
        });
      } else {
        var files = (0, _partition2['default'])(Array.prototype.slice.call(e.dataTransfer.files), function (file) {
          return (0, _attrAccept2['default'])(file, _this.accept);
        });
        var successFiles = files[0];
        var errorFiles = files[1];
        if (multiple === false) {
          successFiles = successFiles.slice(0, 1);
        }
        this.uploadFiles(successFiles);

        if (errorFiles.length) {
          this.$emit('reject', errorFiles);
        }
      }
    },
    uploadFiles: function uploadFiles(files) {
      var _this2 = this;

      var postFiles = Array.prototype.slice.call(files);
      postFiles.map(function (file) {
        file.uid = (0, _uid2['default'])();
        return file;
      }).forEach(function (file) {
        _this2.upload(file, postFiles);
      });
    },
    upload: function upload(file, fileList) {
      var _this3 = this;

      if (!this.beforeUpload) {
        // always async in case use react state to keep fileList
        return setTimeout(function () {
          return _this3.post(file);
        }, 0);
      }

      var before = this.beforeUpload(file, fileList);
      if (before && before.then) {
        before.then(function (processedFile) {
          var processedFileType = Object.prototype.toString.call(processedFile);
          if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
            return _this3.post(processedFile);
          }
          return _this3.post(file);
        })['catch'](function (e) {
          console && console.log(e); // eslint-disable-line
        });
      } else if (before !== false) {
        setTimeout(function () {
          return _this3.post(file);
        }, 0);
      }
    },
    post: function post(file) {
      var _this4 = this;

      if (!this._isMounted) {
        return;
      }
      var props = this.$props;
      var data = props.data;
      var _props$transformFile = props.transformFile,
          transformFile = _props$transformFile === undefined ? function (originFile) {
        return originFile;
      } : _props$transformFile;


      new Promise(function (resolve) {
        var action = _this4.action;

        if (typeof action === 'function') {
          return resolve(action(file));
        }
        resolve(action);
      }).then(function (action) {
        var uid = file.uid;

        var request = _this4.customRequest || _request2['default'];
        var transform = Promise.resolve(transformFile(file))['catch'](function (e) {
          console.error(e); // eslint-disable-line no-console
        });
        transform.then(function (transformedFile) {
          if (typeof data === 'function') {
            data = data(file);
          }

          var requestOption = {
            action: action,
            filename: _this4.name,
            data: data,
            file: transformedFile,
            headers: _this4.headers,
            withCredentials: _this4.withCredentials,
            method: props.method || 'post',
            onProgress: function onProgress(e) {
              _this4.$emit('progress', e, file);
            },
            onSuccess: function onSuccess(ret, xhr) {
              delete _this4.reqs[uid];
              _this4.$emit('success', ret, file, xhr);
            },
            onError: function onError(err, ret) {
              delete _this4.reqs[uid];
              _this4.$emit('error', err, ret, file);
            }
          };
          _this4.reqs[uid] = request(requestOption);
          _this4.$emit('start', file);
        });
      });
    },
    reset: function reset() {
      this.setState({
        uid: (0, _uid2['default'])()
      });
    },
    abort: function abort(file) {
      var reqs = this.reqs;

      if (file) {
        var uid = file;
        if (file && file.uid) {
          uid = file.uid;
        }
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      } else {
        Object.keys(reqs).forEach(function (uid) {
          if (reqs[uid] && reqs[uid].abort) {
            reqs[uid].abort();
          }

          delete reqs[uid];
        });
      }
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var $props = this.$props,
        $attrs = this.$attrs;
    var Tag = $props.componentTag,
        prefixCls = $props.prefixCls,
        disabled = $props.disabled,
        multiple = $props.multiple,
        accept = $props.accept,
        directory = $props.directory,
        openFileDialogOnClick = $props.openFileDialogOnClick;

    var cls = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), _classNames));
    var events = disabled ? {} : {
      click: openFileDialogOnClick ? this.onClick : function () {},
      keydown: openFileDialogOnClick ? this.onKeyDown : function () {},
      drop: this.onFileDrop,
      dragover: this.onFileDrop
    };
    var tagProps = {
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), events),
      attrs: {
        role: 'button',
        tabIndex: disabled ? null : '0'
      },
      'class': cls
    };
    return h(
      Tag,
      tagProps,
      [h('input', {
        attrs: {
          id: $attrs.id,
          type: 'file',

          accept: accept,
          directory: directory ? 'directory' : null,
          webkitdirectory: directory ? 'webkitdirectory' : null,
          multiple: multiple
        },
        ref: 'fileInputRef',
        on: {
          'click': function click(e) {
            return e.stopPropagation();
          },
          'change': this.onChange
        },
        // https://github.com/ant-design/ant-design/issues/19948
        key: this.uid,
        style: { display: 'none' } }), this.$slots['default']]
    );
  }
};

exports['default'] = AjaxUploader;