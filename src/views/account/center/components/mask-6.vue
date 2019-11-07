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
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          身份证:{{ patient.card }}
        </a-col>
        <a-col :md="11" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" class="card-box">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" style="height:100%;overflow:scroll;">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 2">
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.稳定期</div>
              <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a1', {...dateRequire, initialValue: initValue('a1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]" @change="changeRadio($event, 'controla2')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controla2">
                <a-input style="width: 240px;" v-decorator="['a21', {...inputRequired, initialValue: initValue('a21')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(3) 标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a3', {...require1, initialValue: initValue('a3')}]">
                  <a-radio value="1">痰液</a-radio>
                  <a-radio value="2">诱导痰</a-radio>
                  <a-radio value="3">支气管肺泡灌洗液</a-radio>
                  <a-radio value="4">咽拭子</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(2) 是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a4', {...require1, initialValue: initValue('a4')}]" @change="changeRadio($event, 'controla4')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="分离方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controla4">
                <a-radio-group v-decorator="['a41', {...selectRequired, initialValue: initValue('a41')}]">
                  <a-radio value="1">纸片法</a-radio>
                  <a-radio value="2">肉汤稀释法</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controla4">
                <a-checkbox-group v-decorator="['a42', {...selectRequired, initialValue: initValue('a42', 'array')}]">
                  <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla420', true)">铜绿假单胞菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[0]" v-if="controla420"></add-table>
                  <a-checkbox value="1" @change="showList($event, '阴沟肠杆菌', 'controla421', true)">阴沟肠杆菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[1]" v-if="controla421"></add-table>
                  <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla422', true)">肺炎克雷伯菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[2]" v-if="controla422"></add-table>
                  <a-checkbox value="3" @change="showList($event, '肺炎链球菌', 'controla423', true)">肺炎链球菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[3]" v-if="controla423"></add-table>
                  <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla424', true)">副流感嗜血杆菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[4]" v-if="controla424"></add-table>
                  <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla425', true)">鲍曼不动杆菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[5]" v-if="controla425"></add-table>
                  <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla426', true)">金黄色葡萄球菌</a-checkbox>
                  <add-table :dataSource="optionDataSource[6]" v-if="controla426"></add-table>
                  <a-checkbox value="7" @change="showList($event, '其他', 'controla427', true)">其他</a-checkbox>
                  <a-input style="width: 240px;margin-right: 10px;" v-if="controla427" @change="otherChange($event, 7, true)" autocomplete="off"></a-input>
                  <add-table :dataSource="optionDataSource[7]" v-if="controla427"></add-table>
                </a-checkbox-group>
              </a-form-item>
              <div class="title">2.急性加重期</div>
              <a-form-item label="(2) 急性加重期:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b', {...require1, initialValue: initValue('b')}]" @change="changeRadio($event, 'controlb')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb">
                <a-form-item label="取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b1', {...dateRequire, initialValue: initValue('b1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['b2', {...require1, initialValue: initValue('b2')}]" @change="changeRadio($event, 'controlb2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb2">
                  <a-input style="width: 240px;" v-decorator="['b21', {...inputRequired, initialValue: initValue('b21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b3', {...require1, initialValue: initValue('b3')}]">
                    <a-radio value="1">痰液</a-radio>
                    <a-radio value="2">诱导痰</a-radio>
                    <a-radio value="3">支气管肺泡灌洗液</a-radio>
                    <a-radio value="4">咽拭子</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b4', {...require1, initialValue: initValue('b4')}]" @change="changeRadio($event, 'controlb4')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分离方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb4">
                  <a-radio-group v-decorator="['b41', {...selectRequired, initialValue: initValue('b41')}]">
                    <a-radio value="1">纸片法</a-radio>
                    <a-radio value="2">肉汤稀释法</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb4">
                  <a-checkbox-group v-decorator="['b42', {...selectRequired, initialValue: initValue('b42', 'array')}]">
                    <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controlb420')">铜绿假单胞菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[0]" v-if="controla420"></add-table>
                    <a-checkbox value="1" @change="showList($event, '阴沟肠杆菌', 'controlb421')">阴沟肠杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[1]" v-if="controla421"></add-table>
                    <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controlb422')">肺炎克雷伯菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[2]" v-if="controla422"></add-table>
                    <a-checkbox value="3" @change="showList($event, '肺炎链球菌', 'controlb423')">肺炎链球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[3]" v-if="controla423"></add-table>
                    <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controlb424')">副流感嗜血杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[4]" v-if="controla424"></add-table>
                    <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controlb425')">鲍曼不动杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[5]" v-if="controla425"></add-table>
                    <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controlb426')">金黄色葡萄球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource2[6]" v-if="controla426"></add-table>
                    <a-checkbox value="7" @change="showList($event, '其他', 'controlb427')">其他</a-checkbox>
                    <a-input style="width: 240px;margin-right: 10px;" v-if="controlb427" @change="otherChange($event, 7)" autocomplete="off"></a-input>
                    <add-table :dataSource="optionDataSource2[7]" v-if="controlb427"></add-table>
                  </a-checkbox-group>
                </a-form-item>
              </div>
              <div class="title">3.分支杆菌标本</div>
              <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['c1', {...dateRequire, initialValue: initValue('c1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['c2', {...require1, initialValue: initValue('c2')}]" @change="changeRadio($event, 'controlc2')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlc2">
                <a-input style="width: 240px;" v-decorator="['c21', {...inputRequired, initialValue: initValue('c21')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(3) 标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['c3', {...require1, initialValue: initValue('c3')}]">
                  <a-radio value="1">痰液</a-radio>
                  <a-radio value="2">诱导痰</a-radio>
                  <a-radio value="3">支气管肺泡灌洗液</a-radio>
                  <a-radio value="4">咽拭子</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['c4', {...require1, initialValue: initValue('c4')}]" @change="changeRadio($event, 'controlc4')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlc4">
                <a-form-item label="分离方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c41', {...selectRequired, initialValue: initValue('c41')}]">
                    <a-radio value="1">纸片法</a-radio>
                    <a-radio value="2">肉汤稀释法</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['c42', {...selectRequired, initialValue: initValue('c42', 'array')}]">
                    <a-checkbox value="0">结核分枝杆菌</a-checkbox>
                    <a-checkbox value="1">非结核分支杆菌</a-checkbox>
                    <a-checkbox value="2">堪萨斯分枝杆菌</a-checkbox>
                    <a-checkbox value="3">龟分枝杆菌</a-checkbox>
                    <a-checkbox value="4">脓肿分支杆菌</a-checkbox>
                    <a-checkbox value="5">鸟分枝杆菌复合群(MAC)</a-checkbox>
                    <a-checkbox value="6" @change="changeSelect($event, 'controlc426')">其他</a-checkbox>
                    <a-input style="width: 240px;margin-right: 10px;" v-if="controlc426" autocomplete="off"></a-input>
                  </a-checkbox-group>
                </a-form-item>
              </div>
              <a-form-item label="(5) 患者是否曾分离培养到铜绿假单细胞:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['c5', {...require1, initialValue: initValue('c5')}]" @change="changeRadio($event, 'controlc5')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlc5">
                <a-form-item label="最近一次分离到铜绿假单胞菌是什么时候:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['c51', {...dateRequire, initialValue: initValue('c51', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['c52', {...require1, initialValue: initValue('c52')}]">
                    <a-radio value="1">黏液型</a-radio>
                    <a-radio value="2">非黏液型</a-radio>
                    <a-radio value="3">不详</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
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
import { getPatientBasis, saveBasis, getBasisForm, computeScore, getMedicineAllergyList } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import AddTable from "../model/table"
import _ from 'lodash'
export default {
  name: 'mask6',
  components: {
    STree,
    MyIcon,
    AddTable
  },
  data() {
    return {
      optionDataSource: [],
      optionDataSource2: [],
      markName: 'bywsw',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [6],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '100%',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        // height: '444px',
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
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
        sm: { span: 18 },
        md: { span: 17 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 6, offset: 6 }
      },
      wrapperOffset: {
        md: { span: 12 }
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
      bywsw: undefined,
      controla2: false,
      controla4: false,
      controlb: false,
      controlb2: false,
      controlb4: false,
      controlc2: false,
      controlc4: false,
      controlc5: false,
      controla420: false,
      controla421: false,
      controla422: false,
      controla423: false,
      controla424: false,
      controla425: false,
      controla426: false,
      controla427: false,
      controlb420: false,
      controlb421: false,
      controlb422: false,
      controlb423: false,
      controlb424: false,
      controlb425: false,
      controlb426: false,
      controlb427: false,
      controlc426: false,
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
        that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
      })
    this.getFormData()
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.bywsw)
            that.bywsw = that.dealAnswers(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controla2' || t === 'controlb2' || t === 'controlc2') {
        if (e.target.value === '-1') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controla4' && e.target.value === '-1') {
        this.controla4 = false
        this.controla420 = false
        this.controla421 = false
        this.controla422 = false
        this.controla423 = false
        this.controla424 = false
        this.controla425 = false
        this.controla426 = false
        this.controla427 = false
      } else if (t === 'controlb4' && e.target.value === '-1') {
        this.controlb4 = false
        this.controlb420 = false
        this.controlb421 = false
        this.controlb422 = false
        this.controlb423 = false
        this.controlb424 = false
        this.controlb425 = false
        this.controlb426 = false
        this.controlb427 = false
      } else if (e.target.value === '1') {
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
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const allergy = []
          for (var key in this.optionDataSource) {
            _.each(this.optionDataSource[key], function(item) {
              allergy.push({
                markId: 1,
                microbeName: item.microbeName,
                antibiotic: item.antibiotic,
                antibioticResult: item.antibioticResult,
                allergyValue: item.allergyValue
              })
            })
          }
          for (var key in this.optionDataSource2) {
            _.each(this.optionDataSource2[key], function(item) {
              allergy.push({
                markId: 2,
                microbeName: item.microbeName,
                antibiotic: item.antibiotic,
                antibioticResult: item.antibioticResult,
                allergyValue: item.allergyValue
              })
            })
          }
          var re = this.form.getFieldsValue()
          var that = this
          re = {
            ...re,
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
            'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
            'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
            'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
            'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
            'c42': typeof re['c42'] !== 'undefined' ? re['c42'].join(',') : ''
          }
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.bywsw && this.bywsw.bywswId) {
            re.bywswId = this.bywsw.bywswId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          params.append('allergy', JSON.stringify(allergy))
          this.spinning = true
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
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    save() {
      const allergy = []
      for (var key in this.optionDataSource) {
        _.each(this.optionDataSource[key], function(item) {
          allergy.push({
            markId: 1,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      for (var key in this.optionDataSource2) {
        _.each(this.optionDataSource2[key], function(item) {
          allergy.push({
            markId: 2,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      var re = this.form.getFieldsValue()
      var that = this
      re = {
        ...re,
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
        'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
        'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
        'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
        'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
        'c42': typeof re['c42'] !== 'undefined' ? re['c42'].join(',') : ''
      }
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.bywsw && this.bywsw.bywswId) {
        re.bywswId = this.bywsw.bywswId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      params.append('allergy', JSON.stringify(allergy))
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
    initValue(key, type = 'normal') {
      if (!this.bywsw) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.bywsw[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.bywsw[key])
      } else if (type === 'array') {
        return this.bywsw[key].split(',')
      } else {
        return this.bywsw[key] + ''
      }
    },
    dealAnswers(data) {
      var that = this
      var answer = data.bywsw
      var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌']
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.a2 && answer.a2 === -1) {
          this.controla2 = true
        }
        if (answer.a4 && answer.a4 === 1) {
          this.controla4 = true
        }
        if (answer.b2 && answer.b2 === -1) {
          this.controlb2 = true
        }
        if (answer.b4 && answer.b4 === 1) {
          this.controlb4 = true
        }
        if (answer.c2 && answer.c2 === -1) {
          this.controlc2 = true
        }
        if (answer.c4 && answer.c4 === 1) {
          this.controlc4 = true
        }
        if (answer.a42) {
          splitArr = answer.a42.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla420 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla421 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla422 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla423 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla424 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla425 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla426 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla427 = true
          }
        }
        if (data[1]) {
          _.each(alList, function(v, i) {
            if (data[1][v]) {
              that.optionDataSource[i] = data[1][v]
            }
          })
        }
        if (answer.b42) {
          splitArr = answer.b42.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controlb420 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controlb421 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controlb422 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controlb423 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controlb424 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controlb425 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controlb426 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controlb427 = true
          }
        }
        if (data[2]) {
          _.each(alList, function(v, i) {
            if (data[2][v]) {
              that.optionDataSource2[i] = data[2][v]
            }
          })
        }
        if (answer.c42) {
          splitArr = answer.c42.split(',')
          if (splitArr.indexOf('6') > -1) {
            this.controlc426 = true
          }
        }
      }
      return answer
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    showList(e, name, controlNode, isSimple) {
      if (e.target.checked) {
        this[controlNode] = true
        if (name == "其他") return
        this.getMedicineAllergyList(name, e.target.value, isSimple)
      } else {
        this[controlNode] = false
        if (isSimple) {
          this.$set(this.optionDataSource, e.target.value, [])
        } else {
          this.$set(this.optionDataSource2, e.target.value, [])
        }

      }
    },
    getMedicineAllergyList(value, index, isSimple) {
      const that = this
      const params = new URLSearchParams()
      params.append('microbeName', value)
      getMedicineAllergyList(params).then(res => {
        const optionDataSource = _.map(res.data, function(v, i) {
          return {
            keyW: i,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
        })
        if (isSimple) {
          that.$set(that.optionDataSource, index, optionDataSource)
        } else {
          that.$set(that.optionDataSource2, index, optionDataSource)
        }
      })
    },
    otherChange(e, index, isSimple) {
      this.getMedicineAllergyList(e.target.value, index, isSimple)
    }
  }
}
</script>
<style lang="less" scoped>
#baselineInfo {
  height: calc(100% - 10px);
}

/deep/ .card-box {
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