import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getListeners } from '../_util/props-util';

// import { menuAllProps } from './util'

var MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    subMenuKey: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    disabled: PropTypes.bool.def(true),
    title: PropTypes.any
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

    var props = _extends({}, this.$props);
    var rootPrefixCls = props.rootPrefixCls,
        title = props.title;

    var titleClassName = rootPrefixCls + '-item-group-title';
    var listClassName = rootPrefixCls + '-item-group-list';
    // menuAllProps.props.forEach(key => delete props[key])
    var listeners = _extends({}, getListeners(this));
    delete listeners.click;

    return h(
      'li',
      { on: listeners, 'class': rootPrefixCls + '-item-group' },
      [h(
        'div',
        { 'class': titleClassName, attrs: { title: typeof title === 'string' ? title : undefined }
        },
        [getComponentFromProp(this, 'title')]
      ), h(
        'ul',
        { 'class': listClassName },
        [this.$slots['default'] && this.$slots['default'].map(this.renderInnerMenuItem)]
      )]
    );
  }
};

export default MenuItemGroup;