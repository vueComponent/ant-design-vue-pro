<template>
  <div>

  </div>
</template>

<script>
  import Avatar from 'ant-design-vue/es/avatar'
  import AvatarListItem from './Item'

  export default {
    name: "AvatarList",
    components: {
      Avatar,
      AvatarListItem
    },
    props: {
      /**
       * 头像大小 类型: large、small 、mini, default
       * 默认值: default
       */
      size: {
        type: String,
        default: 'default'
      },
      /**
       * 要显示的最大项目
       */
      maxLength: {
        type: Number,
        default: 3
      },
      /**
       * 额外 CSS 风格
       */
      excessItemsStyle: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {

      }
    }
  }
</script>

<style scoped>

</style>