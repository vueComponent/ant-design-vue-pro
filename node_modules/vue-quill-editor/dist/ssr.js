'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = exports.quillEditor = exports.Quill = undefined;

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var quillDirective = function quillDirective(globalOptions) {
  var getInstanceName = function getInstanceName(el, binding, vnode) {
    var instanceName = null;
    if (binding.arg) {
      instanceName = binding.arg;
    } else if (vnode.data.attrs && (vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'])) {
      instanceName = vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'];
    } else if (el.id) {
      instanceName = el.id;
    }
    return instanceName || 'quill';
  };

  return {
    inserted: function inserted(el, binding, vnode) {
      var self = vnode.context;
      var options = binding.value || {};
      var instanceName = getInstanceName(el, binding, vnode);
      var quill = self[instanceName];

      var eventEmit = function eventEmit(vnode, name, data) {
        var handlers = vnode.data && vnode.data.on || vnode.componentOptions && vnode.componentOptions.listeners;
        if (handlers && handlers[name]) handlers[name].fns(data);
      };

      if (!quill) {
        var quillOptions = (0, _objectAssign2.default)({}, {
          theme: 'snow',
          boundary: document.body,
          modules: {
            toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'direction': 'rtl' }], [{ 'size': ['small', false, 'large', 'huge'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean'], ['link', 'image', 'video']]
          },
          placeholder: 'Insert text here ...',
          readOnly: false
        }, globalOptions, options);

        quill = self[instanceName] = new _quill2.default(el, quillOptions);

        var model = vnode.data.model;
        var _value = vnode.data.attrs ? vnode.data.attrs.value : null;
        var _content = vnode.data.attrs ? vnode.data.attrs.content : null;
        var disabled = vnode.data.attrs ? vnode.data.attrs.disabled : null;
        var content = model ? model.value : _value || _content;

        if (content) {
          quill.pasteHTML(content);
        }

        if (disabled) {
          quill.enable(false);
        }

        quill.on('selection-change', function (range) {
          if (!range) {
            eventEmit(vnode, 'blur', quill);
          } else {
            eventEmit(vnode, 'focus', quill);
          }
        });

        quill.on('text-change', function (delta, oldDelta, source) {
          var html = el.children[0].innerHTML;
          var text = quill.getText();
          if (html === '<p><br></p>') {
            html = '';
            quill.root.innerHTML = html;
          }
          if (model) {
            model.callback(html);
          }
          eventEmit(vnode, 'input', html);
          eventEmit(vnode, 'change', { text: text, html: html, quill: quill });
        });

        eventEmit(vnode, 'ready', quill);
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      var self = vnode.context;
      var instanceName = getInstanceName(el, binding, vnode);
      var options = binding.value || {};
      var quill = self[instanceName];
      if (quill) {
        var model = vnode.data.model;
        var _value = vnode.data.attrs ? vnode.data.attrs.value : null;
        var _content = vnode.data.attrs ? vnode.data.attrs.content : null;
        var disabled = vnode.data.attrs ? vnode.data.attrs.disabled : null;
        var content = model ? model.value : _value || _content;
        var newData = content;
        var oldData = el.children[0].innerHTML;
        quill.enable(!disabled);
        if (newData) {
          if (newData != oldData) {
            var range = quill.getSelection();
            quill.root.innerHTML = newData;
            setTimeout(function () {
              quill.setSelection(range);
            });
          }
        } else {
          quill.setText('');
        }
      }
    },
    unbind: function unbind(el, binding, vnode) {
      if (vnode.context[binding.arg]) {
        vnode.context[binding.arg] = null;
        delete vnode.context[binding.arg];
      }
    }
  };
};

var quillEditor = quillDirective({});

var install = function install(Vue) {
  var globalOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  Vue.directive('quill', quillDirective(globalOptions));
};

var VueQuillEditor = { Quill: _quill2.default, quillEditor: quillEditor, install: install };

exports.default = VueQuillEditor;
exports.Quill = _quill2.default;
exports.quillEditor = quillEditor;
exports.install = install;
