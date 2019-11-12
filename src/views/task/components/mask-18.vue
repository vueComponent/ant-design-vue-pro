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
        <a-col :span="19">
          <a-form :form="form" @submit="handleSubmit" style="height:100%;overflow:hidden auto;">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 2">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <a-form-item label="有无新增呼吸系统相关治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a1', {...require2, initialValue: initValue('a1')}]" @change="changeRadio($event, 'controla1')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla1">
                <div class="title">1.呼吸系统相关治疗</div>
                <a-form-item label="(1) 长期氧疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b1', {...require1, initialValue: initValue('b1')}]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(2) 无创辅助通气:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b2', {...require1, initialValue: initValue('b2')}]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(3) 患者是否行有规律的物理治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b3', {...require1, initialValue: initValue('b3')}]" @change="changeRadio($event, 'controlb3')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb3">
                  <a-form-item label="治疗方式:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b31', {...selectRequired, initialValue: initValue('b31')}]">
                      <a-radio value="1">手动拍击背部排痰</a-radio>
                      <a-radio value="2">体位引流</a-radio>
                      <a-radio value="3">规律锻炼身体</a-radio>
                      <a-radio value="4">借助排痰仪器</a-radio>
                      <a-radio value="5">无</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="患者是否参加肺康复治疗:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b32', {...selectRequired, initialValue: initValue('b32')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="2">未听说过有这种治疗</a-radio>
                      <a-radio value="3">因共病不适合</a-radio>
                      <a-radio value="4">患者拒绝参加</a-radio>
                      <a-radio value="5">想参加但未能参加</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <a-form-item label="(4) 有规律的呼吸疾病药物治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b4', {...require1, initialValue: initValue('b4')}]" @change="changeRadio($event, 'controlb4')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb4">
                  <a-form-item label="周期性抗生素治疗:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b41', {...selectRequired, initialValue: initValue('b41')}]" @change="changeRadio($event, 'controlb41')">
                      <a-radio value="1">阿奇霉素</a-radio>
                      <a-radio value="2">克拉霉素</a-radio>
                      <a-radio value="3">红霉素</a-radio>
                      <a-radio value="4">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb41">
                    <a-input style="width: 240px;" v-decorator="['b414', {...inputRequired, initialValue: initValue('b414')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="吸入/雾化抗生素药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-input style="width: 240px;" v-decorator="['b42', {...inputRequired, initialValue: initValue('b42')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="祛痰类药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b43', {...selectRequired, initialValue: initValue('b43')}]">
                      <a-radio value="1">N乙酰半胱氨酸</a-radio>
                      <a-radio value="2">氨溴索</a-radio>
                      <a-radio value="3">桉柠蒎</a-radio>
                      <a-radio value="4">羧甲司坦</a-radio>
                      <a-radio value="5">厄多司坦</a-radio>
                      <a-radio value="6">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="吸入激素:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b44', {...selectRequired, initialValue: initValue('b44')}]" @change="changeRadio($event, 'controlb44')">
                      <a-radio value="1">布地奈德</a-radio>
                      <a-radio value="2">氟替卡松</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="吸入激素/长效β受体激动剂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b45', {...selectRequired, initialValue: initValue('b45')}]">
                      <a-radio value="1">布地奈德/福莫特罗</a-radio>
                      <a-radio value="2">沙美特罗/氟替卡松</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="长效抗胆碱能药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b46', {...selectRequired, initialValue: initValue('b46')}]">
                      <a-radio value="1">噻托嗅按</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="长效β受体激动剂/长效抗胆碱能药物名称:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-input style="width: 240px;" v-decorator="['b47', {...inputRequired, initialValue: initValue('b47')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="长效β受体激动剂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b48', {...selectRequired, initialValue: initValue('b48')}]">
                      <a-radio value="1">福莫特罗</a-radio>
                      <a-radio value="2">茚达特罗</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="白三烯受体拮抗剂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b49', {...selectRequired, initialValue: initValue('b49')}]">
                      <a-radio value="1">孟鲁司特</a-radio>
                      <a-radio value="2">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="止血药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b410', {...selectRequired, initialValue: initValue('b410')}]">
                      <a-radio value="1">安络血</a-radio>
                      <a-radio value="2">云南白药</a-radio>
                      <a-radio value="3">垂体</a-radio>
                      <a-radio value="4">止血敏</a-radio>
                      <a-radio value="5">止血芳酸</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="雾化治疗:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b411', {...require1, initialValue: initValue('b411')}]" @change="changeRadio($event, 'controlb411')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlb411">
                    <a-form-item label="雾化药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                      <a-radio-group v-decorator="['b4111', {...selectRequired, initialValue: initValue('b4111')}]" @change="changeRadio($event, 'controlb4111')">
                        <a-radio value="1">乙酰半胱氨酸</a-radio>
                        <a-radio value="2">其他</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb4111">
                      <a-input style="width: 240px;" v-decorator="['b4112', {...inputRequired, initialValue: initValue('b4112')}]" autocomplete="off"></a-input>
                    </a-form-item>
                  </div>
                  <a-form-item label="ICS:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b412', {...selectRequired, initialValue: initValue('b412')}]" @change="changeRadio($event, 'controlb412')">
                      <a-radio value="1">布地奈德</a-radio>
                      <a-radio value="2">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb412">
                    <a-input style="width: 240px;" v-decorator="['b4121', {...inputRequired, initialValue: initValue('b4121')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="支气管扩张剂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b413', {...selectRequired, initialValue: initValue('b413')}]">
                      <a-radio value="1">异丙托溴胺</a-radio>
                      <a-radio value="2">沙丁胺醇</a-radio>
                      <a-radio value="3">特布他林</a-radio>
                      <a-radio value="4">复方异丙托溴铵（异丙托溴胺+沙丁胺醇）</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <a-form-item label="(5) ABPA相关治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b5', {...require1, initialValue: initValue('b5')}]" @change="changeRadio($event, 'controlb5')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb5">
                  <a-form-item label="口服激素:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b51', {...selectRequired, initialValue: initValue('b51')}]">
                      <a-radio value="1">强的松</a-radio>
                      <a-radio value="2">甲强龙</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="抗真菌药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b52', {...selectRequired, initialValue: initValue('b52')}]">
                      <a-radio value="1">伊曲康唑</a-radio>
                      <a-radio value="2">伏立康唑</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <a-form-item label="(6) 免疫球蛋白缺乏相关治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b6', {...require1, initialValue: initValue('b6')}]" @change="changeRadio($event, 'controlb6')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb6">
                  <a-form-item label="静脉注射免疫球蛋白药物名称:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-input style="width: 240px;" v-decorator="['b61', {...inputRequired, initialValue: initValue('b61')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <a-form-item label="(7) 患者是否曾接收疫苗治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b7', {...require1, initialValue: initValue('b7')}]" @change="changeRadio($event, 'controlb7')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb7">
                  <a-form-item label="肺炎链球菌多糖疫苗（如：PSV23）:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b71', {...require1, initialValue: initValue('b71')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="肺炎链球菌辅助疫苗（如：PCV13）:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b72', {...require1, initialValue: initValue('b72')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="过去1年内患者是否接受过流感疫苗:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-radio-group v-decorator="['b73', {...require1, initialValue: initValue('b73')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
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
import { getPatientBasis, saveBasis, getBasisForm } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask4',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      markName: 'hxxt',
      title: '年访视',
      openKeys: [],
      defaultSelectedKeys: [18],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
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
      maskId: this.$route.meta.maskId,
      patientBasisId: this.$route.params.id,
      hxxt: undefined,
      controlb3: false,
      controlb4: false,
      controlb41: false,
      controlb44: false,
      controlb411: false,
      controlb412: false,
      controlb4111: false,
      controlb5: false,
      controlb6: false,
      controlb7: false,
      controla1: false,
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
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.hxxt)
            that.hxxt = that.dealAnswers(res.data.hxxt)
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controlb41') {
        if (e.target.value === '4') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controlb44') {
        if (e.target.value === '3') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controlb412') {
        if (e.target.value === '2') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controlb4111') {
        if (e.target.value === '2') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      this.maskId = e.key
      if ((e.key >= 37 && e.key <= 42) || (e.key >= 45 && e.key <= 50)) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + this.maskId)
      } else {
        this.$router.replace('/list/task/' + this.patientBasisId + '/' + this.maskId)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          var that = this
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.hxxt && this.hxxt.hxxtId) {
            re.hxxtId = this.hxxt.hxxtId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          this.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.$message.success(res.msg)
              that.spinning = false
              that.getFormData()
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
      if (!this.hxxt) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.hxxt[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.hxxt[key])
      } else if (type === 'array') {
        return this.hxxt[key].split(',')
      } else {
        return this.hxxt[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {

      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.hxxt && this.hxxt.hxxtId) {
        re.hxxtId = this.hxxt.hxxtId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      this.spinning = true
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.$message.success(res.msg)
          that.spinning = false
          that.getFormData()
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
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