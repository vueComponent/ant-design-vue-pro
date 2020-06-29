<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;" v-if="!isGroup">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          受访者：{{ patient.name }}
        </a-col>
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          身份证：{{ patient.card }}
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
        <a-col :span="19" style="height: 100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="btn-array" v-if="executeStatus !== 2 && !isGroup">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2">
              <a-button class="btn fr" @click="withdraw">撤回</a-button>
            </div>

            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.急性加重期</div>
              <a-form-item label="(1) 急性加重的症状(多选):" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['d1', {...selectRequired, initialValue: initValue('d1', 'array')}]" class="control-m-line">
                  <a-checkbox value="1">咳嗽加重</a-checkbox>
                  <a-checkbox value="2">痰量增多</a-checkbox>
                  <a-checkbox value="3">痰液黏度增加</a-checkbox>
                  <a-checkbox value="4">痰脓性增加</a-checkbox>
                  <a-checkbox value="5">呼吸急促加重</a-checkbox>
                  <a-checkbox value="6">活动耐量下降</a-checkbox>
                  <a-checkbox value="7">咯血新增或增多</a-checkbox>
                  <a-checkbox value="8">其他系统症状（如：乏力，发热等）</a-checkbox>
                  <a-checkbox value="9" :checked="controld1" @change="changeSelect($event, 'controld1')">其他症状</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="其他症状:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld1">
                <a-input v-decorator="['d2', {...inputRequired, initialValue: initValue('d2')}]" style="width: 240px;" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(2) 痰量:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['d3', {...inputRequired, initialValue: initValue('d3')}]" style="width: 240px;" autocomplete="off" addonAfter="ml/日"></a-input>
              </a-form-item>
              <a-form-item label="(3) 痰液粘稠Murry评分" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-popover>
                  <template slot="content">
                    <img src="../../../assets/murry.png" style="height: 260px;" />
                  </template>
                  <a-icon type="exclamation-circle" style="position: relative;left: -20px;color: #0399ec;cursor: pointer;" />
                </a-popover>
                <a-radio-group v-decorator="['d31', {...selectRequired, initialValue: initValue('d31')}]">
                  <a-radio value="1">黏液性</a-radio>
                  <a-radio value="2">黏脓性</a-radio>
                  <a-radio value="3">脓性</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 痰血最多量:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['d32', {...inputRequired, initialValue: initValue('d32')}]" style="width: 240px;" autocomplete="off" addonAfter="ml/日"></a-input>
              </a-form-item>
              <a-form-item label="(5) 咯血量(最多)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['d33', {...inputRequired, initialValue: initValue('d33')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 有无胸痛" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['d4', {...require2, initialValue: initValue('d4')}]">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(7) 急性加重期入院方式" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['d5', {...selectRequired, initialValue: initValue('d5')}]" @change="changeRadio($event, 'controld5')">
                  <a-radio value="1">住院</a-radio>
                  <a-radio value="2">门诊</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controld5">
                <a-form-item label="记录住院天数::" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                  <a-input v-decorator="['d51', {...inputRequired, initialValue: initValue('d51')}]" style="width: 240px;" autocomplete="off" addonAfter="天"></a-input>
                </a-form-item>
                <a-form-item label="住院总费用::" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                  <a-input v-decorator="['d52', {...inputRequired, initialValue: initValue('d52')}]" style="width: 240px;" autocomplete="off" addonAfter="元"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(8) 急性加重发生时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" :disabledDate="disabledDate" v-decorator="['d6', {...dateRequire, initialValue: initValue('d6', 'time')}]"></a-date-picker>
              </a-form-item>
              <a-form-item label="(9) 持续时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['d7', {...inputRequired, initialValue: initValue('d7')}]" style="width: 240px;" autocomplete="off" addonAfter="天"></a-input>
              </a-form-item>
              <a-form-item label="(10) 采样性质（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a', {...selectRequired, initialValue: initValue('a', 'array')}]">
                  <a-checkbox value="1" @change="changeSelect($event, 'control1')">细菌</a-checkbox>
                  <a-checkbox value="2" @change="changeSelect($event, 'control2')">真菌</a-checkbox>
                  <a-checkbox value="3" @change="changeSelect($event, 'control3')">分枝杆菌</a-checkbox>
                  <a-checkbox value="4" @change="changeSelect($event, 'control4')">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <div v-if="control1">
                <div class="title">1.细菌</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a1', {...dateRequire, initialValue: initValue('a1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]" @change="changeRadio($event, 'controla2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla2">
                  <a-input style="width: 240px;" v-decorator="['a21', {...inputRequired, initialValue: initValue('a21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a3', {...require1, initialValue: initValue('a3')}]">
                    <a-radio value="1">痰液</a-radio>
                    <a-radio value="2">诱导痰</a-radio>
                    <a-radio value="3">支气管肺泡灌洗液</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(4) 是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a4', {...require1, initialValue: initValue('a4')}]" @change="changeRadio($event, 'controla4')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="药敏方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controla4">
                  <a-radio-group v-decorator="['a41', {...selectRequired, initialValue: initValue('a41')}]">
                    <a-radio value="1">MIC</a-radio>
                    <a-radio value="2">纸片法</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controla4">
                  <a-checkbox-group v-decorator="['a42', {...selectRequired, initialValue: initValue('a42', 'array')}]" class="control-m-line">
                    <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla420', true)">铜绿假单胞菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[0]" v-if="controla420" :type1="type" @listen="changeType" :isFirst="true" :picSource="picList[0]" @changePic1="changePic($event, 0)"></add-table>
                    <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla421', true)">肺炎链球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[1]" v-if="controla421" :isFirst="true" :picSource="picList[1]" @changePic1="changePic($event, 1)"></add-table>
                    <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla422', true)">肺炎克雷伯菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[2]" v-if="controla422" :isFirst="true" :picSource="picList[2]" @changePic1="changePic($event, 2)"></add-table>
                    <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla423', true)">阴沟肠杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[3]" v-if="controla423" :isFirst="true" :picSource="picList[3]" @changePic1="changePic($event, 3)"></add-table>
                    <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla424', true)">副流感嗜血杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[4]" v-if="controla424" :isFirst="true" :picSource="picList[4]" @changePic1="changePic($event, 4)"></add-table>
                    <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla425', true)">鲍曼不动杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[5]" v-if="controla425" :isFirst="true" :picSource="picList[5]" @changePic1="changePic($event, 5)"></add-table>
                    <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla426', true)">金黄色葡萄球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[6]" v-if="controla426" :isFirst="true" :picSource="picList[6]" @changePic1="changePic($event, 6)"></add-table>
                    <a-checkbox value="7" @change="showList($event, '其他', 'controla427', true)">其他</a-checkbox>
                    <a-input style="width: 240px;margin-right: 10px;" v-if="controla427" @change="otherChange($event, 7, true)" autocomplete="off" v-decorator="['otherName1', {...inputRequired, initialValue: otherName1}]"></a-input>
                    <add-table :dataSource="optionDataSource[7]" v-if="controla427" :isFirst="true" :picSource="picList[7]" @changePic1="changePic($event, 7)"></add-table>
                  </a-checkbox-group>
                </a-form-item>
              </div>
              <div v-if="control2">
                <div class="title">2.真菌</div>
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
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b4', {...require1, initialValue: initValue('b4')}]" @change="changeRadio($event, 'controlb4')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="真菌:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb4">
                  <a-checkbox-group v-decorator="['b42', {...selectRequired, initialValue: initValue('b42', 'array')}]">
                    <a-checkbox value="1">曲霉</a-checkbox>
                    <a-checkbox value="2" :checked="controlb42" @change="changeSelect($event, 'controlb42')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他真菌" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb42">
                  <a-input style="width: 240px;" v-decorator="['b43', {...inputRequired, initialValue: initValue('b43')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <div v-if="control3">
                <div class="title">3.分枝杆菌</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['c1', {...dateRequire, initialValue: initValue('c1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c2', {...require1, initialValue: initValue('c2')}]" @change="changeRadio($event, 'controlc2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlc2">
                  <a-input style="width: 240px;" v-decorator="['c21', {...inputRequired, initialValue: initValue('c21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['c3', {...require1, initialValue: initValue('c3')}]">
                    <a-radio value="1">痰液</a-radio>
                    <a-radio value="2">诱导痰</a-radio>
                    <a-radio value="3">支气管肺泡灌洗液</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(4) 分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['c4', {...selectRequired, initialValue: initValue('c4', 'array')}]">
                    <a-checkbox value="0">结核分枝杆菌</a-checkbox>
                    <a-checkbox value="1" @change="changeSelect($event, 'controlc4')">非结核分枝杆菌</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="controlc4">
                  <a-form-item label="非结核分枝杆菌:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-checkbox-group v-decorator="['c41', {...selectRequired, initialValue: initValue('c41', 'array')}]">
                      <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                      <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                      <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                      <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                      <a-checkbox value="5" @change="changeSelect($event, 'controlc415')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc415">
                    <a-input style="width: 240px;margin-right: 10px;" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
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
import { getPatientBasis, saveBasis, getBasisForm, getMedicineAllergyList } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import AddTable from "@/views/account/center/model/table"
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'jxjzq',
  components: {
    STree,
    MyIcon,
    AddTable
  },
  data() {
    return {
      markName: 'sf_jxjzq',
      title: '急性加重期',
      openKeys: [],
      orgTree: [],
      patient: {},
      patientBasis: {},
      defaultSelectedKeys: [],
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      baselineFormStyle: {
        // height: '444px',
        'padding-top': '52px'
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
      labelColOffset: {
        md: { span: 5, offset: 3 }
      },
      wrapperOffset: {
        md: { span: 16 }
      },
      labelColOffset2: {
        md: { span: 6, offset: 3 }
      },
      wrapperOffset2: {
        md: { span: 15 }
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
      patientBasisId: this.$route.params.id,
      jxjzq: undefined,
      controld1: false,
      controld5: false,
      maskId: undefined,
      spinning: false,
      executeStatus: false,
      optionDataSource: [],
      picList: [],
      type: '',
      control1: false,
      control2: false,
      control3: false,
      control4: false,
      controla2: false,
      controla4: false,
      controlb2: false,
      controlb4: false,
      controlc2: false,
      controlc4: false,
      controla420: false,
      controla421: false,
      controla422: false,
      controla423: false,
      controla424: false,
      controla425: false,
      controla426: false,
      controla427: false,
      controlb42: false,
      controlc415: false,
      otherName1: '',
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false
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
        that.maskId = res.data.list[0].basisMarkId
        that.defaultSelectedKeys = [that.maskId]
        that.executeStatus = res.data.list[0].executeStatus
        that.getFormData()
      })
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      var that = this
      this[t] = e.target.checked
      if (t === 'control4' && e.target.checked) {
        this.control1 = false
        this.control2 = false
        this.control3 = false
        //赋值必须要延时
        setTimeout(function() {
          that.form.setFieldsValue({ a: ['4'] })
        }, 0)
      }
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
        this.controlb42 = false
      } else if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      if (e.key >= 57 && e.key <= 62) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      }
      return false
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      this.confirmLoading = true
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          re = {
            ...re,
            'd1': typeof re['d1'] !== 'undefined' ? re['d1'].join(',') : '',
            'd6': typeof re['d6'] !== 'undefined' ? re['d6'].format('YYYY-MM-DD') : '',
            'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
            'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
            'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
            'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
            'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
            'c4': typeof re['c4'] !== 'undefined' ? re['c4'].join(',') : '',
            'c41': typeof re['c41'] !== 'undefined' ? re['c41'].join(',') : ''
          }
          var that = this
          console.log(re)
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
          //处理附件
          var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌', this.form.getFieldValue('otherName1')]

          var pic = _.map(this.picList, function(v, i) {
            return '1-' + alList[i] + '-' + v
          })
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.jxjzq && this.jxjzq.jxjzqId) {
            re.jxjzqId = this.jxjzq.jxjzqId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          params.append('allergy', JSON.stringify(allergy))
          params.append('fileNameForMa', JSON.stringify(pic))
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
                  that.maskId = res.data.list[0].basisMarkId
                  that.defaultSelectedKeys = [that.maskId]
                  that.executeStatus = res.data.list[0].executeStatus
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
      if (!this.jxjzq) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.jxjzq[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.jxjzq[key])
      } else if (type === 'array') {
        return this.jxjzq[key].split(',')
      } else {
        return this.jxjzq[key] + ''
      }
    },
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', that.maskId)
      getBasisForm(params)
        .then(res => {
          this.spinning = false
          if (res.data && res.data.sf_jxjzq)
            that.jxjzq = that.dealAnswers(res.data)
        })
        .catch(error => {
          this.spinning = false
          console.log(error)
        })
    },
    dealAnswers(data) {
      var that = this
      var answer = data.sf_jxjzq
      var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌']
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.d1) {
          splitArr = answer.d1.split(',')
          if (splitArr.indexOf('9') > -1) {
            this.controld1 = true
          }
        }
        if (answer.d5 === 1) {
          this.controld5 = true
        }
        if (answer.a) {
          splitArr = answer.a.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.control1 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.control2 = true
          }
        }
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
        if (answer.c4) {
          splitArr = answer.c4.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controlc4 = true
          }
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
              that.optionDataSource[i] = _.map(data[1][v], function(v, i) {
                return {
                  keyW: i,
                  microbeName: v.microbeName,
                  antibiotic: v.antibiotic,
                  antibioticResult: v.antibioticResult,
                  allergyValue: v.allergyValue
                };
              })
            }
          })
          var other = _.filter(data[1], function(v, k) { return alList.indexOf(k) === -1 })
          if (other && other.length) {
            that.optionDataSource[7] = _.map(other[0], function(v, i) {
              return {
                keyW: i,
                microbeName: v.microbeName,
                antibiotic: v.antibiotic,
                antibioticResult: v.antibioticResult,
                allergyValue: v.allergyValue
              };
            })
          }
        }
        if (answer.b42) {
          splitArr = answer.b42.split(',')
          if (splitArr.indexOf('2') > -1) {
            this.controlb42 = true
          }
        }
        if (answer.c41) {
          splitArr = answer.c41.split(',')
          if (splitArr.indexOf('5') > -1) {
            this.controlc415 = true
          }
        }
      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      re = {
        ...re,
        'd1': typeof re['d1'] !== 'undefined' ? re['d1'].join(',') : '',
        'd6': typeof re['d6'] !== 'undefined' ? re['d6'].format('YYYY-MM-DD') : '',
        'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
        'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
        'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
        'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
        'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
        'c4': typeof re['c4'] !== 'undefined' ? re['c4'].join(',') : '',
        'c41': typeof re['c41'] !== 'undefined' ? re['c41'].join(',') : ''
      }
      var that = this
      console.log(re)
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
      //处理附件
      var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌', this.form.getFieldValue('otherName1')]

      var pic = _.map(this.picList, function(v, i) {
        return '1-' + alList[i] + '-' + v
      })
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.jxjzq && this.jxjzq.jxjzqId) {
        re.jxjzqId = this.jxjzq.jxjzqId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      params.append('allergy', JSON.stringify(allergy))
      params.append('fileNameForMa', JSON.stringify(pic))
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
              that.maskId = res.data.list[0].basisMarkId
              that.defaultSelectedKeys = [that.maskId]
              that.executeStatus = res.data.list[0].executeStatus
            })
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    changeType(v) {
      this.type = v
    },
    changePic(e, index) {
      this.picList[index] = e
    },
    showList(e, name, controlNode) {
      if (e.target.checked) {
        this[controlNode] = true
        if (name == "其他") return
        this.getMedicineAllergyList(name, e.target.value)
      } else {
        this[controlNode] = false
        this.$set(this.optionDataSource, e.target.value, [])
      }
    },
    getMedicineAllergyList(value, index) {
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
        that.$set(that.optionDataSource, index, optionDataSource)
      })
    },
    otherChange(e, index) {
      this.getMedicineAllergyList(e.target.value, index)
    },
    withdraw(){
      
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

.single-line {
  height: 56px;
  overflow: hidden;
}

/deep/ .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .2);
  z-index: 2;

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

  .btn-array {
    overflow: hidden;
    position: absolute;
    padding-top: 10px;
    padding-right: 20px;
    width: calc(100% - 8px);
    // height: 42px;
    background: #fff;
    z-index: 1;
    padding-bottom: 10px;
    bottom: 0;
  }

  .baselineForm {
    // padding-top: 52px;
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

    /deep/ .label-overflow .ant-form-item-label {
      line-height: 20px;
      position: relative;
      top: 12px;
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


.control-m-line.ant-checkbox-group {
  top: 10px;
  position: relative;
}


.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>