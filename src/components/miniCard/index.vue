<template>
  <div>
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span class="chart-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total" :style="{fontSize:titleFontSize+'px'}">
        <slot name="total">
          <span>{{ typeof total === 'function' && total() || total }}</span>
          <span v-if="suffix" v-text="suffix" class="suffix"></span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    },
    titleFontSize: {
      type: Number,
      default: 30
    },
    suffix: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.chart-card-header {
  position: relative;
  overflow: hidden;
  width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}

.chart-card-action {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 30px;
  line-height: 38px;
  height: 38px;
}

.suffix {
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  font-style: normal;
}
</style>
