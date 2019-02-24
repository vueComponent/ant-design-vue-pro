<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <icon-selector @change="handleIconChange"/>
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

    }
  },
  methods: {
    handleIconChange (icon) {
      console.log('change Icon', icon)
      this.$message.info(<span>选中图标 <code>{icon}</code></span>)
    }
  }
}
</script>
