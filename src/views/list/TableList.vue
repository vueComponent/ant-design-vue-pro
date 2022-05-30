<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form :form="form" layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、身份证号、入组编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px" class="toggleAdvanced">
                {{ advanced ? '更多筛选' : '更多筛选' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(3)">全部病例</p>
                    <p @click="tableSearch(1)">本月新增病例</p>
                    <p @click="tableSearch(2)">本年新增病例</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="是否ICON">
                        <a-radio-group v-model="queryParam.isIcon">
                          <a-radio value="-1">否</a-radio>
                          <a-radio value="1">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                      <a-form-item label="入组编号">
                        <a-input v-model.trim="queryParam.fileCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px;" @click="refreshTable">查询</a-button>
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="small" :scroll="{ x: 1600 }" rowKey="tId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="name" slot-scope="text, record" @click="showUser(record)">
        <p class="userName">{{modifyName(text)}}</p>
      </span>
      <span slot="unSubmitquestion" slot-scope="text, record">
        <p>{{ record.unSubmitquestion }}</p>
      </span>
      <span slot="submitStatus" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="questionStatus" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="basisList" slot-scope="basisList" v-if="basisList.length">
        <div class="progressTag">
          <router-link :to="{path:'/list/basis/' + basisList[0].patientBasisId}">
            <p class="progressTagTitle">{{ basisList[0].typeName }}</p>
            <div style="margin-right: 15px;display: inline-block;width: 130px;">
              <div class="progressTagContent">
                <a-progress class="progressline" :strokeColor="basisList[0].progress == 100 ? '#4BC5AC' : '#00A0E9'" :showInfo="false" :percent="parseInt(basisList[0].progress)" size="small" />
              </div>
              <a-icon v-if="basisList[0].executeStatus != 3" type="clock-circle" theme="filled" style="color:#00A0E9" />
              <!-- <span class="ant-progress-span" v-if="basisList[0].executeStatus == 2">{{basisList[0].progress}}%</span> -->
              <a-icon v-else-if="basisList[0].executeStatus == 3" type="check-circle" theme="filled" style="color:#4BC5AC" />
            </div>
          </router-link>
          <Visit :patientId="basisList[0].patientId"></Visit>
        </div>
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record" style="text-align: center;">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleSubmit(record)" v-if="record.basisList[0].executeStatus == 3 && record.basisList[0].submitStatus == 0">提交</a>
          <span v-else style="color:rgba(0, 0, 0, 0.25)">提交</span>
          <a-divider type="vertical" />
          <a @click="handleOut(record)" :disabled="record.visit != 1">退组</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <user-detail ref="detailModal" />
    <a-modal :visible="visible" title="退组" @ok="outSubmit" :confirmLoading="confirmLoading" :centered="centered" :destroyOnClose="destroyOnClose" @cancel="handleClose">
      <a-form :form="form">
        <input type="hidden" v-model="patientId">
        <a-form-item label="退组原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', requiredRule]">
            <a-radio value="1">访视结束</a-radio>
            <a-radio value="2">失访</a-radio>
            <a-radio value="3">死亡</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="基线提交" :width="800" :bodyStyle="detailStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="detailVisible" :footer="null" @cancel="handleCancel">
      <div class="userDetail">
        <div class="userDetailTop">
          <img src="../../assets/woman.png" alt="" v-if="scoreData.sex == 0" />
          <img src="../../assets/man.png" alt="" v-else />
          <div class="name">{{scoreData.patientName}}</div>
          <div class="age">
            <span class="userDetailAge" :class="scoreData.sex == 0 ? 'womenBg' : ''">
              <a-icon :type="scoreData.sex == 1 ? 'man':'woman'" />
              {{scoreData.age}}岁
            </span>
          </div>
          <div class="tl">{{scoreData.isTl}}</div>
        </div>
      </div>
      <div class="scores">
        <p class="title">支扩评分</p>
        <a-row :gutter="10">
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix heighter">
              <div class="name">BSI评分</div>
              <div class="score">{{scoreData.BSI}}分</div>
              <mini-area />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix heighter">
              <div class="name">FACED评分</div>
              <div class="score">{{scoreData.FACED}}分</div>
              <mini-area />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix heighter">
              <div class="name">BACI评分</div>
              <div class="score">{{scoreData.BACI}}分</div>
              <mini-area />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix heighter">
              <div class="name">Reffi评分</div>
              <div class="score">{{scoreData.Reiff}}分</div>
              <mini-area />
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="scores">
        <p class="title">问卷评分</p>
        <a-row :gutter="10">
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">BHQ评分</div>
              <div class="score" style="color: mediumpurple">{{scoreData.BHQ.score}}分</div>
              <mini-progress color="mediumpurple" :target="scoreData.BHQ.score" :percentage="scoreData.BHQ.score" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">MMRC评分</div>
              <div class="score" style="color: #fd94dc">{{scoreData.MMRC.score}}分</div>
              <mini-progress color="#fd94dc" :target="scoreData.MMRC.score / 4 * 100" :percentage="scoreData.MMRC.score / 4 * 100" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">HAD评分</div>
              <div class="score" style="color: orange">{{scoreData.HAD.score}}分</div>
              <mini-progress color="orange" :target="scoreData.HAD.score / 42 * 100" :percentage="scoreData.HAD.score / 42 * 100" height="8px" />
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">LCQ评分</div>
              <div class="score" style="color: lightseagreen">总{{scoreData.LCQ.score}}分</div>
              <a-row :gutter="10">
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>生理</label>
                  <mini-progress color="lightseagreen" :target="scoreData.LCQ.score1 / 56 * 100" :percentage="scoreData.LCQ.score1 / 56 * 100" height="8px" />
                  <label>{{scoreData.LCQ.score1}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>心理</label>
                  <mini-progress color="lightseagreen" :target="scoreData.LCQ.score2 / 49 * 100" :percentage="scoreData.LCQ.score2 / 49 * 100" height="8px" />
                  <label>{{scoreData.LCQ.score2}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>社会</label>
                  <mini-progress color="lightseagreen" :target="scoreData.LCQ.score3 / 28 * 100" :percentage="scoreData.LCQ.score3/ 28 * 100" height="8px" />
                  <label>{{scoreData.LCQ.score3}}分</label>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">QoL-B评分</div>
              <a-row :gutter="10">
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>身体功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score1" :percentage="scoreData.QOLB.score1" height="8px" />
                  <label>{{scoreData.QOLB.score1}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>角色功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score2" :percentage="scoreData.QOLB.score2" height="8px" />
                  <label>{{scoreData.QOLB.score2}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>活力性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score3" :percentage="scoreData.QOLB.score3" height="8px" />
                  <label>{{scoreData.QOLB.score3}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>情绪功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score4" :percentage="scoreData.QOLB.score4" height="8px" />
                  <label>{{scoreData.QOLB.score4}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>社会功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score5" :percentage="scoreData.QOLB.score5" height="8px" />
                  <label>{{scoreData.QOLB.score5}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>医疗负担性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score6" :percentage="scoreData.QOLB.score6" height="8px" />
                  <label>{{scoreData.QOLB.score6}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>健康感觉性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score7" :percentage="scoreData.QOLB.score7" height="8px" />
                  <label>{{scoreData.QOLB.score7}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>呼吸症状性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score8" :percentage="scoreData.QOLB.score8" height="8px" />
                  <label>{{scoreData.QOLB.score8}}分</label>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <contact-form ref="contactModal" @ok="handleOk" />
  </a-card>
</template>
<script>
import moment from 'moment';
import {
  STable,
  Ellipsis
} from '@/components'
import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import UserDetail from './modules/UserDetail'
import Visit from './modules/Visit'
import { getPatientList } from '@/api/patient'
import { ChartCard, MiniProgress, MiniArea } from '@/components'
import { MyIcon } from '@/components/_util/util'
import ContactForm from '@/views/account/ContactForm'
import {
  addVasit,
  outGroup,
  getJxDataList,
  submitCheck
} from '@/api/basis'
import {
  mapGetters,
  mapActions
} from 'vuex'
import $ from 'jquery'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

const visitMap = {
  '已提交': {
    status: 'success',
    text: '已提交'
  },
  '未提交': {
    status: 'error',
    text: '未提交'
  }
};

var columns = [{
  title: '入组编号',
  width: 110,
  dataIndex: 'fileCode'
}, {
  title: '患者姓名',
  dataIndex: 'name',
  width: 80,
  scopedSlots: {
    customRender: 'name'
  }
},{
  title: '是否ICON',
  dataIndex: 'research',
  width: 80,
}, {
  title: '创建日期',
  dataIndex: 'createDate',
  width: 90,
  customRender: createDate => moment(createDate).format('YYYY-MM-DD')
}, {
  title: '提交状态',
  dataIndex: 'submitStatus',
  width: 80,
  scopedSlots: {
    customRender: 'submitStatus'
  }
}, {
  title: '访视进度',
  dataIndex: 'basisList',
  width: 160,
  scopedSlots: {
    customRender: 'basisList'
  }
}, {
  title: '分支中心',
  width: 200,
  dataIndex: 'centerName'
}, {
  title: '问卷状态',
  width: 80,
  dataIndex: 'questionStatus',
  scopedSlots: {
    customRender: 'questionStatus'
  }
}, {
  title: '未提交问卷',
  width: 200,
  dataIndex: ' unSubmitquestion',
  scopedSlots: {
    customRender: 'unSubmitquestion'
  }
}, {
  title: '操作',
  dataIndex: 'action',
  width: 120,
  className: 'operation',
  scopedSlots: {
    customRender: 'action'
  }
}]

var groupColumns = [{
  title: '入组编号',
  width: 110,
  dataIndex: 'fileCode'
}, {
  title: '创建日期',
  dataIndex: 'createDate',
  width: 90,
  customRender: createDate => moment(createDate).format('YYYY-MM-DD')
}, {
  title: '提交状态',
  dataIndex: 'submitStatus',
  width: 80,
  scopedSlots: {
    customRender: 'submitStatus'
  }
}, {
  title: '访视进度',
  dataIndex: 'basisList',
  width: 160,
  scopedSlots: {
    customRender: 'basisList'
  }
}, {
  title: '分支中心',
  dataIndex: 'centerName',
  width: 200
}, {
  title: '问卷状态',
  width: 80,
  dataIndex: 'questionStatus',
  scopedSlots: {
    customRender: 'questionStatus'
  }
}, {
  title: '未提交问卷',
  width: 200,
  dataIndex: ' unSubmitquestion',
  scopedSlots: {
    customRender: 'unSubmitquestion'
  }
}]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    UserDetail,
    Visit,
    MyIcon,
    ChartCard,
    MiniProgress,
    MiniArea,
    ContactForm
  },
  data() {
    return {
      patientBasisId: '',
      dateArr: [],
      mdl: {},
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      detailStyle: {
        height: '500px',
        overflow: 'auto',
        background: "#F8FBFC"
      },
      maskClosable: false,
      centered: true,
      destroyOnClose: true,
      scoreData: {
        isTl: '铜绿感染',
        age: 62,
        patientName: '宋国军',
        sex: 1,
        BACI: 0,
        BSI: 9,
        FACED: 4,
        Reiff: 12,
        HAD: {
          score: 22
        },
        LCQ: {
          score: 9.79,
          score1: 3.25,
          score2: 3.29,
          score3: 3.25
        },
        MMRC: {
          score: 3
        },
        BHQ: {
          score: 46.32649
        },
        QOLB: {
          score1: 26.67,
          score2: 26.67,
          score3: 26.67,
          score4: 16.67,
          score5: 26.67,
          score6: 26.67,
          score7: 8.33,
          score8: 25.39
        }
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: this.$ls.get(ACCESS_TOKEN).roleId === 1 ? groupColumns : columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPatientList(Object.assign(parameter, this.queryParam)).then(res => {
          res.data.forEach((item, index) => {
            if (item.basisList.length > 0) {
              item.basisList[0].progress = item.basisList[0].executeStatus == 3 ? 100 : item.basisList[0].progress
            }
            item.tId = index
          })
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = [];
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      scroll: false,
      optionAlertShow: false,
      form: this.$form.createForm(this),
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      patientId: null,
      confirmLoading: false,
      detailVisible: false
    }
  },
  created() {
    this.setSidebar(true)
    this.scroll = {
      y: (window.screen.height - 368) + "px"
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    var that = this
    $(document).on('click', function(e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if ($(e.target).closest(".tableSearch").length == 0 && $(e.target).closest(".ant-calendar").length == 0 && $(e.target).closest('.ant-calendar-year-panel-table').length === 0 && $(e.target).closest('.ant-calendar-month-panel-table').length === 0) {
        that.advanced = false
      }
    })
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text;
    },
    statusTypeFilter(type) {
      return statusMap[type].status;
    },
    visitFilter(type) {
      return visitMap[type].text;
    },
    visitTypeFilter(type) {
      return visitMap[type].status;
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    modifyName(name) {
      return name.replace(/(.)(.*)/, (_, $1, $2) => $1 + '*'.repeat($2.length))
    },
    clearForm() {
      console.log(this.dateArr)
      this.queryParam = {}
      this.dateArr = []
    },
    tableSearch(type) {
      this.queryParam.queryType = type
      this.$refs.table.refresh();
      this.advanced = false;
    },
    refreshTable() {
      this.advanced = false;
      this.$refs.table.refresh();
    },
    showUser(record) {
      this.$refs.detailModal.show(record);
    },
    handleEdit(record) {
      this.$router.push('/list/basis/' + record.basisList[0].patientBasisId)
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    changeTime(time) {
      this.dateArr = time;
      this.queryParam.createDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.createDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    exportData() {
      window.open(this.baseUrl + '/patient/export?doctorId=' + this.token.doctorId)
    },
    handleCancel() {
      this.detailVisible = false
    },
    handleClose() {
      this.visible = false
    },
    handleSubmit(record) {
      this.patientBasisId = record.basisList[0].patientBasisId
      this.$refs.contactModal.add()
    },
    handleOut(record) {
      this.visible = true
      this.patientId = record.patientId
    },
    outSubmit() {
      var that = this
      this.form.validateFieldsAndScroll((errors, fieldsValue) => {
        if (errors) {
          that.confirmLoading = false
          return
        }
        const params = new URLSearchParams()
        params.append('patientId', that.patientId)
        params.append('status', fieldsValue.status)
        outGroup(params).then(res => {
          that.visible = false
          that.confirmLoading = false
          that.$message.success(res.msg)
          that.$refs.table.refresh()
        });
      });
    },
    handleOk(v) {
      var that = this
      this.$confirm({
        title: '确认提交？',
        onOk() {
          var params = new URLSearchParams()
          params.append('patientBasisId', that.patientBasisId)
          params.append('submitName', v.submitName)
          params.append('submitTelephone', v.submitTelephone)
          submitCheck(params)
            .then(res => {
              if (res.code === -1) {
                that.$message.error(res.msg)
              } else {
                that.$message.success(res.msg)
                that.$refs.table.refresh()
                that.scoreData = res.data
                that.detailVisible = true
              }

            }).catch(error => {
              console.log(error)
            })
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}

/deep/th.operation {
  text-align: center !important;
}

/deep/.ant-table-tbody>tr>td.operation {
  text-align: center !important;
}

/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px
}

/deep/.ant-table-row:hover .progressTag .ant-progress-inner {
  background-color: #ffffff !important;
}

.progressTag {
  display: inline-block;
  width: 250px;

  /deep/ .progressTagContent {
    display: inline-block;
    width: 80px;
    margin-right: 5px;
  }

  /deep/ .progressTagTitle {
    font-size: 12px;
    text-align: center;
    color: #000;
    margin-bottom: 0;
    margin-right: 15px;
    display: inline-block;
  }

  /deep/ .progressTag .anticon {
    color: #4bc5ac;
    font-size: 18px;
    vertical-align: bottom;
  }

  /deep/ .ant-progress-inner {
    background-color: #e5f6ff;
  }

  /deep/ .progressTag .ant-progress-span {
    color: rgb(0, 160, 233);
  }
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item>.ant-form-item-label {
    width: 70px !important;
  }

  .commonRetrieval {
    padding: 10px;

    p {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}

.userName {
  color: #1fb2fa;
  margin: 0;

  &:active,
  &:hover {
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-color: #1fb2fa;
    cursor: pointer;
  }
}

.userDetail {
  border: 1px solid #f8f8f8;
  border-top: 4px solid #168ffd;
  padding: 15px 25px;
  background-color: #ffffff;

  .userDetailTop {
    overflow: hidden;

    img {
      display: inline-block;
      vertical-align: top;
      width: 60px;
      height: 60px;
      float: left;
    }

    .name {
      float: left;
      line-height: 60px;
      height: 60px;
      margin: 0 10px;
    }

    .age {
      float: left;
      margin-top: 20px;

      .userDetailAge {
        display: inline-block;
        background-color: #96dcfd;
        color: #ffffff;
        padding: 0px 10px;
        border-radius: 3px;

        .anticon {
          margin-right: 5px;
        }
      }
    }

    .tl {
      float: left;
      height: 21px;
      line-height: 21px;
      background: #ff4856;
      border-radius: 3px;
      padding: 0 10px;
      margin-top: 20px;
      margin-left: 10px;
      color: #fff;
    }
  }
}

.scores {
  margin-top: 10px;
  border-top: 2px solid #168ffd;
  background-color: #fff;
  padding: 10px;

  .title {
    color: #096dd9;
    margin-bottom: 10px;
  }

  .block {
    border: 1px solid #eee;
    padding: 10px;

    &.heighter {
      height: 100px;
    }

    .name {
      float: left;
    }

    .score {
      float: right;
      color: #096dd9;
      font-weight: bold;

      &.no {
        color: gray;
      }
    }

    .chart-mini-progress {
      clear: both;
    }

    .ant-row {
      clear: both;
      margin-top: 30px;

      .chart-mini-progress {
        clear: none;
        float: left;
        width: 56%;
        margin: 0 10px;
      }

      label {
        float: left;
        font-size: 12px;
      }
    }

    /deep/.antv-chart-mini .chart-wrapper {
      bottom: -100px !important;
    }
  }

}
</style>