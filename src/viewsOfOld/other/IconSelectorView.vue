<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <icon-selector v-model="currentSelectedIcon" @change="handleIconChange"/>

    <a-divider />
    <p>测试 IconSelector 组件 v-model 功能</p>
    <a-button @click="changeIcon('down')">改变 Icon-down</a-button>
    <a-divider type="vertical" />
    <a-button @click="changeIcon('cloud-download')">改变 Icon-cloud-download</a-button>
  </a-card>
</template>

<script>
import IconSelector from '@/components/IconSelector'

export default {
  name: 'IconSelectorView',
  components: {
    IconSelector
  },
  data () {
    return {
      currentSelectedIcon: 'pause-circle'
    }
  },
  methods: {
    handleIconChange (icon) {
      console.log('change Icon', icon)
      this.$message.info(<span>选中图标 <code>{icon}</code></span>)
    },
    changeIcon (type) {
      this.currentSelectedIcon = type
    }
  }
}
</script>
