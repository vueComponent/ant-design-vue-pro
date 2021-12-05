<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="[0,16]">
          <span style="font-weight: bold;height: 30px;line-height: 30px">最近编辑</span>
          <a-button style="float: right" @click="goToPostingLibrary">全部帖子素材</a-button>
        </a-row>
        <a-list
          rowKey="id"
          :grid="{gutter: 24, column:3}"
          :dataSource="nearlyData"
          class="card-list"
          style="margin-top: 15px"
          :loading="nearlyDataLoading"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template>
              <a-card :hoverable="false" size="small" >
                <a-card-meta>
                  <span slot="title">{{ item.title }}</span>
                  <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" shape="square"/>
                  <div class="meta-content" slot="description">
                    <p style="display: -webkit-box;-webkit-line-clamp:1;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;">{{ item.brief }}</p>
                    <span style="float: right;font-size: 12px;">更新于{{item.updateTime}}  <a-icon style="font-size: 15px;color: #314659;" type="form" @click="goToEditorPosting(item.postingId)"/></span>
                  </div>
                </a-card-meta>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <a-card style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-row :gutter="[0,0]" style="font-weight: bold;margin-bottom: 10px">已发布</a-row>
        <a-row :gutter="[0,0]">
          <a-col :span="6">
            <a-radio-group v-model="radio" @change="changePublishedDataType">
              <a-radio-button value="1">全部</a-radio-button>
              <a-radio-button value="0">未删除</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
            <a-input-search placeholder="请输入" v-model="keyword" @search="searchPublishedData"/>
          </a-col>
          <a-col :span="4" :push="10">
            <a-button type="primary" @click="() => this.$router.push({ path:'/posting/NewPosting' })">新建帖子</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-list size="large" :pagination="pagination" :loading="loading">
            <a-list-item :key="index" v-for="(item, index) in publishedData" :class="item.deleted?'deleted':''">
              <a-list-item-meta>
                <span slot="description"  style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.description }}</span>
                <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
                <a slot="title" >{{ item.title }}<span v-if="item.censored" style="color: red;">（因疑似违规已被屏蔽）</span></a>
              </a-list-item-meta>
              <div slot="actions">
                <router-link v-if="!item.deleted" :to="{name: 'postingDetail', params: {postingId: item.postingId}}">查看</router-link>
                <span v-else>&#12288;&#12288;</span>
              </div>
              <div slot="actions">
                <a v-if="!item.deleted" @click="showDeleteModal(item.postingId)">删除</a>
                <span v-else>&#12288;&#12288;</span>
              </div>
              <div class="list-content">
                <div class="list-content-item" :class="item.deleted?'deleted':''">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div class="list-content-item" :class="item.deleted?'deleted':''">
                  <span>开始时间</span>
                  <p>{{ item.startAt }}</p>
                </div>
                <div class="list-content-item">
                  <span><a-icon type="eye"/>{{ item.views }}</span>
                </div>
                <div class="list-content-item">
                  <span><a-icon type="star"/>{{ item.favorite }}</span>
                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-row>
      </div>
    </a-card>
    <a-modal
      v-model="modal.visible"
      title="Modal"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForModal"
      width="30%">
      <p>{{ modal.message }}</p>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import request from '@/utils/request'

const nearlyData = []
const publishedData = []
const pagination = { showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50 }
export default {
  name: 'PostingManagement',
  data () {
    return {
      modal: { visible: false },
      nearlyData,
      publishedData,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        // total: data.total,
        current: 1,
        onChange: this.updatePublishedDataPage,
        onShowSizeChange: this.updatePublishedDataPage
      },
      radio: '1',
      nearlyDataLoading: true,
      loading: true,
      keyword: '',
      pageNo: 1,
      pageSize: 10
    }
  },
  created () {
    this.updateNearAuditData()
    this.getPublishedData()
  },
  methods: {
    updateNearAuditData () {
      this.nearlyDataLoading = true
      request({
        url: '/posting/organizationGetRecentlyEditPostings',
        method: 'get'
      })
        .then(res => {
          const nearData = []
          const data = res.data
          for (const key in data) {
            nearData.push({
              id: key,
              postingId: data[key].id,
              title: data[key].title || ' ',
              avatar: data[key].firstPicUrl,
              brief: data[key].brief || '什么都没有',
              updateTime: this.transferTime(data[key].updateTime)
            })
          }
          this.nearlyData = nearData
          console.log(res)
          this.nearlyDataLoading = false
        })
      },
    changePublishedDataType () {
      this.publishedDataType=this.radio
      this.getPublishedData()
    },
    searchPublishedData (keyword) {
      this.keyword=keyword
      this.getPublishedData()
    },
    updatePublishedDataPage (pageNo,pageSize) {
      this.pageNo=pageNo
      this.pageSize=pageSize
      this.getPublishedData()
    },
    getPublishedData () {
      this.loading=true
      request({
        url: '/posting/organizationGetPublishedPostingList',
        method: 'get',
        params: {
          keyword:this.keyword,
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          hidden: this.publishedDataType
        }
      })
        .then(res => {
          console.log(res)
          const publishedData = []
          const data = res.data
          const records = data.records
          for (const key in records) {
            publishedData.push({
              id: key,
              postingId: records[key].id,
              title: records[key].title,
              avatar: records[key].firstPicUrl,
              description: records[key].brief,
              owner: records[key].owner,
              startAt: this.transferTime(records[key].updateTime),
              views: records[key].viewCount.toString().padStart(2),
              favorite: records[key].likeCount.toString().padStart(3),
              deleted: records[key].hidden,
              censored: records[key].censored
            })
          }
          this.publishedData = publishedData
          this.pagination.total=data.total
          this.pagination.pagesize=data.size
          this.pagination.current=data.current
          this.loading=false
          // console.log(publishedData)
          // this.pagination = {
          //   showSizeChanger: true,
          //   showQuickJumper: true,
          //   pageSize: data.size,
          //   total: data.total,
          //   current: data.current
          // }
          // console.log(res)
        })
    },
    goToPostingLibrary (e) {
      console.log('go')
      this.$router.push({ path: '/posting/postingLibrary' })
    },
    goToEditorPosting (e) {
      this.$router.push({ name: 'editPosting', params: { postingId: e } })
    },
    transferTime (time) {
      const day = time.split(' ')
      const array = day[0].split('-')
      return array[1] + '月' + array[2] + '日'
    },
    showDeleteModal (id) {
      this.modal = {
        id,
        visible: true,
        message: '你确定删除这篇帖子吗？',
        type: 'deleteModal'
      }
    },
    tapOkForModal () {
      request({
        url: '/posting/organizationLogicDeletePosting/' + this.modal.id,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.modal.visible = false
        this.getPublishedData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card-avatar {
  width: 72px;
  height: 72px;
}
.list-content-item {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
      line-height: 20px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
}
.deleted {
  text-decoration: line-through;
  color: #909399;
}
</style>
