import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';

export default {
  name: 'Pager',
  props: {
    rootPrefixCls: PropTypes.string,
    page: PropTypes.number,
    active: PropTypes.bool,
    last: PropTypes.bool,
    locale: PropTypes.object,
    showTitle: PropTypes.bool,
    itemRender: {
      type: Function,
      'default': function _default() {}
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.$emit('click', this.page);
    },
    handleKeyPress: function handleKeyPress(event) {
      this.$emit('keypress', event, this.handleClick, this.page);
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var props = this.$props;
    var prefixCls = props.rootPrefixCls + '-item';
    var cls = classNames(prefixCls, prefixCls + '-' + props.page, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-active', props.active), _defineProperty(_classNames, prefixCls + '-disabled', !props.page), _classNames));

    return h(
      'li',
      {
        'class': cls,
        on: {
          'click': this.handleClick,
          'keypress': this.handleKeyPress
        },
        attrs: {
          title: this.showTitle ? this.page : null,
          tabIndex: '0'
        }
      },
      [this.itemRender(this.page, 'page', h('a', [this.page]))]
    );
  }
};