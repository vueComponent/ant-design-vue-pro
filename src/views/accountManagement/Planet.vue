<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type="primary" style="margin-left: 8px;" @click="doQuery">刷新</a-button>
            </a-col>
            <a-col :span="3">
              <a-form-item label="uid">
                <a-input
                  placeholder=""
                  v-decorator="['uid']"/>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="账号状态">
                <a-select
                  placeholder="请选择"
                  v-decorator="['accountStatus',{initialValue:'-1'}]">
                  <a-select-option value="-1">所有账号</a-select-option>
                  <a-select-option value="0">正常账号</a-select-option>
                  <a-select-option value="1">已禁言账号</a-select-option>
                  <a-select-option value="2">已封禁账号</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" v-decorator="['beginTime']"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" v-decorator="['endTime']"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" html-type="submit" @click="doQuery" style="margin-left: 8px">查询</a-button>
                <a-button type="primary" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="queryParam.loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="personalTags" slot-scope="tags">
          <a-tag v-for="tag in tags" :key="tag">{{ tag.content }}</a-tag>
        </span>
        <span slot="interestTags" slot-scope="tags">
          <a-tag v-for="tag in tags" :key="tag">{{ tag.content }}</a-tag>
        </span>
        <span slot="historicalTeam" slot-scope="id">
          <router-link :to="{path:'/请把这里的路由跳转实现一下/'+id}">查看</router-link>
        </span>
        <span slot="operations" slot-scope="record">
          <a-button :hidden="record.blockType===0" @click="recoverAccount(record.id, record.nickName);modalParam.show=true;">恢复</a-button>
          <a-button :hidden="record.blockType!==0" @click="muteAccount(record.id, record.nickName);modalParam.show=true;">禁言</a-button>
          <a-button :hidden="record.blockType===2" @click="blockAccount(record.id, record.nickName);modalParam.show=true;">封禁</a-button>
        </span>
      </a-table>
      <!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
    </a-card>
    <a-modal
      ref="modalForm"
      title="操作确认"
      :width="800"
      :visible="modalParam.show"
      @ok="sendModalRequest()"
      cancelText="关闭"
      @cancel="modalParam.show=false"
      style="top:5%;height: 85%; overflow-y: hidden">
      <p>{{ modalParam.content }}</p>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import request from '@/utils/request'

const columns = [
  {
    title: 'uid',
    dataIndex: 'id',
    key: 'uid'
  }, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  }, {
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    sorter: true
  }, {
    title: '学历',
    dataIndex: 'identification',
    key: 'background'
  }, {
    title: '个人标签',
    dataIndex: 'personalLabel',
    key: 'personalTags',
    scopedSlots: { customRender: 'personalTags' }
  }, {
    title: '兴趣标签',
    dataIndex: 'interestLabel',
    key: 'interestTags',
    scopedSlots: { customRender: 'interestTags' }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '历史组队',
    dataIndex: 'id',
    key: 'historicalTeam',
    scopedSlots: { customRender: 'historicalTeam' }
  }, {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

const tableData = [
  // {
  //   key: '1',
  //   uid: '10086',
  //   nickName: '中国移动',
  //   grade: '大五',
  //   background: '本科',
  //   personalTags: ['好学小白', '领导者'],
  //   interestTags: ['口才', '设计', '才艺'],
  //   createTime: '1202-01-01 10:24',
  //   historicalTeam: '查看',
  //   operation: ['禁言', '操作记录']
  // }, {
  //   key: '2',
  //   uid: '10086',
  //   nickName: '中国移动',
  //   grade: '大五',
  //   background: '本科',
  //   personalTags: ['好学小白', '领导者'],
  //   interestTags: ['口才', '设计', '才艺'],
  //   createTime: '1202-01-01 10:24',
  //   historicalTeam: '查看',
  //   operation: ['解除禁言', '操作记录']
  // }, {
  //   key: '3',
  //   uid: '10086',
  //   nickName: '中国移动',
  //   grade: '大五',
  //   background: '本科',
  //   personalTags: ['好学小白', '领导者'],
  //   interestTags: ['口才', '设计', '才艺'],
  //   createTime: '1202-01-01 10:24',
  //   historicalTeam: '查看',
  //   operation: ['操作记录']
  // }
]

export default {
  name: 'Planet',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    return {
      columns,
      tableData,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      queryParam: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        stripe: true,
        tableSize: 'default',
        loading: false
      },
      modalParam: {
        content: '',
        show: false,
        url: '',
        method: '',
        params: {}
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  created () {
    this.doQuery()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        console.log(err)
        console.log(value)
      })
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.pageNo = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.doQuery()
    },
    doQuery: function () {
      const that = this
      that.queryParam.loading = true
      that.form.validateFields((err, formValues) => {
        console.log(formValues, err)
        let startTime, endTime
        if (formValues.beginTime !== undefined && formValues.beginTime !== null) {
          startTime = that.$moment(formValues.beginTime).format('yyyy-MM-DD HH:mm:ss')
        } else {
          startTime = undefined
        }
        if (formValues.endTime !== undefined && formValues.endTime !== null) {
          endTime = that.$moment(formValues.endTime).format('yyyy-MM-DD HH:mm:ss')
        } else {
          endTime = undefined
        }
        const params = {
          pageSize: that.queryParam.pageSize,
          pageNo: that.queryParam.pageNo,
          userId: formValues.uid,
          blockType: formValues.accountStatus,
          startTime: startTime,
          endTime: endTime
        }
        console.log(params)
        const promise = new Promise(function (resolve, reject) {
          request({
            url: '/user/adminQueryUserInfo',
            method: 'get',
            params: params
          }).then(res => {
            console.log(res)
            resolve(res)
          })
        })
        promise.then((res) => {
            console.log(res)
            that.tableData = res.data.records
            that.pagination.total = res.data.total
            that.queryParam.loading = false
          }
        )
      })
    },
    updateData () {
      request({
        url: '/team/adminGetTeamList',
        method: 'post'
      })
    },
    recoverAccount (id, nickName) {
      const that = this
      that.modalParam.content = '确认要恢复用户[' + nickName + ']吗？'
      that.modalParam.url = '/userBlock/adminUnblockUser'
      that.modalParam.params = {
        userId: id
      }
      that.modalParam.method = 'get'
    },
    muteAccount (id, nickName) {
      const that = this
      that.modalParam.content = '确认要禁言用户[' + nickName + ']吗？'
      that.modalParam.url = '/userBlock/adminMuteUser'
      that.modalParam.params = {
        userId: id
      }
      that.modalParam.method = 'get'
    },
    blockAccount (id, nickName) {
      const that = this
      that.modalParam.content = '确认要封禁用户[' + nickName + ']吗？'
      that.modalParam.url = '/userBlock/adminBlockUser'
      that.modalParam.params = {
        userId: id
      }
      that.modalParam.method = 'get'
    },
    sendModalRequest (e) {
      const that = this
      const promise = new Promise(function (resolve, reject) {
        request({
          url: that.modalParam.url,
          method: that.modalParam.method,
          params: that.modalParam.params
        }).then(res => {
          console.log(res)
          resolve(res)
        })
      })
      promise.then((res) => {
        that.modalParam.show = false
        that.doQuery() // 等上面执行完了再调用
        }
      )
    }
  }
}
</script>
