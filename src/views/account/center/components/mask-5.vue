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
    <a-card :bordered="false" class="card-box">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19">
          <a-form :form="form" @submit="handleSubmit">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 2">
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.CT基本信息</div>
              <a-form-item label="(1) CT检查日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a1', {...dateRequire, initialValue: initValue('a1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item label="(2) 图像类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]">
                  <a-radio value="1">HRCT</a-radio>
                  <a-radio value="2">CT</a-radio>
                </a-radio-group>
              </a-form-item>
              <div class="clearfix" style="margin-top: 10px;">
                <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList" @preview="handlePreview" @change="handleChange">
                  <div v-if="fileList.length < 4">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
              <div class="title">2.支扩位于CT图像上</div>
              <a-form-item label="(1) 右上叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a3', {...require1, initialValue: initValue('a3')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(2) 左上叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a4', {...require1, initialValue: initValue('a4')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(3) 右中叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a5', {...require1, initialValue: initValue('a5')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 左舌叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a6', {...require1, initialValue: initValue('a6')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(5) 右下叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a7', {...require1, initialValue: initValue('a7')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(6) 左下叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a8', {...require1, initialValue: initValue('a8')}]" @change="computeReiff">
                  <a-radio value="1">无支扩</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                  <a-radio value="4">囊状</a-radio>
                  <a-radio value="5">严重度不明</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(7) 影像Reiff评分:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a9', {initialValue: initValue('a9')}]" :readOnly="true" autocomplete="off"></a-input>
              </a-form-item>
              <div class="title">3.Bhalla影像学评分</div>
              <a-form-item label="(1) 支气管扩张程度：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a10', {initialValue: initValue('a10')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">轻度（管腔直径为临近血管直径的1-2倍）</a-radio>
                  <a-radio value="3">中度（管腔直径为临近血管直径的2-3倍）</a-radio>
                  <a-radio value="4">重度（管腔直径超过临近血管直径的3倍）</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(2) 支气管壁增厚情况" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a11', {initialValue: initValue('a11')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">轻度（支气管壁的厚度相当于临近血管壁厚度）</a-radio>
                  <a-radio value="3">中度（支气管壁的厚度相当于临近血管壁厚度的1-2倍）</a-radio>
                  <a-radio value="4">重度（支气管壁的厚度相当于临近血管壁厚度的2倍）</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(3) 支气管扩张的范围（肺段数）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a12', { initialValue: initValue('a12')}]" @change="computeBhalla" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(4) 支气管管腔黏液阻塞的范围（肺段数）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a13', { initialValue: initValue('a13')}]" @change="computeBhalla" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 存在脓肿的范围（肺段数）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a14', { initialValue: initValue('a14')}]" @change="computeBhalla" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 扩张支气管的分级数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a15', {initialValue: initValue('a15')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">超过4级</a-radio>
                  <a-radio value="3">超过5级</a-radio>
                  <a-radio value="4">超过6级</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(7) 肺大疱数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a16', { initialValue: initValue('a16')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">单侧(&lt;4)</a-radio>
                  <a-radio value="3">双侧(&lt;4)</a-radio>
                  <a-radio value="4">&gt;4</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(8) 肺气肿的范围" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a17', { initialValue: initValue('a17')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">1-5</a-radio>
                  <a-radio value="4">&gt;5</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(9) 肺不张/实变的" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a18', { initialValue: initValue('a18')}]" @change="computeBhalla">
                  <a-radio value="1">无</a-radio>
                  <a-radio value="2">肺亚段</a-radio>
                  <a-radio value="3">肺段/肺叶</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(10) 支扩类型" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a20', {initialValue: initValue('a20')}]" @change="computeBhalla">
                  <a-radio value="1">囊状</a-radio>
                  <a-radio value="2">柱状</a-radio>
                  <a-radio value="3">静脉曲张型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(11) Bhalla影像学评分:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a19', {initialValue: initValue('a19')}]" :readOnly="true" autocomplete="off"></a-input>
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
import { getPatientBasis, saveBasis, getBasisForm, computeScore } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask5',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      spinning: false,
      previewVisible: false,
      previewImage: '',
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList: [],
      markName: 'xbyxx',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [5],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        // height: '486px',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
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
      maskId: this.$route.meta.maskId,
      patientBasisId: this.$route.params.id,
      xbyxx: undefined,
      executeStatus: undefined
    }
  },
  created() {
    var that = this
    this.defaultSelectedKeys = [5]
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
    changeRadio(e, t) {
      if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      if (e.key >= 31 && e.key <= 36) {
        this.$router.push('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else {
        this.$router.push('/list/basis/' + this.patientBasisId + '/' + e.key)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      var that = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          re = {
            ...re,
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : ''
          }
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.xbyxx && this.xbyxx.xbyxxId) {
            re.xbyxxId = this.xbyxx.xbyxxId
          }
          //附件
          if (this.fileList && this.fileList.length) {
            var a = []
            _.each(this.fileList, function(v) {
              if (v.response) a.push(v.response.fileName)
              else a.push(v.name)
            })
            // var fileName = _.map(this.fileList, function(v) { return v.response ? v.response.fileName : v.name })
            params.append('fileName', JSON.stringify(a))
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          that.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.spinning = false
              that.getFormData()
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('patientBasisId', this.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.xbyxx) {
            that.xbyxx = that.dealAnswers(res.data.xbyxx)
            that.fileList = _.map(res.data.annexListXbyxx, function(v) {
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
      re = {
        ...re,
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : ''
      }
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.xbyxx && this.xbyxx.xbyxxId) {
        re.xbyxxId = this.xbyxx.xbyxxId
      }
      //附件
      if (this.fileList && this.fileList.length) {
        var a = []
        _.each(this.fileList, function(v) {
          if (v.response) a.push(v.response.fileName)
          else a.push(v.name)
        })
        // var fileName = _.map(this.fileList, function(v) { return v.response ? v.response.fileName : v.name })
        params.append('fileName', JSON.stringify(a))
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      that.spinning = true
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
    initValue(key, type = 'normal') {
      if (!this.xbyxx) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.xbyxx[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.xbyxx[key])
      } else if (type === 'array') {
        return this.xbyxx[key].split(',')
      } else {
        return this.xbyxx[key] + ''
      }
    },
    dealAnswers(answer) {
      return answer
    },
    computeReiff() {
      var that = this
      this.$nextTick(() => {
        var params = new URLSearchParams()
        params.append('scoreType', 'reiff')
        params.append('xbyxxStr', JSON.stringify(that.form.getFieldsValue()))
        computeScore(params)
          .then(res => {
            console.log(res.data.a9)
            that.form.setFieldsValue({
              a9: res.data.a9
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    computeBhalla() {
      var that = this
      this.$nextTick(() => {
        var params = new URLSearchParams()
        params.append('scoreType', 'bhalla')
        params.append('xbyxxStr', JSON.stringify(that.form.getFieldsValue()))
        computeScore(params)
          .then(res => {
            console.log(res.data.a9)
            that.form.setFieldsValue({
              a19: res.data.a19
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    }
  }
}
</script>
<style lang="less" scoped>
#baselineInfo{
  height:100%;
}
/deep/ .card-box{
  margin-top: 10px;
  padding-left: 0;
  // height: calc(100% - 64px);
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