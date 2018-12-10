<template>
  <li :class="[prefixCls, size]">
    <slot>
      <tooltip>
        <template slot="title">{{ tips }}</template>
        <avatar :size="size !== 'mini' && size || 20" :src="src" />
      </tooltip>
    </slot>
  </li>
</template>

<script>
  import Avatar from 'ant-design-vue/es/avatar'
  import Tooltip from 'ant-design-vue/es/tooltip'

  export default {
    name: "AvatarItem",
    components: {
      Avatar,
      Tooltip
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-avatar-list-item'
      },
      tips: {
        type: String,
        default: '',
        required: false
      },
      src: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        size: this.$parent.size
      }
    },
    watch: {
      '$parent.size' (val) {
        this.size = val
      }
    }
  }
</script>