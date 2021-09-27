<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="4" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          <!-- 受访者:{{ $route.params.name }} -->
          受访者:{{ patient.name }}
        </a-col>
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          <!-- 身份证:{{ $route.params.card }} -->
          身份证:{{ patient.card }}
        </a-col>
        <a-col :md="11" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patient.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" class="card-box">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <!-- 血生化 -->
          <a-form :form="form" @submit="handleSubmit" style="height:100%;overflow:hidden auto;-ms-overflow-x: hidden;">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 1">
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>

            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">血生化</div>
              <a-form-item label="报告上传 :" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <div class="clearfix" style="margin-top: 10px;">
                  <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList" @preview="handlePreview" @change="handleChange">
                    <div v-if="fileList.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </div>
              </a-form-item>
              <a-form-item label="血糖:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c1', { initialValue: initValue('c1')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="谷丙转氨酶:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c2', { initialValue: initValue('c2')}]" addonAfter="IU/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="谷草转氨酶:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c3', { initialValue: initValue('c3')}]" addonAfter="IU/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="白蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c4', { initialValue: initValue('c4')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="前白蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c5', { initialValue: initValue('c5')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="球蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c6', { initialValue: initValue('c6')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="肌酐:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c7', { initialValue: initValue('c7')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="尿素:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c8', { initialValue: initValue('c8')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="钾:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c9', { initialValue: initValue('c9')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="钠:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c10', { initialValue: initValue('c10')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="钙:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c11', { initialValue: initValue('c11')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="磷:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c12', { initialValue: initValue('c12')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="总胆固醇:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c13', { initialValue: initValue('c13')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="甘油三脂:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c14', { initialValue: initValue('c14')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="高密度脂蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c15', { initialValue: initValue('c15')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="低密度脂蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c16', { initialValue: initValue('c16')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="DD二聚体:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['c17', { initialValue: initValue('c17')}]" addonAfter="ng/ml" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="DD二聚体:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['c171', { initialValue: initValue('c171')}]">
                  <a-radio value="1">正常</a-radio>
                  <a-radio value="2">降低</a-radio>
                  <a-radio value="3">升高</a-radio>
                  <a-radio value="4">未测量</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="维生素D:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['c18', { initialValue: initValue('c18')}]" addonAfter="nmol/l" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="维生素D:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['c181', { initialValue: initValue('c181')}]">
                  <a-radio value="1">正常</a-radio>
                  <a-radio value="2">降低</a-radio>
                  <a-radio value="3">升高</a-radio>
                  <a-radio value="4">未测量</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="spinning"></a-spin>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree2'
import { mapActions } from 'vuex'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import { MyIcon } from '@/components/_util/util'
import { getReportTypeMark, saveReport, getReportFormData } from '@/api/report'

export default {
  name: 'Exec52',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList: [],
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      title: '报告采集',
      baselineFormStyle: {
        // height: '444px',
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 }
      },
      wrapper18: {
        md: { span: 18 }
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      dateRequire: {
        rules: [{ type: 'object', required: true, message: '请选择时间！' }]
      },
      require1: {
        rules: [{ required: true, message: '请选择是或否！' }]
      },
      require2: {
        rules: [{ required: true, message: '请选择有或无！' }]
      },
      selectRequired: {
        rules: [{ required: true, message: '请选择！' }]
      },
      inputRequired: {
        rules: [{ required: true, message: '请填写！' }]
      },
      form: this.$form.createForm(this),
      openKeys: [],
      defaultSelectedKeys: [52],
      orgTree: [],
      patient: {},
      patientBasis: {},
      reportCollectBaseId: parseInt(this.$route.params.id),
      controla21: false,
      controla31: false,
      controla41: false,
      controla51: false,
      controla61: false,
      formData: undefined,
      businessType: 7,
      reportTypeId: 52,
      reportCollectDetailId: undefined,
      spinning: false,
      executeStatus: false
    }
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('reportCollectBaseId', this.reportCollectBaseId)
    getReportTypeMark(params)
      .then(res => {
        that.orgTree = res.data.rcdList
        that.reportCollectDetailId = _.find(res.data.rcdList, function(v) { return v.reportTypeId === 52 }).reportCollectDetailId
        that.executeStatus = _.find(res.data.rcdList, function(v) { return v.reportTypeId === 52 }).collectDetailStatus
        that.patient = res.data.patient
        that.getFormData()
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeRadio(e, t) {
      if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('reportCollectDetailId', this.reportCollectDetailId)
      params.append('reportTypeId', this.reportTypeId)
      params.append('businessType', this.businessType)
      getReportFormData(params)
        .then(res => {
          that.formData = that.dealAnswers(res.data.bgXsh)
          that.fileList = _.map(res.data.annexList, function(v) {
            return {
              uid: v.annexId,
              url: that.viewPicUrl + v.annexAddress,
              name: v.annexAddress,
              status: 'done'
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    initValue(key, type = 'normal') {
      if (!this.formData) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.formData[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.formData[key])
      } else if (type === 'array') {
        return this.formData[key].split(',')
      } else {
        return this.formData[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {

      }
      return answer
    },
    handleClick(e) {
      if (e.key !== this.reportCollectBaseId) {
        this.$router.replace('/gallery/execute/' + this.reportCollectBaseId + '/' + e.key)
      }
    },
    save() {
      if (!this.fileList.length) {
        this.$message.warning('请上传检查报告')
        return false
      }
      var re = this.form.getFieldsValue()
      var that = this
      var params = new URLSearchParams()
      if (this.formData && this.formData.xshId) {
        re.xshId = this.formData.xshId
      }
      params.append('formData', JSON.stringify(re))
      params.append('reportCollectBase', JSON.stringify({ reportCollectBaseId: this.reportCollectBaseId }))
      params.append('reportCollectDetail', JSON.stringify({ reportCollectDetailId: this.reportCollectDetailId, reportTypeId: this.reportTypeId, status: 1 }))
      params.append('businessType', this.businessType)
      var a = []
      _.each(this.fileList, function(v) {
        if (v.response) a.push(v.response.fileName)
        else a.push(v.name)
      })
      params.append('fileName', JSON.stringify(a))
      this.spinning = true
      saveReport(params)
        .then(res => {
          that.spinning = false
          that.getFormData()
          that.$message.success(res.msg)
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (!this.fileList.length) {
            this.$message.warning('请上传检查报告')
            return false
          }
          var re = this.form.getFieldsValue()
          var that = this
          var params = new URLSearchParams()
          if (this.formData && this.formData.xshId) {
            re.xshId = this.formData.xshId
          }
          params.append('formData', JSON.stringify(re))
          params.append('reportCollectBase', JSON.stringify({ reportCollectBaseId: this.reportCollectBaseId }))
          params.append('reportCollectDetail', JSON.stringify({ reportCollectDetailId: this.reportCollectDetailId, reportTypeId: this.reportTypeId, status: 2 }))
          params.append('businessType', this.businessType)
          var a = []
          _.each(this.fileList, function(v) {
            if (v.response) a.push(v.response.fileName)
            else a.push(v.name)
          })
          params.append('fileName', JSON.stringify(a))
          this.spinning = true
          saveReport(params)
            .then(res => {
              that.spinning = false
              that.getFormData()
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('reportCollectBaseId', this.reportCollectBaseId)
              getReportTypeMark(params)
                .then(res => {
                  that.orgTree = res.data.rcdList
                  that.reportCollectDetailId = _.find(res.data.rcdList, function(v) { return v.reportTypeId === 52 }).reportCollectDetailId
                  that.executeStatus = _.find(res.data.rcdList, function(v) { return v.reportTypeId === 52 }).collectDetailStatus
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(error => {
              that.spinning = false
              console.log(error)
            })
        } else {
          this.spinning = false
        }
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      var that = this
      this.fileList = fileList;
      if (fileList.every(function(v) { return v.status === 'done'})) {
        this.spinning = false
        this.fileList.forEach((f,i) => {
          if(f.response){
              that.$set(that.fileList,i,{
                name: f.name,
                status: 'done',
                uid: f.uid,
                url: f.response.data.src
              })
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
#baselineInfo{
  height:calc(100% - 10px);
}
/deep/ .card-box{
  margin-top: 10px;
  padding-left: 0;
  height: calc(100% - 54px);
}
/deep/ .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .2);

  & .ant-spin-dot {
    position: absolute;
    top: 55%;
    left: 50%;
  }
}

/deep/ #baselineHeader {
  .ant-card-body {
    padding: 10px
  }
}

.ant-row.ant-form-item:hover {
  background-color: #e6f7ff;
}

.ml-10 {
  margin-left: 10px;
}

.UserNameCard {
  font-size: 20px;

  .anticon {
    font-size: 26px;
    vertical-align: text-bottom;
    position: relative;
    left: -5px;
  }
}

.clear {
  clear: both;
}

.ant-calendar-picker {
  width: 240px;
}

.ant-checkbox-wrapper+.ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #1890FF;
  color: #FFF;

  .anticon.anticon-clock-circle,
  .anticon.anticon-check-circle {
    color: #FFF;
  }
}

/deep/ .anticon.anticon-clock-circle,
/deep/ .anticon.anticon-check-circle {
  font-size: 18px;
}

/deep/ .ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  background-color: #e6f7ff;
}

/deep/.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  border-right: 6px solid #1890ff;
}

/deep/ .ant-row {
  clear: both;
  height: 100%;
}

.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 0;
    height: 100%;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    background-position: 8px 10px;
  }

  /deep/ .ant-menu-inline>.ant-menu-submenu>.ant-menu-submenu-title,
  .ant-menu .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;
  }

  /deep/ .ant-menu-submenu-title {
    height: 50px;
    line-height: 50px;
  }

  /deep/ .anticon.anticon-clock-circle {
    color: #00A0E9;
  }

  /deep/ .anticon.anticon-clock-circle {
    color: #8ac51b;
  }

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    background-color: rgba(245, 251, 255);

    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245, 251, 255);
      padding-left: 20px;
      .treeSubTitle{
        font-size: 14px;
      }
      li {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
      }
    }
  }

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    .ant-menu.ant-menu-inline.ant-menu-sub {
      li {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
      }
    }
  }

  /deep/ .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;

    .placeholderI {
      display: inline-block;
      width: 27px;
    }

    .anticon.anticon-check-circle {
      font-size: 18px;
      color: #8ac51b;
    }

    .anticon.anticon-clock-circle {
      font-size: 18px;
      color: #06a0e2;
    }

    .treeSubTitle {
      font-size: 16px;
      margin-left: 10px;
      display: inline-block;
      width: 140px;
    }

    .treeSubPercentage {
      font-size: 16px;
      margin-left: 10px;
    }
  }

  /deep/ .ant-menu-submenu {
    .anticon-check-circle {
      color: #8ac51b;
    }

    .anticon-clock-circle {
      color: #06a0e2;
    }
    &.ant-menu-submenu-inline {
      .treeSubTitle {
        font-size: 16px;
        margin-left: 10px;
        display: inline-block;
        width: 140px;
      }

      .treeSubPercentage {
        font-size: 16px;
        margin-left: 10px;
      }

      .action {
        font-size: 18px;

        &.anticon-check-circle {
          color: #8ac51b;
        }

        &.anticon-clock-circle {
          color: #06a0e2;
        }
      }

      .placeholderI {
        display: inline-block;
        width: 27px;
      }
    }
  }

  .fr {
    float: right;
  }

  .btn {
    margin-right: 10px;
  }

  .baselineForm {

    overflow: auto;

    .title {
      background-color: #f7f8f8;
      font-weight: bold;
      font-size: 16px;
      color: #231815;
      padding-left: 15px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      height: 40px;
      line-height: 40px;
    }

    padding: 40px 20px;

    .ant-form-item {
      // padding-bottom: 10px;
      // padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;

      &.no-border {
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }

      &:hover {}

      &.border-dotted {
        border-bottom: 1px dotted #eee;
      }
    }

    /deep/ .ant-form-item-label {
      text-align: left;
      line-height: 56px;
      white-space: inherit;

      label:after {
        content: '';
      }

      &.ant-col-md-24 label {
        display: block;
        background-color: #f7f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
        padding-left: 15px;
        border-top: 1px solid #eee;
      }
    }

    /deep/ .ant-form-item-control-wrapper .ant-form-item-control {
      line-height: 56px;
    }

    .formSubtitle {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 16px;
      padding-left: 10px;
      margin-bottom: 0px;
      background: #fafcfd;
      border-bottom: 1px solid #f3f3f3;
    }

    .itemRow:hover {
      background-color: #e6f7ff;
    }
  }
}

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}
</style>