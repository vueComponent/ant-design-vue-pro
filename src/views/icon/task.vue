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
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="btn-array" v-if="executeStatus !== 2 && canEdit">
              <a-button class="btn fr" type="primary" html-type="submit" ref="submitBtn">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2 && canEdit">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <p class="tip">必填项如数据缺失无法提交，请一律用"/"来填写!</p>
              <div class="title">1.呼吸系统相关治疗</div>
              <a-form-item label="(1) 随访期间有否长期氧疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b1', {...require1, initialValue: initValue('b1')}]">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(2) 随访期间有否无创辅助通气:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b2', {...require1, initialValue: initValue('b2')}]">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(3) 随访期间有否进行各类物理治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b3', {...require1, initialValue: initValue('b3')}]" @change="changeRadio($event, 'controlb3')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="治疗方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb3">
                <a-checkbox-group v-decorator="['b31', {...selectRequired, initialValue: initValue('b31', 'array')}]">
                  <a-checkbox value="1">手动拍击背部排痰</a-checkbox>
                  <a-checkbox value="2">体位引流</a-checkbox>
                  <a-checkbox value="3">规律锻炼身体</a-checkbox>
                  <a-checkbox value="4">借助排痰仪器</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(4) 随访期间有否进行各类呼吸疾病药物治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b4', {...require1, initialValue: initValue('b4')}]" @change="changeRadio($event, 'controlb4')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb4">
                <a-form-item label="4-1 规律抗生素治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b41', {...selectRequired, initialValue: initValue('b41', 'array')}]">
                    <a-checkbox value="0">无</a-checkbox>
                    <a-checkbox value="1">口服</a-checkbox>
                    <a-checkbox value="2">吸入/雾化</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="4-2 祛痰药物治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b42', {...selectRequired, initialValue: initValue('b42', 'array')}]">
                    <a-checkbox value="0">无</a-checkbox>
                    <a-checkbox value="1">口服</a-checkbox>
                    <a-checkbox value="2">雾化</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="4-3 支气管扩张剂:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b43', {...selectRequired, initialValue: initValue('b43', 'array')}]" class="control-m-line">
                    <a-checkbox value="0">无</a-checkbox>
                    <a-checkbox value="1">长效抗胆碱能药物</a-checkbox>
                    <a-checkbox value="2">长效β受体激动剂</a-checkbox>
                    <a-checkbox value="3">长效抗胆碱能药物/长效β受体激动剂</a-checkbox>
                    <a-checkbox value="4" :checked="controlb43" @change="changeSelect($event, 'controlb43')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="其他支气管扩张剂::" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb43">
                  <a-input style="width: 240px;" v-decorator="['b431', {...inputRequired, initialValue: initValue('b431')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="4-4 吸入激素:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b44', {...require1, initialValue: initValue('b44')}]">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="4-5 其他治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b45', { initialValue: initValue('b45')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(5) 随访期间有否进行各类免疫调节剂治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b5', {...require1, initialValue: initValue('b5')}]" @change="changeRadio($event, 'controlb5')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb5">
                <a-form-item label="治疗方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b51', {...selectRequired, initialValue: initValue('b51', 'array')}]">
                    <a-checkbox value="1">细菌溶解产物胶囊</a-checkbox>
                    <a-checkbox value="2">匹多莫德</a-checkbox>
                    <a-checkbox value="3">胸腺肽</a-checkbox>
                    <a-checkbox value="4">脾氨肽</a-checkbox>
                    <a-checkbox value="5" :checked="controlb51" @change="changeSelect($event, 'controlb51')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="其他治疗::" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb5 && controlb51">
                  <a-input style="width: 240px;" v-decorator="['b52', {...inputRequired, initialValue: initValue('b52')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(6) 胸部CT检查:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['d', {...require1, initialValue: initValue('d')}]" @change="changeRadio($event, 'controld')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controld">
                <a-form-item label="6-1 CT检查日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['d1', {...dateRequire, initialValue: initValue('d1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="支扩位于CT图像上：" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d2', {...selectRequired, initialValue: initValue('d2', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'controld3')">右上叶</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'controld4')">左上叶</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'controld5')">右中叶</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'controld6')">左舌叶</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'controld7')">右下叶</a-checkbox>
                    <a-checkbox value="6" @change="changeSelect($event, 'controld8')">左下叶</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="右上叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld3">
                  <a-radio-group v-decorator="['d3', {...selectRequired, initialValue: initValue('d3')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="左上叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld4">
                  <a-radio-group v-decorator="['d4', {...selectRequired, initialValue: initValue('d4')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="右中叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld5">
                  <a-radio-group v-decorator="['d5', {...selectRequired, initialValue: initValue('d5')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="左舌叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld6">
                  <a-radio-group v-decorator="['d6', {...selectRequired, initialValue: initValue('d6')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="右下叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld7">
                  <a-radio-group v-decorator="['d7', {...selectRequired, initialValue: initValue('d7')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="左下叶：" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controld8">
                  <a-radio-group v-decorator="['d8', {...selectRequired, initialValue: initValue('d8')}]" @change="computeReiff">
                    <a-radio value="1">柱状</a-radio>
                    <a-radio value="2">静脉曲张型(混合型)</a-radio>
                    <a-radio value="3">囊状</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="影像Reiff评分:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['d9', {initialValue: initValue('d9')}]" :readOnly="true" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(7) 各类肺功能测试:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['e', {...require1, initialValue: initValue('e')}]" @change="changeRadio($event, 'controle')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controle">
                <a-form-item label="7-1 CT检查日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['e1', {...dateRequire, initialValue: initValue('e1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="7-2 FVC:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['e2', {...inputRequired, initialValue: initValue('e2')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-3 FVC pred:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="%" style="width: 240px;" v-decorator="['e3', {...inputRequired, initialValue: initValue('e3')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-4 FEV1:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['e4', {...inputRequired, initialValue: initValue('e4')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-5 FEV1 pred:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['e5', {...inputRequired, initialValue: initValue('e5')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-6 FEV1/FVC:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['e6', {...inputRequired, initialValue: initValue('e6')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-7 DLCO SB:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="ml/min/mmHg" style="width: 240px;" v-decorator="['e7', {...inputRequired, initialValue: initValue('e7')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-8 DLCO/VA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="ml/min/mmHg" style="width: 240px;" v-decorator="['e8', {...inputRequired, initialValue: initValue('e8')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-9 DLCO SB:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="mmol/min/kPa" style="width: 240px;" v-decorator="['e9', {...inputRequired, initialValue: initValue('e9')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7-10 DLCO/VA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="mmol/min/kPa/L" style="width: 240px;" v-decorator="['e10', {...inputRequired, initialValue: initValue('e10')}]" autocomplete="off"></a-input>
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
import { getPatientBasis, saveBasis, getBasisForm, recoverSubmit, computeScore } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'iconTask',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      markName: 'iconcgsf',
      title: 'ICON常规随访',
      openKeys: [],
      defaultSelectedKeys: [4],
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
      maskId: undefined,
      patientBasisId: this.$route.params.id,
      controlb3: false,
      controlb4: false,
      controlb43: false,
      controlb5: false,
      controlb51: false,
      spinning: false,
      executeStatus: false,
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      submitInfo: undefined,
      iconcgsf: undefined,
      controld3: false,
      controld4: false,
      controld5: false,
      controld6: false,
      controld7: false,
      controld8: false,
      controld: false,
      controle: false
    }
  },
  created() {
    var that = this
    this.defaultSelectedKeys = [4]
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.maskId = res.data.list[0].basisMarkId
        that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
        that.canEdit = that.$ls.get(ACCESS_TOKEN).centerId === that.patient.targetCenterId
        that.getFormData()
      })

  },
  activated() {
    // this.getFormData()
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      var arr = ['controld3', 'controld4', 'controld5', 'controld6', 'controld7', 'controld8']
      if (arr.indexOf(t) > -1 && !e.target.checked) {
        this.computeReiff()
      }
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
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else if (e.key < 63) {
        this.$router.replace('/list/basis/' + this.patientBasisId + '/' + e.key)
      }
      return false;
    },
    handleOk(v) {
      this.submitInfo = v
      this.$refs.submitBtn.$el.click()
    },
    handleSubmit(e) {
      var _this = this
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          var re = this.form.getFieldsValue()
          var that = this
          re = {
            ...re,
            'b31': typeof re['b31'] !== 'undefined' ? re['b31'].join(',') : '',
            'b41': typeof re['b41'] !== 'undefined' ? re['b41'].join(',') : '',
            'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
            'b43': typeof re['b43'] !== 'undefined' ? re['b43'].join(',') : '',
            'b51': typeof re['b51'] !== 'undefined' ? re['b51'].join(',') : '',
            'd2': typeof re['d2'] !== 'undefined' ? re['d2'].join(',') : '',
            'd1': typeof re['d1'] !== 'undefined' ? re['d1'].format('YYYY-MM-DD') : '',
            'e1': typeof re['e1'] !== 'undefined' ? re['e1'].format('YYYY-MM-DD') : ''
          }
          var that = this
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.iconcgsf && this.iconcgsf.iconCgfsId) {
            re.iconCgfsId = this.iconcgsf.iconCgfsId
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
          return false
        } else {
          this.spinning = false
        }
      })
    },
    initValue(key, type = 'normal') {
      if (!this.iconcgsf) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.iconcgsf[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.iconcgsf[key])
      } else if (type === 'array') {
        return this.iconcgsf[key].split(',')
      } else {
        return this.iconcgsf[key] + ''
      }
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    computeReiff() {
      var that = this
      this.$nextTick(() => {
        var params = new URLSearchParams()
        params.append('scoreType', 'iconReiff')
        params.append('iconcgfsStr', JSON.stringify(that.form.getFieldsValue()))
        computeScore(params)
          .then(res => {
            console.log(res.data.d9)
            that.form.setFieldsValue({
              d9: res.data.d9
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.b3 === 1) {
          this.controlb3 = true
        }
        if (answer.b4 === 1) {
          this.controlb4 = true
        }
        if (answer.b5 === 1) {
          this.controlb5 = true
        }
        if (answer.b43) {
          splitArr = answer.b43.split(',')
          if (splitArr.indexOf('4') > -1) {
            this.controlb43 = true
          }
        }
        if (answer.b51) {
          splitArr = answer.b51.split(',')
          if (splitArr.indexOf('5') > -1) {
            this.controlb51 = true
          }
        }
        if (answer.d === 1) {
          this.controld = true
        }
        if (answer.e === 1) {
          this.controle = true
        }
        if (answer.d2) {
          splitArr = answer.d2.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controld3 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controld4 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controld5 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controld6 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controld7 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controld8 = true
          }
        }
      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      re = {
        ...re,
        'b31': typeof re['b31'] !== 'undefined' ? re['b31'].join(',') : '',
        'b41': typeof re['b41'] !== 'undefined' ? re['b41'].join(',') : '',
        'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
        'b43': typeof re['b43'] !== 'undefined' ? re['b43'].join(',') : '',
        'b51': typeof re['b51'] !== 'undefined' ? re['b51'].join(',') : '',
        'd2': typeof re['d2'] !== 'undefined' ? re['d2'].join(',') : '',
        'd1': typeof re['d1'] !== 'undefined' ? re['d1'].format('YYYY-MM-DD') : '',
        'e1': typeof re['e1'] !== 'undefined' ? re['e1'].format('YYYY-MM-DD') : ''
      }
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.iconcgsf && this.iconcgsf.iconCgfsId) {
        re.iconCgfsId = this.iconcgsf.iconCgfsId
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
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.iconcgsf) {
            that.iconcgsf = that.dealAnswers(res.data.iconcgsf)
          } else {
            that.form.resetFields()
          }
          this.spinning = false
        })
        .catch(error => {
          this.spinning = false
          console.log(error)
        })
    },
    withdraw() {
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.iconcgsf.patientBasisMarkId)
          recoverSubmit(params)
            .then(res => {
              that.spinning = false
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
            }).catch(error => {
              that.spinning = false
              console.log(error)
            })
        }
      })
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
  /deep/ .ant-card-body {
    padding: 0;
    height: 100%;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../assets/treeTop.png);
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

      .treeSubTitle {
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
    margin-top: 42px;
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

    padding: 20px 20px 60px;

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

@media screen and (max-width: 1366px) {
  .control-m-line.ant-checkbox-group {
    top: 10px;
    position: relative;
  }
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>