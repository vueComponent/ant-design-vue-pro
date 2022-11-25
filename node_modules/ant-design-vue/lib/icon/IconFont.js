'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = create;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var customCache = new Set();

function create(options) {
  var scriptUrl = options.scriptUrl,
      _options$extraCommonP = options.extraCommonProps,
      extraCommonProps = _options$extraCommonP === undefined ? {} : _options$extraCommonP;

  /**
   * DOM API required.
   * Make sure in browser environment.
   * The Custom Icon will create a <script/>
   * that loads SVG symbols and insert the SVG Element into the document body.
   */

  if (typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function' && typeof scriptUrl === 'string' && scriptUrl.length && !customCache.has(scriptUrl)) {
    var script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    customCache.add(scriptUrl);
    document.body.appendChild(script);
  }

  var Iconfont = {
    functional: true,
    name: 'AIconfont',
    props: _index2['default'].props,
    render: function render(h, context) {
      var props = context.props,
          slots = context.slots,
          listeners = context.listeners,
          data = context.data;
      var type = props.type,
          restProps = (0, _objectWithoutProperties3['default'])(props, ['type']);

      var slotsMap = slots();
      var children = slotsMap['default'];
      // component > children > type
      var content = null;
      if (type) {
        content = h('use', { attrs: { 'xlink:href': '#' + type } });
      }
      if (children) {
        content = children;
      }
      var iconProps = (0, _propsUtil.mergeProps)(extraCommonProps, data, { props: restProps, on: listeners });
      return h(
        _index2['default'],
        iconProps,
        [content]
      );
    }
  };
  return Iconfont;
}