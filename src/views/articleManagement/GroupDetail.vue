<template>
  <a-modal
    v-model="visible"
    title='组队详情'
    width='80%'
    :dialogStyle='{
      top: "10px"
    }'
  >
    <a-card :bordered="false">
      <a-row style="font-size: 20px;font-weight: bold;">
        <a-col :span="20">组队标题：{{item.title}}</a-col>
        <a-col :span="4">组队进度：{{item.participantNumber}}/{{item.dueMember}}</a-col>
      </a-row>
      <a-row style="font-size: 20px;font-weight: bold;">
        <a-col :span="10">开始时间：{{item.createTime}}</a-col>
        <a-col :span="10">截止时间：{{item.updateTime}}</a-col>
      </a-row>
      <a-row style="font-size: 20px;font-weight: bold;">
        <a-col :span="24">{{item.content}}</a-col>
      </a-row>
      <div class="pictures" style='text-align: center'>
        <img :src="item.firstPicUrl" style="width: 200px">
      </div>
      <div class="question" style="font-size: 15px;font-weight: bold">
        <span class="question-title">问卷问题<br/></span>
        <span v-for="(question,index) in (item.questionJson || [])" :key="(question,index)">{{ index+1 }}.{{ question }}<br/></span>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { adminGetTeam } from '@/api/dynamic'

export default {
  name: 'GroupDetail',
  data () {
    return {
      questions: ['你帅吗？', '你美吗？', '', '', '', ''],
      visible: false,
      item: {}
    }
  },
  methods: {
    open (item) {
      this.item = item || {}
      this.visible = true
      this.getData()
    },
    getData () {
      adminGetTeam(this.item.id).then(res => {
        if (res.success) {
          this.item = res.data
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
