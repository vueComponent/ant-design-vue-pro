<template>
  <div>
    <h2>本页面内容均为测试功能，暂不提供稳定性保证</h2>
    <a-divider />
    <div class="multi-tab-test">
      <h4>多标签组件测试功能</h4>
      <a-button @click="handleCloseCurrentTab" style="margin-right: 16px;">关闭当前页</a-button>
      <a-button @click="handleOpenTab">打开 任务列表</a-button>
      <a-input ref="tInput" />
    </div>
    <a-divider />
    <div class="page-loading-test">
      <h4>全局遮罩测试</h4>
      <a-button @click="handleOpenLoading" style="margin-right: 16px;">打开遮罩(5s 自动关闭)</a-button>
      <a-button @click="handleOpenLoadingCustomTip">打开遮罩(自定义提示语)</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestWork',
  methods: {
    handleCloseCurrentTab () {
      this.$multiTab.closeCurrentPage() // or this.$multiTab.close()
    },
    handleOpenTab () {
      this.$multiTab.open('/features/task')
    },

    handleOpenLoading () {
      this.$nextTick(function () {
        console.log('this', this)
        console.log('this.$refs.tInput', this.$refs.tInput)
      })
      this.$loading.show()
      setTimeout(() => {
        this.$loading.hide()
      }, 5000)
    },
    handleOpenLoadingCustomTip () {
      this.$loading.show({ tip: '自定义提示语' })
      setTimeout(() => {
        this.$loading.hide()
      }, 5000)
    }
  }
}
</script>

<style scoped>

</style>
