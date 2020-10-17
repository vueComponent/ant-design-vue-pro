<template>
  <div :class="[prefixCls]">
    <div v-if="title" :class="[`${prefixCls}-title`]" :title="typeof title === 'string' ? title : ''">
      {{ title }}
    </div>
    <slot name="subtitle">
      <span :class="[`${prefixCls}-subtitle`]">
        <span>{{ typeof subTitle === 'string' ? subTitle : subTitle() }}</span>
        <a-tooltip v-if="showTooltip" :title="tooltipTitle" slot="action">
          <a-icon :type="tooltipIcon" :style="tooltipIconStyle" />
        </a-tooltip>
      </span>
    </slot>
    <div class="number-info-value" :style="gap ? { marginTop: gap } : null">
      <span>{{ total }}</span>
      <span v-if="status || subTotal" class="sub-total">
        {{ subTotal }}
        <icon v-if="status" :type="`caret-${status}`" />
      </span>
    </div>
  </div>
</template>

<script>
import Icon from 'ant-design-vue/es/icon'

export default {
  name: 'NumberInfo',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-number-info'
    },
    total: {
      type: [Number, String],
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    },
    title: {
      type: [String, Function],
      default: ''
    },
    subTitle: {
      type: [String, Function],
      default: ''
    },
    status: {
      type: String,
      default: 'up'
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    tooltipTitle: {
      type: String,
      default: ''
    },
    tooltipIcon: {
      type: String,
      default: 'info-circle-o'
    },
    tooltipIconStyle: {
      type: [String, Object],
      default: function () {
        return { marginLeft: '8px' }
      }
    },
    gap: {
      type: Number,
      default: 8
    }
  },
  components: {
    Icon
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  @import "index";
</style>
