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
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template>
              <a-card :hoverable="true" size="small">
                <a-card-meta>
                  <span slot="title">{{ item.title }}</span>
                  <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" shape="square"/>
                  <div class="meta-content" slot="description">
                    <p style="display: -webkit-box;-webkit-line-clamp:2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;">{{ item.content }}</p>
                    <span style="float: right">更新于{{item.updateTime}}  <a-icon type="form"/></span>
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
            <a-radio-group v-model="radio">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="notDeleted">未删除</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
            <a-input-search placeholder="请输入"/>
          </a-col>
          <a-col :span="4" :offset="8">
            <a-button type="primary" @click="() => this.$router.push({ path:'/posting/NewPosting' })">新建帖子</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-list size="large" :pagination="pagination">
            <a-list-item :key="index" v-for="(item, index) in publishedData">
              <a-list-item-meta>
                <span slot="description" style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.description }}</span>
                <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
                <a slot="title">{{ item.title }}</a>
              </a-list-item-meta>
              <div slot="actions">
                <router-link :to="{name: 'posting/posting', params: {postingId: item.id}}">查看</router-link>
              </div>
              <div slot="actions">
                <a @click="showDeleteModal(item.id)">删除</a>
              </div>
              <div class="list-content">
                <div class="list-content-item">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div class="list-content-item">
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
      pagination,
      radio: 'all'
    }
  },
  created () {
    this.updateNearAuditData()
    this.updatePublishedData()
  },
  methods: {
    updateNearAuditData () {
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
              title: data[key].title,
              avatar: data[key].firstPicUrl,
              content: data[key].content,
              updateTime: this.transferTime(data[key].updateTime)
            })
          }
          this.nearlyData = nearData
          console.log(res)
        })
      },
    updatePublishedData () {
      request({
        url: '/posting/organizationGetPublishedPostingList',
        method: 'get'
      })
        .then(res => {
          const publishedData = []
          const data = res.data
          const records = data.records
          for (const key in records) {
            publishedData.push({
              id: key,
              title: records[key].title,
              avatar: records[key].firstPicUrl,
              description: records[key].content,
              owner: records[key].owner,
              startAt: this.transferTime(records[key].updateTime),
              views: records[key].viewCount,
              favoriete: records[key].likeCount
            })
          }
          this.publishedData = publishedData
          this.pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: data.size,
            total: data.total,
            current: data.current
          }
          console.log(res)
        })
    },
    goToPostingLibrary (e) {
      console.log('go')
      this.$router.push({ path: '/posting/postingLibrary' })
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
        url: '/posting/organizationDeletePosting/' + this.modal.id,
        method: 'delete'
      })
      this.modal.visible = false
      this.updatePublishedData()
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
</style>
