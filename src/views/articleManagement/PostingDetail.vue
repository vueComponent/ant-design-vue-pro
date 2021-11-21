<!--
* @Description:
* 
* @Date: 2021/11/12
-->
<template>
  <a-modal
    v-model="visible"
    title="帖子详情"
    width="80%"
    :dialogStyle="{
      top: &quot;10px&quot;
    }"
  >
    <a-card>
      <a-row :bordered="false" style="font-size: 20px;font-weight: bold;" :gutter="[0,16]">
        <a-col :span="24">标题：{{ item.title }}</a-col>
        <a-col :span="6">所属板块：{{ item.labelContent }}</a-col>
        <a-col :span="6">帖子id：{{ item.id }}</a-col>
        <a-col :span="6">用户id：{{ item.adminId }}</a-col>
        <a-col :span="6">用户昵称：{{ item.adminName }}</a-col>
        <a-col :span="6">发帖时间：{{ item.createTime }}</a-col>
        <a-col :span="24">文章详情：{{ item.brief }}</a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>

<script>
export default {
  name: 'PostingDetail',
  data () {
    return {
      visible: false,
      item: {}
    }
  },
  methods: {
    /**
     * 打开弹框
     * 
     */
    open (item) {
      this.item = item || {}
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
