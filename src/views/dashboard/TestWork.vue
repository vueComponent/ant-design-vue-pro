<template>
  <div>
    <h2>本页面内容均为测试功能，暂不提供稳定性保证</h2>
    <a-divider />
    <div class="multi-tab-test">
      <h4>多标签组件测试功能</h4>
      <a-button @click="handleCloseCurrentTab" style="margin-right: 16px;">关闭当前页</a-button>
      <a-button @click="handleOpenTab">打开 任务列表</a-button>
    </div>
    <a-divider />
  </div>
</template>

<script>
export default {
  name: 'TestWork',
  methods: {
    handleCloseCurrentTab () {
      this.$multiTab.close()
    },
    handleOpenTab () {
      this.$multiTab.open('/features/task')
    }
  }
}
</script>

<style scoped>

</style>
