'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Pager',
  props: {
    rootPrefixCls: _vueTypes2['default'].string,
    page: _vueTypes2['default'].number,
    active: _vueTypes2['default'].bool,
    last: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object,
    showTitle: _vueTypes2['default'].bool,
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
    var cls = (0, _classnames2['default'])(prefixCls, prefixCls + '-' + props.page, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-active', props.active), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', !props.page), _classNames));

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