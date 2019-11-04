<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          受访者:{{ patient.name }}
        </a-col>
        <a-col :md="6" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          {{ patient.card }}
        </a-col>
        <a-col :md="12" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19">
          <a-form :form="form" @submit="handleSubmit">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 2">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.血常规</div>
              <a-form-item label="血常规报告上传 :" :labelCol="labelColHor" :wrapperCol="wrapperHor" style="margin-top: 10px;">
                <div class="clearfix">
                  <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList1" @preview="handlePreview1" @change="handleChange1">
                    <div v-if="fileList1.length < 4">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
                    <img alt="example" style="width: 100%" :src="previewImage1" />
                  </a-modal>
                </div>
              </a-form-item>
              <a-form-item label="(1) 血红蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b1', { initialValue: initValue('b1')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(2) 白细胞:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b2', { initialValue: initValue('b2')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(3) 红细胞:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b3', { initialValue: initValue('b3')}]" addonAfter="10^12/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(4) 血小板:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b4', { initialValue: initValue('b4')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 中性粒细胞绝对值:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b5', { initialValue: initValue('b5')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 嗜酸细胞绝对值:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['b6', { initialValue: initValue('b6')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
              </a-form-item>
              <div class="title">2.血生化</div>
              <a-form-item label="血生化报告上传 :" :labelCol="labelColHor" :wrapperCol="wrapperHor" style="margin-top: 10px;">
                <div class="clearfix">
                  <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList2" @preview="handlePreview2" @change="handleChange2">
                    <div v-if="fileList2.length < 4">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisible2" :footer="null" @cancel="handleCancel2">
                    <img alt="example" style="width: 100%" :src="previewImage2" />
                  </a-modal>
                </div>
              </a-form-item>
              <a-form-item label="(1) 血糖:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c1', { initialValue: initValue('c1')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(2) 谷丙转氨酶:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c2', { initialValue: initValue('c2')}]" addonAfter="IU/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(3) 谷草转氨酶:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c3', { initialValue: initValue('c3')}]" addonAfter="IU/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(4) 白蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c4', { initialValue: initValue('c4')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 前白蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c5', { initialValue: initValue('c5')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 球蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c6', { initialValue: initValue('c6')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(7) 肌酐:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c7', { initialValue: initValue('c7')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(8) 尿素:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c8', { initialValue: initValue('c8')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(9) 钾:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c9', { initialValue: initValue('c9')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(10) 钠:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c10', { initialValue: initValue('c10')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(11) 钙:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c11', { initialValue: initValue('c11')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(12) 磷:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c12', { initialValue: initValue('c12')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(13) 总胆固醇:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c13', { initialValue: initValue('c13')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(14) 甘油三脂:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c14', { initialValue: initValue('c14')}]" addonAfter="mmol/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(15) 高密度脂蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c15', { initialValue: initValue('c15')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(16) 低密度脂蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['c16', { initialValue: initValue('c16')}]" addonAfter="g/L" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(17) DD二聚体:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
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
              <a-form-item label="(18) 维生素D:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
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
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask10',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      previewVisible1: false,
      previewImage1: '',
      previewVisible2: false,
      previewImage2: '',
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList1: [],
      fileList2: [],
      markName: 'qtsyjc',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [10],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '486px',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        height: '444px',
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 7 }
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
        sm: { span: 17 },
        md: { span: 17 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 4, offset: 7 }
      },
      wrapperOffset: {
        md: { span: 13 }
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
      maskId: this.$route.meta.maskId,
      patientBasisId: this.$route.params.id,
      qtsyjc: undefined,
      spinning: false,
      executeStatus: false
    }
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
      })
    this.getFormData()
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {},
    handleClick(e) {
      this.maskId = e.key
      // this.getElementsAnswer()
      this.$router.push('/list/basis/' + this.patientBasisId + '/' + this.maskId)
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          var that = this
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.qtsyjc && this.qtsyjc.qtsyjcId) {
            re.qtsyjcId = this.qtsyjc.qtsyjcId
          }
          //附件
          if (this.fileList1 && this.fileList1.length) {
            var a = []
            _.each(this.fileList1, function(v) {
              if (v.response) a.push(v.response.fileName)
              else a.push(v.name)
            })
            params.append('fileName', JSON.stringify(a))
          }
          //附件
          if (this.fileList2 && this.fileList2.length) {
            var a = []
            _.each(this.fileList2, function(v) {
              if (v.response) a.push(v.response.fileName)
              else a.push(v.name)
            })
            params.append('fileNameOther', JSON.stringify(a))
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          this.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.spinning = false
              that.getFormData()
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    initValue(key, type = 'normal') {
      if (!this.qtsyjc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.qtsyjc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.qtsyjc[key])
      } else if (type === 'array') {
        return this.qtsyjc[key].split(',')
      } else {
        return this.qtsyjc[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {

      }
      return answer
    },
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.qtsyjc) {
            that.qtsyjc = that.dealAnswers(res.data.qtsyjc)
          }
          if (res.data.annexListXcg && res.data.annexListXcg.length) {
            that.fileList1 = _.map(res.data.annexListXcg, function(v) {
              return {
                uid: v.annexId,
                url: that.viewPicUrl + v.annexAddress,
                name: v.annexAddress,
                status: 'done'
              }
            })
          }
          if (res.data.annexListXsh && res.data.annexListXsh.length) {
            that.fileList2 = _.map(res.data.annexListXsh, function(v) {
              return {
                uid: v.annexId,
                url: that.viewPicUrl + v.annexAddress,
                name: v.annexAddress,
                status: 'done'
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.qtsyjc && this.qtsyjc.qtsyjcId) {
        re.qtsyjcId = this.qtsyjc.qtsyjcId
      }
      //附件
      if (this.fileList1 && this.fileList1.length) {
        var a = []
        _.each(this.fileList1, function(v) {
          if (v.response) a.push(v.response.fileName)
          else a.push(v.name)
        })
        params.append('fileName', JSON.stringify(a))
      }
      //附件
      if (this.fileList2 && this.fileList2.length) {
        var a = []
        _.each(this.fileList2, function(v) {
          if (v.response) a.push(v.response.fileName)
          else a.push(v.name)
        })
        params.append('fileNameOther', JSON.stringify(a))
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      this.spinning = true
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.spinning = false
          that.getFormData()
          that.$message.success(res.msg)
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    handleCancel1() {
      this.previewVisible1 = false;
    },
    handlePreview1(file) {
      this.previewImage1 = file.url || file.thumbUrl;
      this.previewVisible1 = true;
    },
    handleChange1({ fileList }) {
      this.fileList1 = fileList;
    },
    handleCancel2() {
      this.previewVisible2 = false;
    },
    handlePreview2(file) {
      this.previewImage2 = file.url || file.thumbUrl;
      this.previewVisible2 = true;
    },
    handleChange2({ fileList }) {
      this.fileList2 = fileList;
    }
  }
}
</script>
<style lang="less" scoped>
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
}

.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 0;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../../../assets/treeTop.png);
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

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open {
    background-color: rgba(245, 251, 255);

    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245, 251, 255);

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

    padding: 20px;

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

.question-title {
  text-align: center;
  font-size: 22px;
  color: #3398DC;
}

.question-des {
  font-size: 16px;
  // border: 1px solid #91D5FF ;
  // border-radius: 3px;
  // background: lightblue;
  padding: 0 10px;
}

.question-t {
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
}

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}
</style>