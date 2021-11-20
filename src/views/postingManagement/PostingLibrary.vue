<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :span='6'>
          <a-input-search placeholder='请输入' v-model='search'/>
        </a-col>
        <a-col :span='4' :offset='14'>
          <a-button type='primary' @click='goToNewPosting'>新建帖子</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-list
          :grid="{gutter: 24, column:3}"
          :dataSource="data"
          class="card-list"
          style='margin-top: 15px'
          size="large"
          :pagination="pagination">
          <a-list-item slot="renderItem" slot-scope="item">
            <template>
              <a-card :hoverable="true" size='small'>
                <a-card-meta>
                  <span slot="title">{{ item.title }}</span>
                  <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" shape='square'/>
                  <div class="meta-content" slot="description">
                    <p style='display: -webkit-box;-webkit-line-clamp:2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;'>{{ item.content }}</p>
                    <span style='float: right'>更新于{{item.updateTime}}   <a-icon type='delete' @click="showDeleteModal(item.id)" style='font-size: 20px'/>   <a-icon type='form' @click="goToEditorPosting(item.id)" style='font-size: 20px'/></span>
                  </div>
                </a-card-meta>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </a-row>
    </a-card>
    <a-modal
      v-model="modal.visible"
      title="操作确认"
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

const data = []
const pagination = {}

export default {
  name: 'postingLibrary',
  data () {
    return {
      modal: { visible: false },
      data,
      search: '',
      pagination
    }
  },
  created () {
    this.updateData()
  },
  methods: {
    updateData () {
      request({
        url: '/posting/organizationGetUnpublishedPostingList',
        method: 'get'
      })
        .then(res => {
          const data = []
          const records = res.data.records
          for (const key in records) {
            data.push({
              id: records[key].id,
              title: records[key].title,
              avatar: records[key].firstPicUrl,
              content: records[key].content,
              updateTime: this.transferTime(records[key].updateTime)
            })
          }
          console.log('data:' + data)
          this.data = data
          this.pagination = {
            showQuickJumper: true,
            total: res.data.total,
            pageSize: res.data.size,
            current: res.data.current,
            showTotal: total => `总共${total}个项目`
          }
          console.log(res)
        })
    },
    goToNewPosting (e) {
      console.log('go')
      this.$router.push({ path: '/posting/newPosting' })
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
        message: '确定要删除这个帖子素材吗？',
        type: 'deleteModal'
      }
    },
    tapOkForModal () {
      request({
        url: '/posting/organizationDeletePosting/' + this.modal.id,
        method: 'delete'
      })
      this.modal.visible = false
      this.updateData()
    }
  }
}
</script>

<style scoped>
.card-avatar {
  width: 72px;
  height: 72px;
}
</style>
