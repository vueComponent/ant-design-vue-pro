import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var BasicProps = {
  prefixCls: PropTypes.string,
  hasSider: PropTypes.boolean,
  tagName: PropTypes.string
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
            return ConfigConsumerProps;
          } }
      },
      render: function render() {
        var h = arguments[0];
        var customizePrefixCls = this.$props.prefixCls;

        var getPrefixCls = this.configProvider.getPrefixCls;
        var prefixCls = getPrefixCls(suffixCls, customizePrefixCls);

        var basicComponentProps = {
          props: _extends({
            prefixCls: prefixCls
          }, getOptionProps(this), {
            tagName: tagName
          }),
          on: getListeners(this)
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
      on: getListeners(this)
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
          _this.siders = [].concat(_toConsumableArray(_this.siders), [id]);
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

    var divCls = classNames(prefixCls, _defineProperty({}, prefixCls + '-has-sider', typeof hasSider === 'boolean' ? hasSider : this.siders.length > 0));
    var divProps = {
      'class': divCls,
      on: getListeners
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

export default Layout;