'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BasicProps = exports.BasicProps = {
  prefixCls: _vueTypes2['default'].string,
  hasSider: _vueTypes2['default'].boolean,
  tagName: _vueTypes2['default'].string
};

function generator(_ref) {
  var suffixCls = _ref.suffixCls,
      tagName = _ref.tagName,
      name = _ref.name;

  return function (BasicComponent) {
    return {
      name: name,
      props: BasicComponent.props,
      inject: {
        configProvider: { 'default': function _default() {
            return _configConsumerProps.ConfigConsumerProps;
          } }
      },
      render: function render() {
        var h = arguments[0];
        var customizePrefixCls = this.$props.prefixCls;

        var getPrefixCls = this.configProvider.getPrefixCls;
        var prefixCls = getPrefixCls(suffixCls, customizePrefixCls);

        var basicComponentProps = {
          props: (0, _extends3['default'])({
            prefixCls: prefixCls
          }, (0, _propsUtil.getOptionProps)(this), {
            tagName: tagName
          }),
          on: (0, _propsUtil.getListeners)(this)
        };
        return h(
          BasicComponent,
          basicComponentProps,
          [this.$slots['default']]
        );
      }
    };
  };
}

var Basic = {
  props: BasicProps,
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        Tag = this.tagName,
        $slots = this.$slots;

    var divProps = {
      'class': prefixCls,
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      Tag,
      divProps,
      [$slots['default']]
    );
  }
};

var BasicLayout = {
  props: BasicProps,
  data: function data() {
    return {
      siders: []
    };
  },
  provide: function provide() {
    var _this = this;

    return {
      siderHook: {
        addSider: function addSider(id) {
          _this.siders = [].concat((0, _toConsumableArray3['default'])(_this.siders), [id]);
        },
        removeSider: function removeSider(id) {
          _this.siders = _this.siders.filter(function (currentId) {
            return currentId !== id;
          });
        }
      }
    };
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        $slots = this.$slots,
        hasSider = this.hasSider,
        Tag = this.tagName;

    var divCls = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-has-sider', typeof hasSider === 'boolean' ? hasSider : this.siders.length > 0));
    var divProps = {
      'class': divCls,
      on: _propsUtil.getListeners
    };
    return h(
      Tag,
      divProps,
      [$slots['default']]
    );
  }
};

var Layout = generator({
  suffixCls: 'layout',
  tagName: 'section',
  name: 'ALayout'
})(BasicLayout);

var Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  name: 'ALayoutHeader'
})(Basic);

var Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  name: 'ALayoutFooter'
})(Basic);

var Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  name: 'ALayoutContent'
})(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

exports['default'] = Layout;