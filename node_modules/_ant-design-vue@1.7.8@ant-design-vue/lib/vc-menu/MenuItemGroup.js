'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import { menuAllProps } from './util'

var MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: _vueTypes2['default'].func,
    index: _vueTypes2['default'].number,
    className: _vueTypes2['default'].string,
    subMenuKey: _vueTypes2['default'].string,
    rootPrefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool.def(true),
    title: _vueTypes2['default'].any
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem: function renderInnerMenuItem(item) {
      var _$props = this.$props,
          renderMenuItem = _$props.renderMenuItem,
          index = _$props.index,
          subMenuKey = _$props.subMenuKey;

      return renderMenuItem(item, index, subMenuKey);
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = (0, _extends3['default'])({}, this.$props);
    var rootPrefixCls = props.rootPrefixCls,
        title = props.title;

    var titleClassName = rootPrefixCls + '-item-group-title';
    var listClassName = rootPrefixCls + '-item-group-list';
    // menuAllProps.props.forEach(key => delete props[key])
    var listeners = (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this));
    delete listeners.click;

    return h(
      'li',
      { on: listeners, 'class': rootPrefixCls + '-item-group' },
      [h(
        'div',
        { 'class': titleClassName, attrs: { title: typeof title === 'string' ? title : undefined }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'title')]
      ), h(
        'ul',
        { 'class': listClassName },
        [this.$slots['default'] && this.$slots['default'].map(this.renderInnerMenuItem)]
      )]
    );
  }
};

exports['default'] = MenuItemGroup;