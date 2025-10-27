<!-- 查看详细信息 -->
<template>
  <a-modal
     v-if="model !== null"
    :title="model.title || ''"
    :width="model.width || 640"
    :visible="visible"
    :confirmLoading="loading"
    :footer="null"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-descriptions :column="2" layout="horizontal" size="default">
        <a-descriptions-item v-for="(item, index) in model.data" :key="index" :label="item.label">
          {{ item.value === null ? '-' : item.value }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-modal>
</template>

<script>
// 格式
/**
  {
  // 模态框标题
    title: '详细信息',
    // model宽度
    width: 640,
    data: [
      { label: '会员ID', value: record.id },
    ]
  }
 */

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      // form: this.$form.createForm(this)
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  li {
    float: left;
    width: 50%;
    min-height: 30px;
  }
}
</style>
