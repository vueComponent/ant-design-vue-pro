<template>
  <div>
    <a-modal v-model="isVisible" title="组队详情" ok-text="确认" cancel-text="取消" @ok="hideModal" width="65%">
        <a-row style="margin-bottom:15px;">
          <a-col :md="24" :lg="24">
            <span class="label">组队标题:</span>
            <span class="content">{{ dataItem.title }}</span>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="24" :lg="24">
            <span class="label">内容:</span>
            <span class="content">{{ dataItem.content }}</span>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="24" :lg="24">
           <span class="label"> 开始时间:</span>
            <span class="content">{{dataItem.createTime}}</span>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="24" :lg="24">
            <span class="label">截止时间:</span>
            <span class="content">{{ dataItem.dueTime }}</span>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="24" :lg="24">
            <span class="label">组队主题:</span>
            <span class="content">{{ dataItem.dueTime }}</span>
          </a-col>
        </a-row>
      </a-modal>
  </div>
</template>

<script>
import { getFeedBack, deleteFeedBack, updateFeedBack } from '@/api/planet' // 引入后台接口

export default {
  name: 'teamDetails',
  data () {
    return {
        isVisible: false, // 组队详情弹框
        dataItem: {} // 父组件传过来的数据
    }
  },
  created () {
  },
  beforeCreate () {
   
  },
  methods: {
      hideModal() {
          this.isVisible = false
      }
  }
}
</script>

<style scoped>
.label {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 30px;
}
.content {
    color: #ccc;
}
</style>
