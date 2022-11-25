import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import Select from '../select';
import { Group, Button } from '../radio';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

var Option = Select.Option;


function getMonthsLocale(value) {
  var current = value.clone();
  var localeData = value.localeData();
  var months = [];
  for (var i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.monthsShort(current));
  }
  return months;
}

export var HeaderProps = {
  prefixCls: PropTypes.string,
  locale: PropTypes.any,
  fullscreen: PropTypes.boolean,
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  type: PropTypes.string,
  // onValueChange: PropTypes.(value: moment.Moment) => void,
  // onTypeChange: PropTypes.(type: string) => void,
  value: PropTypes.any,
  validRange: PropTypes.array,
  headerRender: PropTypes.func
};

export default {
  props: initDefaultProps(HeaderProps, {
    yearSelectOffset: 10,
    yearSelectTotal: 20
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  // private calenderHeaderNode: HTMLDivElement;
  methods: {
    getYearSelectElement: function getYearSelectElement(prefixCls, year) {
      var _this = this;

      var h = this.$createElement;
      var yearSelectOffset = this.yearSelectOffset,
          yearSelectTotal = this.yearSelectTotal,
          _locale = this.locale,
          locale = _locale === undefined ? {} : _locale,
          fullscreen = this.fullscreen,
          validRange = this.validRange;

      var start = year - yearSelectOffset;
      var end = start + yearSelectTotal;
      if (validRange) {
        start = validRange[0].get('year');
        end = validRange[1].get('year') + 1;
      }
      var suffix = locale.year === '年' ? '年' : '';

      var options = [];
      for (var index = start; index < end; index++) {
        options.push(h(
          Option,
          { key: '' + index },
          [index + suffix]
        ));
      }
      return h(
        Select,
        {
          attrs: {
            size: fullscreen ? 'default' : 'small',
            dropdownMatchSelectWidth: false,

            value: String(year),
            getPopupContainer: function getPopupContainer() {
              return _this.getCalenderHeaderNode();
            }
          },
          'class': prefixCls + '-year-select',
          on: {
            'change': this.onYearChange
          }
        },
        [options]
      );
    },
    getMonthSelectElement: function getMonthSelectElement(prefixCls, month, months) {
      var _this2 = this;

      var h = this.$createElement;
      var fullscreen = this.fullscreen,
          validRange = this.validRange,
          value = this.value;

      var options = [];
      var start = 0;
      var end = 12;
      if (validRange) {
        var _validRange = _slicedToArray(validRange, 2),
            rangeStart = _validRange[0],
            rangeEnd = _validRange[1];

        var currentYear = value.get('year');
        if (rangeEnd.get('year') === currentYear) {
          end = rangeEnd.get('month') + 1;
        }
        if (rangeStart.get('year') === currentYear) {
          start = rangeStart.get('month');
        }
      }
      for (var index = start; index < end; index++) {
        options.push(h(
          Option,
          { key: '' + index },
          [months[index]]
        ));
      }

      return h(
        Select,
        {
          attrs: {
            size: fullscreen ? 'default' : 'small',
            dropdownMatchSelectWidth: false,

            value: String(month),

            getPopupContainer: function getPopupContainer() {
              return _this2.getCalenderHeaderNode();
            }
          },
          'class': prefixCls + '-month-select', on: {
            'change': this.onMonthChange
          }
        },
        [options]
      );
    },
    onYearChange: function onYearChange(year) {
      var value = this.value,
          validRange = this.validRange;

      var newValue = value.clone();
      newValue.year(parseInt(year, 10));
      // switch the month so that it remains within range when year changes
      if (validRange) {
        var _validRange2 = _slicedToArray(validRange, 2),
            start = _validRange2[0],
            end = _validRange2[1];

        var newYear = newValue.get('year');
        var newMonth = newValue.get('month');
        if (newYear === end.get('year') && newMonth > end.get('month')) {
          newValue.month(end.get('month'));
        }
        if (newYear === start.get('year') && newMonth < start.get('month')) {
          newValue.month(start.get('month'));
        }
      }
      this.$emit('valueChange', newValue);
    },
    onMonthChange: function onMonthChange(month) {
      var newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.$emit('valueChange', newValue);
    },
    onInternalTypeChange: function onInternalTypeChange(e) {
      this.onTypeChange(e.target.value);
    },
    onTypeChange: function onTypeChange(val) {
      this.$emit('typeChange', val);
    },
    getCalenderHeaderNode: function getCalenderHeaderNode() {
      return this.$refs.calenderHeaderNode;
    },
    getMonthYearSelections: function getMonthYearSelections(getPrefixCls) {
      var _$props = this.$props,
          customizePrefixCls = _$props.prefixCls,
          type = _$props.type,
          value = _$props.value;


      var prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
      var yearReactNode = this.getYearSelectElement(prefixCls, value.year());
      var monthReactNode = type === 'month' ? this.getMonthSelectElement(prefixCls, value.month(), getMonthsLocale(value)) : null;
      return {
        yearReactNode: yearReactNode,
        monthReactNode: monthReactNode
      };
    },
    getTypeSwitch: function getTypeSwitch() {
      var h = this.$createElement;
      var _$props2 = this.$props,
          _$props2$locale = _$props2.locale,
          locale = _$props2$locale === undefined ? {} : _$props2$locale,
          type = _$props2.type,
          fullscreen = _$props2.fullscreen;

      var size = fullscreen ? 'default' : 'small';
      return h(
        Group,
        {
          on: {
            'change': this.onInternalTypeChange
          },
          attrs: { value: type, size: size }
        },
        [h(
          Button,
          {
            attrs: { value: 'month' }
          },
          [locale.month]
        ), h(
          Button,
          {
            attrs: { value: 'year' }
          },
          [locale.year]
        )]
      );
    },
    onValueChange: function onValueChange() {
      this.$emit.apply(this, ['valueChange'].concat(Array.prototype.slice.call(arguments)));
    },
    headerRenderCustom: function headerRenderCustom(headerRender) {
      var _$props3 = this.$props,
          type = _$props3.type,
          value = _$props3.value;

      return headerRender({
        value: value,
        type: type || 'month',
        onChange: this.onValueChange,
        onTypeChange: this.onTypeChange
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        headerRender = this.headerRender;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
    var typeSwitch = this.getTypeSwitch();

    var _getMonthYearSelectio = this.getMonthYearSelections(getPrefixCls),
        yearReactNode = _getMonthYearSelectio.yearReactNode,
        monthReactNode = _getMonthYearSelectio.monthReactNode;

    return headerRender ? this.headerRenderCustom(headerRender) : h(
      'div',
      { 'class': prefixCls + '-header', ref: 'calenderHeaderNode' },
      [yearReactNode, monthReactNode, typeSwitch]
    );
  }
};