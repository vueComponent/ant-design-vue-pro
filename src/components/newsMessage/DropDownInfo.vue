<template>
  <a-dropdown :trigger="['click']" v-model="show">
    <div slot="overlay">
      <a-spin :spinning="loading">
        <a-tabs class="dropdown-tabs" :style="{width: '350px'}">
          <a-tab-pane tab="消息中心">
            <a-list class="tab-pane" v-for="(item, index) in (showDisplay? unReadMessage : textList)" :key="index">
              <div class="titleTime">
                <img src="../../assets/notice.png" />
                <span>{{ item.updatedDate | formDate }}</span>
                <p>{{ item.content }}</p>
              </div>
            </a-list>
            <div v-if="unReadMessage.length == 0? true : false" class="info">暂无新的消息</div>
            <!-- <div @click="showDisplay = !showDisplay" class="show" v-if="unReadMessage.length > 3">
              <span>
                {{ !showDisplay? '展开' : '收起' }}
              </span>
            </div> -->
            <button type="button" @click="homeToInfo()" class="btn" v-if="unReadMessage.length > 0">查看所有消息 >>></button>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>
    <span @click="fetchNotice" class="header-notice">
      <a-badge class="notice-badge" :count="messageNum">
        <a-icon :class="['header-notice-icon']" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
</template>

<script>
import { getUnReadAnnouncement } from '@/api/basis'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      show: false,
      unReadMessage: [],
      showDisplay: false
    }
  },
  created () {
    this.fetchNotice()
  },
  computed: {
    ...mapGetters({
      messageNum: 'messageNum'
    }),
    textList () {
      if (this.showDisplay == false) {
        let textList = []
        if (this.unReadMessage.length > 3) {
          for (var i = 0; i < 3; i++) {
            textList.push(this.unReadMessage[i])
          }
        } else {
          textList = this.unReadMessage
        }
        return textList
      } else {
        return this.unReadMessage
      }
    }
  },
  filters: {
    formDate (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async fetchNotice () {
      if (this.loading) {
        this.loading = false
        return
      }
      if (this.show) return
      this.loading = true
      const res = await getUnReadAnnouncement()
      this.unReadMessage = res.data
      this.$store.commit('TOGGLE_MESSAGE_NUM', res.data.length || '')
      this.loading = false
    },
    homeToInfo () {
      if(this.unReadMessage[0].type == 1){
        this.$router.push({ name: 'base' })
      }else{
        this.$router.push({ name: 'branch' })
      }
      
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .notice-badge{
      color: inherit;
      .header-notice-icon{
        font-size: 16px;
        padding: 4px;
      }
    }
  }
  .dropdown-tabs{
    background-color: #fff;
    box-shadow: 0 2px 8px #999;
    border-radius: 4px;
    position: absolute;
    right: -100px;
    .tab-pane{
      padding: 0 24px 12px;
      max-height: 200px;
    }
    .ant-tabs-ink-bar {
      width: 0 !important;
    }
    .ant-tabs-tab{
      color: #000 !important;
      font-size: 16px !important;
    }
    .ant-list-item-meta-description {
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
    }
    .info{
      width: 100%;
      height: 100px;
      font-size: 16px;
      text-align: center;
    }
    .titleTime{
      width: 100%;
      img{
        width: 20px;
        height: 20px;
        margin-top: -3px;
        margin-right: 10px;
      }
      span{
        color: #999;
      }
      p{
        margin-top: 10px;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
      }
    }
  }
  .btn{
      width: 100%;
      height: 42px;
      border: unset;
      background: #fff;
      border-top: 1px solid #ccc;
      color: #333;
      cursor: pointer;
    }
    .show {
      height: 20px;
      text-align: center;
      color: blue;
      cursor: pointer;
    }
  .ant-badge{
        color: #1890ff !important;
    }
  .ant-avatar-image{
    width: 20px !important;
    height: 20px !important;
    margin-top: 2px !important;
  }
</style>
