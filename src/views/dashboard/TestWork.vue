<template>
  <div>
    <h2>本页面内容均为测试功能，暂不提供稳定性保证</h2>
    <a-divider />
    <div class="multi-tab-test">
      <h4>多标签组件测试功能</h4>
      <a-button @click="handleCloseCurrentTab" style="margin-right: 16px;">关闭当前页</a-button>
      <a-button @click="handleOpenTab" style="margin-right: 16px;">打开 任务列表</a-button>
      <a-popconfirm :visible="visible" @confirm="confirm" @cancel="cancel" okText="确定" cancelText="取消">
        <template v-slot:title>
          <div>
            <a-form :form="form" layout="inline">
              <a-form-item label="自定义名称">
                <a-input v-decorator="['tabName', {rules: [{required: true, message: '请输入新的 Tab 名称'}]}]"/>
              </a-form-item>
            </a-form>
          </div>
        </template>
        <a-button @click="() => visible = !visible" style="margin-right: 16px;">修改当前 Tab 名称</a-button>
      </a-popconfirm>

      <a-popconfirm :visible="visible2" @confirm="confirm2" @cancel="() => visible2 = false" okText="确定" cancelText="取消">
        <template v-slot:title>
          <div>
            <p>页面 KEY 是由页面的路由 <code>path</code> 决定的</p>
            <p>如果要修改某一个页面标题，该页面必须已经被打开在 Tab 栏</p>
            <p>后期可以考虑优化到编程式 Tab 栏，就可以没有这种限制</p>
            <a-form :form="form2" layout="inline">
              <a-form-item label="页面KEY">
                <a-input v-decorator="['tabKey', { initialValue: '/dashboard/workplace' }]" />
              </a-form-item>
              <a-form-item label="自定义名称">
                <a-input v-decorator="['tabName', {rules: [{required: true, message: '请输入新的 Tab 名称'}]}]"/>
              </a-form-item>
            </a-form>
          </div>
        </template>
        <a-button @click="() => visible2 = !visible2">修改某一个 Tab 名称</a-button>
      </a-popconfirm>
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
  data () {
    return {
      visible: false,
      visible2: false
    }
  },
  created () {
    this.form = this.$form.createForm(this)
    this.form2 = this.$form.createForm(this)
  },
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
    },

    // confirm
    confirm (e) {
      e.stopPropagation()
      const { path } = this.$route
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$multiTab.rename(path, values.tabName)
          this.visible = false
        }
      })
    },
    cancel () {
      this.visible = false
    },
    confirm2 (e) {
      e.stopPropagation()
      this.form2.validateFields((err, values) => {
        if (!err) {
          this.$multiTab.rename(values.tabKey, values.tabName)
          this.visible2 = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
