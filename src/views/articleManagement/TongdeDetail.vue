<template>
  <a-modal
    v-model="visible"
    title='动态详情'
    width='80%'
    :dialogStyle='{
      top: "10px"
    }'
  >
    <a-card>
      <a-row :bordered="false" style="font-size: 20px;font-weight: bold;" :gutter="[0,16]">
        <a-col :span="6">标题：{{item.name}}</a-col>
        <a-col :span="6">招领类型：{{item.typeText}}</a-col>
        <a-col :span="6">标签：<a-tag v-for="tag in item.labelList" :key="tag">#{{ tag }}</a-tag></a-col>
        <a-col :span="6">遗失地点：{{item.location}}</a-col>
        <a-col :span="6">失物id：{{item.id}}</a-col>
        <a-col :span="6">用户id：{{item.userId}}</a-col>
        <a-col :span="6">用户昵称：{{item.userNickName}}</a-col>
        <a-col :span="6">联系方式：{{item.contact}}</a-col>
        <a-col :span="6">发帖时间：{{item.createTime}}</a-col>
      </a-row>
<!--      <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.t-jiaju.com%2FtujjJDEwLmFsaWNkbi5jb20vaTIvNzg2NjM2NjUvVEIyQ1pUcGR3Zkg4S0pqeTF6Y1hYY1R6cFhhXyEhNzg2NjM2NjUkOQ.jpg&refer=http%3A%2F%2Fwww.t-jiaju.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632194368&t=109ef35d45b7cd5e0be2c2eb81f6156b">-->
      <img :src="item.firstPicUrl">
    </a-card>
  </a-modal>
</template>

<script>
export default {
  name: 'TongdeDetail',
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
