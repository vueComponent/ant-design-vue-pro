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
            <div style="overflow: hidden;">
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.病因学相关检查</div>
              <a-form-item label="(1) ABPA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a1', {...require1, initialValue: initValue('a1')}]" @change="changeRadio($event, 'controla1')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla1">
                <a-form-item label="血嗜酸里细胞绝对值:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="*10^9/L" style="width: 240px; margin-right: 20px;" v-decorator="['a11', {...inputRequired, initialValue: initValue('a11')}]"></a-input>
                  <a-radio-group v-decorator="['a12', {...selectRequired, initialValue: initValue('a12')}]">
                    <a-radio value="1">升高</a-radio>
                    <a-radio value="2">正常</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="血总IgE:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="IU/mL" style="width: 240px; margin-right: 20px;" v-decorator="['a13', {...inputRequired, initialValue: initValue('a13')}]"></a-input>
                  <a-radio-group v-decorator="['a14', {...selectRequired, initialValue: initValue('a14')}]">
                    <a-radio value="1">升高</a-radio>
                    <a-radio value="2">正常</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="曲霉特异IgE:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="IU/mL" style="width: 240px; margin-right: 20px;" v-decorator="['a15', {...inputRequired, initialValue: initValue('a15')}]"></a-input>
                  <a-radio-group v-decorator="['a16', {...selectRequired, initialValue: initValue('a16')}]">
                    <a-radio value="1">升高</a-radio>
                    <a-radio value="2">正常</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="曲霉皮肤点刺试验:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a17', {...selectRequired, initialValue: initValue('a17')}]">
                    <a-radio value="1">升高</a-radio>
                    <a-radio value="2">正常</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="胸部CT有无中心性支扩:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a18', {...selectRequired, initialValue: initValue('a18')}]">
                    <a-radio value="1">升高</a-radio>
                    <a-radio value="2">正常</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="(2) 自身免疫抗体检查:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]" @change="changeRadio($event, 'controla2')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla2">
                <a-form-item label="CCP:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a21', {...selectRequired, initialValue: initValue('a21')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">中间</a-radio>
                    <a-radio value="3">阴性</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="ANA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a22', {...selectRequired, initialValue: initValue('a22')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">中间</a-radio>
                    <a-radio value="3">阴性</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="ENA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a23', {...selectRequired, initialValue: initValue('a23')}]" @change="changeRadio($event, 'controla23')">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">中间</a-radio>
                    <a-radio value="3">阴性</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="具体描述" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla23">
                  <a-input style="width: 240px;" v-decorator="['a24', {...inputRequired, initialValue: initValue('a24')}]"></a-input>
                </a-form-item>
                <a-form-item label="ANCA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a25', {...selectRequired, initialValue: initValue('a25')}]" @change="changeRadio($event, 'controla25')">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">中间</a-radio>
                    <a-radio value="3">阴性</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="具体描述" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla25">
                  <a-input style="width: 240px;" v-decorator="['a26', {...inputRequired, initialValue: initValue('a26')}]"></a-input>
                </a-form-item>
                <a-form-item label="其他检查（记录阳性结果）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['a27', {...inputRequired, initialValue: initValue('a27')}]"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(3) 球蛋白缺乏:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a3', {...require1, initialValue: initValue('a3')}]" @change="changeRadio($event, 'controla3')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla3">
                <a-form-item label="IgM:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px; margin-right: 20px;" v-decorator="['a31', {...inputRequired, initialValue: initValue('a31')}]"></a-input>
                  <a-radio-group v-decorator="['a32', {...selectRequired, initialValue: initValue('a32')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="IgG:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px; margin-right: 20px;" v-decorator="['a33', {...inputRequired, initialValue: initValue('a33')}]"></a-input>
                  <a-radio-group v-decorator="['a34', {...selectRequired, initialValue: initValue('a34')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="IgA:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px; margin-right: 20px;" v-decorator="['a35', {...inputRequired, initialValue: initValue('a35')}]"></a-input>
                  <a-radio-group v-decorator="['a36', {...selectRequired, initialValue: initValue('a36')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="(4) 补体缺乏:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a4', {...require1, initialValue: initValue('a4')}]" @change="changeRadio($event, 'controla4')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla4">
                <a-form-item label="C3:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px; margin-right: 20px;" v-decorator="['a41', {...inputRequired, initialValue: initValue('a41')}]"></a-input>
                  <a-radio-group v-decorator="['a42', {...selectRequired, initialValue: initValue('a42')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="C4:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px; margin-right: 20px;" v-decorator="['a43', {...inputRequired, initialValue: initValue('a43')}]"></a-input>
                  <a-radio-group v-decorator="['a44', {...selectRequired, initialValue: initValue('a44')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="(5) α-1 抗蛋白酶缺乏:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a5', {...require1, initialValue: initValue('a5')}]" @change="changeRadio($event, 'controla5')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla5">
                <a-form-item label="水平:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a51', {...selectRequired, initialValue: initValue('a51')}]">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="2">降低</a-radio>
                    <a-radio value="3">升高</a-radio>
                    <a-radio value="4">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="基因:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a52', {...selectRequired, initialValue: initValue('a52')}]" @change="changeRadio($event, 'controla52')">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="具体描述" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla52">
                  <a-input style="width: 240px;" v-decorator="['a53', {...inputRequired, initialValue: initValue('a53')}]"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(6) 囊性纤维化:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a6', {...require1, initialValue: initValue('a6')}]" @change="changeRadio($event, 'controla6')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla6">
                <a-form-item label="汗液实验:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a61', {...selectRequired, initialValue: initValue('a61')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="基因检查:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a62', {...selectRequired, initialValue: initValue('a62')}]">
                    <a-radio value="1">纯合</a-radio>
                    <a-radio value="2">杂合</a-radio>
                    <a-radio value="3">无突变</a-radio>
                    <a-radio value="4">未测</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="(7) 纤毛功能检测:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a7', {...require1, initialValue: initValue('a7')}]" @change="changeRadio($event, 'controla7')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla7">
                <a-form-item label="FeNOppd:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a71', {...selectRequired, initialValue: initValue('a71')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="糖精试验:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a72', {...selectRequired, initialValue: initValue('a72')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="电镜检测的活检:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a73', {...selectRequired, initialValue: initValue('a73')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分析纤毛摆动频率的活检:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a74', {...selectRequired, initialValue: initValue('a74')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="基因检测:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['a75', {...selectRequired, initialValue: initValue('a75')}]">
                    <a-radio value="1">阳性</a-radio>
                    <a-radio value="2">阴性</a-radio>
                    <a-radio value="3">未测量</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="(8) 其他:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a8', {...inputRequired, initialValue: initValue('a8')}]"></a-input>
              </a-form-item>
              <a-form-item label="(9) 小结：根据实验室检查及既往病史判断:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a9', {...selectRequired, initialValue: initValue('a9', 'array')}]">
                  <a-checkbox value="1">特发性</a-checkbox>
                  <a-checkbox value="2">感染后性</a-checkbox>
                  <a-checkbox value="3">结核后性</a-checkbox>
                  <a-checkbox value="4">原发性纤毛不动</a-checkbox>
                  <a-checkbox value="5">弥漫性泛细支气管炎</a-checkbox>
                  <a-checkbox value="6">ABPA</a-checkbox>
                  <a-checkbox value="7">炎症性肠病</a-checkbox>
                  <a-checkbox value="8">结缔组织病（类风湿性关节炎）</a-checkbox>
                  <a-checkbox value="9">CF</a-checkbox>
                  <a-checkbox value="10">α1-抗胰蛋白酶缺乏</a-checkbox>
                  <a-checkbox value="11">误吸</a-checkbox>
                  <a-checkbox value="12">胃食管返流病</a-checkbox>
                  <a-checkbox value="13">大气道先天性异常</a-checkbox>
                  <a-checkbox value="14">NTM</a-checkbox>
                  <a-checkbox value="15">慢阻肺</a-checkbox>
                  <a-checkbox value="16">哮喘</a-checkbox>
                  <a-checkbox value="17">普通变异性免疫缺陷病（CVID）</a-checkbox>
                  <a-checkbox value="18">血浆抗体缺乏</a-checkbox>
                  <a-checkbox value="19">特异抗体缺乏性</a-checkbox>
                  <a-checkbox value="20" @change="changeSelect($event, 'controla920')">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="具体描述" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controla920">
                <a-input style="width: 240px;" v-decorator="['a91', {...inputRequired, initialValue: initValue('a91')}]"></a-input>
              </a-form-item>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask7',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      markName: 'byxxgjc',
      title: '',
      openKeys: [],
      defaultSelectedKeys: [7],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '630px',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        height: '580px',
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
      byxxgjc: undefined,
      controla1: false,
      controla2: false,
      controla23: false,
      controla25: false,
      controla3: false,
      controla4: false,
      controla5: false,
      controla6: false,
      controla7: false,
      controla52: false,
      controla9: false,
      controla920: false
    }
  },
  created() {
    var that = this
    this.defaultSelectedKeys = [7]
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        if (that.patientBasis.type === 1) {
          that.title = '基线'
        } else if (that.patientBasis.type === 2) {
          that.title = '半年随访'
        } else if (that.patientBasis.type === 3) {
          that.title = '年访视'
        }
      })
    params.append('basisMarkId', this.maskId)
    getBasisForm(params)
      .then(res => {
        if (res.data && res.data.byxxgjc)
          that.byxxgjc = that.dealAnswers(res.data.byxxgjc)
      })
      .catch(error => {
        console.log(error)
      })
  },
  activated() {
    this.defaultSelectedKeys = [7]
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controla23' || t === 'controla25') {
        if (e.target.value === '4') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controla52') {
        if (e.target.value === '3') {
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
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    initValue(key, type = 'normal') {
      if (!this.byxxgjc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.byxxgjc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.byxxgjc[key])
      } else if (type === 'array') {
        return this.byxxgjc[key].split(',')
      } else {
        return this.byxxgjc[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        if (answer.a1 === 1) {
          this.controla1 = true
        }
        if (answer.a2 === 1) {
          this.controla2 = true
        }
        if (answer.a3 === 1) {
          this.controla3 = true
        }
        if (answer.a4 === 1) {
          this.controla4 = true
        }
        if (answer.a5 === 1) {
          this.controla5 = true
        }
        if (answer.a6 === 1) {
          this.controla6 = true
        }
        if (answer.a7 === 1) {
          this.controla7 = true
        }
        if (answer.a23 === 4) {
          this.controla23 = true
        }
        if (answer.a25 === 4) {
          this.controla25 = true
        }
        if (answer.a9)
          var splitArr = answer.a9.split(',')
        if (splitArr.indexOf('20') > -1) {
          this.controla920 = true
        }
      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      re = {
        ...re,
        'a9': typeof re['a9'] !== 'undefined' ? re['a9'].join(',') : ''
      }
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.byxxgjc && this.byxxgjc.byxxgjcId) {
        re.byxxgjcId = this.byxxgjc.byxxgjcId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.$message.success(res.msg, function() {
            location.href = location.href
          })
        })
        .catch(error => {
          console.log(error)
        })
      return false
    }
  }
}
</script>
<style lang="less" scoped>
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