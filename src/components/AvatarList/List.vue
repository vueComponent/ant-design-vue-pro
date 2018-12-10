<template>
  <div :class="[prefixCls]">
    <ul>
      <slot></slot>
      <template v-if="maxLength > 0 && slotsSize > maxLength">
        <avatar-item :size="size">
          <avatar :size="size !== 'mini' && size || 20" :style="excessItemsStyle">{{ `+${maxLength}` }}</avatar>
        </avatar-item>
      </template>
    </ul>
  </div>
</template>

<script>
  import Avatar from 'ant-design-vue/es/avatar'
  import AvatarItem from './Item'

  export default {
    AvatarItem,
    name: "AvatarList",
    components: {
      Avatar,
      AvatarItem
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-avatar-list'
      },
      /**
       * 头像大小 类型: large、small 、mini, default
       * 默认值: default
       */
      size: {
        type: [String, Number],
        default: 'default'
      },
      /**
       * 要显示的最大项目
       */
      maxLength: {
        type: Number,
        default: 0
      },
      /**
       * 多余的项目风格
       */
      excessItemsStyle: {
        type: Object,
        default: () => {
          return {
            color: '#f56a00',
            backgroundColor: '#fde3cf'
          }
        }
      }
    },
    data () {
      return {
        slotsSize: 0
      }
    },
    created () {
      this.slotsSize = this.$slots.default.length
      this.splitSlots()
    },
    methods: {
      splitSlots () {
        if (this.maxLength !== 0 && this.slotsSize > this.maxLength) {
          this.$slots.default = this.$slots.default.slice(0, this.maxLength)
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>