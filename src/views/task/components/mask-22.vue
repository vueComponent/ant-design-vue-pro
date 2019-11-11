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
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
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
              <div class="title">1.病因学相关检查</div>
              <a-form-item label="(1) 在过去1年中是否做过肺功能测试:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['a1', {...require1, initialValue: initValue('a1')}]" @change="changeRadio($event, 'controla1')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="不做原因:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controla1n" class="border-dotted">
                <a-input style="width: 240px;" v-decorator="['a11', {...inputRequired, initialValue: initValue('a11')}]" autocomplete="off"></a-input>
              </a-form-item>
              <div v-if="controla1p">
                <div style="margin-top: 10px;">吸入支气管舒张剂前:<a-button class="btn" style="margin-left: 150px;float: right;" @click="_importQ">导入</a-button>
                </div>
                <a-form-item label="报告上传 :" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <div class="clearfix" style="margin-top: 10px;">
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
                <a-form-item label="FEV1:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['a21', {...require2, initialValue: initValue('a21')}]" @change="changeRadio($event, 'controla21')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla21" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a22', {...inputRequired, initialValue: initValue('a22')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FEV1%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['a31', {...require2, initialValue: initValue('a31')}]" @change="changeRadio($event, 'controla31')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla31" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a32', {...inputRequired, initialValue: initValue('a32')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FVC:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['a41', {...require2, initialValue: initValue('a41')}]" @change="changeRadio($event, 'controla41')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla41" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a42', {...inputRequired, initialValue: initValue('a42')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FVC%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['a51', {...require2, initialValue: initValue('a51')}]" @change="changeRadio($event, 'controla51')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla51" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a52', {...inputRequired, initialValue: initValue('a52')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FEV1/FVC%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['a61', {...require2, initialValue: initValue('a61')}]" @change="changeRadio($event, 'controla61')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla61" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a62', {...inputRequired, initialValue: initValue('a62')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <div style="margin-top: 10px;">吸入支气管舒张剂后:<a-button class="btn" style="margin-left: 150px;float: right;" @click="_importH">导入</a-button>
                </div>
                <a-form-item label="报告上传 :" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
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
                <a-form-item label="FEV1:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['b23', {...require2, initialValue: initValue('b23')}]" @change="changeRadio($event, 'controlb23')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb23" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b24', {...inputRequired, initialValue: initValue('b24')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FEV1%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['b33', {...require2, initialValue: initValue('b33')}]" @change="changeRadio($event, 'controlb33')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb33" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b34', {...inputRequired, initialValue: initValue('b34')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FVC:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['b43', {...require2, initialValue: initValue('b43')}]" @change="changeRadio($event, 'controlb43')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb43" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b44', {...inputRequired, initialValue: initValue('b44')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FVC%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['b53', {...require2, initialValue: initValue('b53')}]" @change="changeRadio($event, 'controlb53')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb53" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b54', {...inputRequired, initialValue: initValue('b54')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="FEV1/FVC%pred:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" style="border: none;">
                  <a-radio-group v-decorator="['b63', {...require2, initialValue: initValue('b63')}]" @change="changeRadio($event, 'controlb63')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb63" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b64', {...inputRequired, initialValue: initValue('b64')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(2) 是否还有其他肺功能数据:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['c1', {...require1, initialValue: initValue('c1')}]" @change="changeRadio($event, 'controlc1')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlc1">
                <a-form-item label="Total Lung Capacity:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c11', {...require2, initialValue: initValue('c11')}]" @change="changeRadio($event, 'controlc11')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlc11">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['c12', {...inputRequired, initialValue: initValue('c12')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="Diffusing capacity（DLCO）:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c21', {...require2, initialValue: initValue('c21')}]" @change="changeRadio($event, 'controlc21')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlc21">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['c22', {...inputRequired, initialValue: initValue('c22')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="Residual Volume:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c31', {...require2, initialValue: initValue('c31')}]" @change="changeRadio($event, 'controlc31')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlc31">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['c32', {...inputRequired, initialValue: initValue('c32')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="Inspiratory capacity（DLCO）:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c41', {...require2, initialValue: initValue('c41')}]" @change="changeRadio($event, 'controlc41')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="具体数值:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlc41">
                  <a-input addonAfter="L" style="width: 240px;" v-decorator="['c42', {...inputRequired, initialValue: initValue('c42')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(3) 肺功能结论:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['e1', {...require1, initialValue: initValue('e1')}]" @change="changeRadio($event, 'controle1')">
                  <a-radio value="1">通气功能正常</a-radio>
                  <a-radio value="-1">通气功能减退</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="通气功能减退类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controle1">
                <a-radio-group v-decorator="['e12', {...require1, initialValue: initValue('e12')}]">
                  <a-radio value="1">阻塞性</a-radio>
                  <a-radio value="2">限制性</a-radio>
                  <a-radio value="3">混合型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 呼出气一氧化氮(eNO):" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-input addonAfter="ppb" style="width: 240px;" v-decorator="['f1', {...inputRequired, initialValue: initValue('f1')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 6分钟步行试验总距离:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-input addonAfter="m" style="width: 240px;" v-decorator="['g2', {...inputRequired, initialValue: initValue('g2')}]" autocomplete="off"></a-input>
              </a-form-item>
              <div style="margin-top: 10px;">开始时:</div>
              <a-form-item label="血压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input addonAfter="mmhg" style="width: 240px;" v-decorator="['g21', {initialValue: initValue('g21')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="HR:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input addonAfter="次/分" style="width: 240px;" v-decorator="['g22', {initialValue: initValue('g22')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧饱和度:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input addonAfter="%" style="width: 240px;" v-decorator="['g23', {initialValue: initValue('g23')}]" autocomplete="off"></a-input>
              </a-form-item>
              <div style="margin-top: 10px;">结束时:</div>
              <a-form-item label="血压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input addonAfter="mmhg" style="width: 240px;" v-decorator="['g31', {initialValue: initValue('g31')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="HR:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input addonAfter="次/分" style="width: 240px;" v-decorator="['g32', {initialValue: initValue('g32')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧饱和度:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="%" style="width: 240px;" v-decorator="['g33', {initialValue: initValue('g33')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 血气分析:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="PH:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['h1', {...inputRequired, initialValue: initValue('h1')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧分压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['h2', {...inputRequired, initialValue: initValue('h2')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="二氧化碳分压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['h3', {...inputRequired, initialValue: initValue('h3')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="肺动脉氧分压差:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['h4', {...inputRequired, initialValue: initValue('h4')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧饱和度:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['h5', {...inputRequired, initialValue: initValue('h5')}]" autocomplete="off"></a-input>
              </a-form-item>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="spinning"></a-spin>
    <select-report ref="selectModule" @listen="confirmSelect" />
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm, getFsImportDate } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import SelectReport from '@/views/task/SelectReport'
export default {
  name: 'task22',
  components: {
    STree,
    MyIcon,
    SelectReport
  },
  data() {
    return {
      markName: 'fgnxgjc',
      title: '',
      openKeys: [],
      defaultSelectedKeys: [22],
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
      fgnxgjc: undefined,
      controla1p: false,
      controla1n: false,
      controla21: false,
      controla31: false,
      controla41: false,
      controla51: false,
      controla61: false,
      controlb23: false,
      controlb33: false,
      controlb43: false,
      controlb53: false,
      controlb63: false,
      controlc1: false,
      controlc11: false,
      controlc21: false,
      controlc31: false,
      controlc41: false,
      controle1: false,
      spinning: false,
      executeStatus: false,
      previewVisible1: false,
      previewImage1: '',
      previewVisible2: false,
      previewImage2: '',
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList1: [],
      fileList2: []
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
        that.title = '年访视'
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
          if (res.data && res.data.fgnxgjc) {
            that.fgnxgjc = that.dealAnswers(res.data.fgnxgjc)
          }
          if (res.data.annexListQ && res.data.annexListQ.length) {
            that.fileList1 = _.map(res.data.annexListQ, function(v) {
              return {
                uid: v.annexId,
                url: that.viewPicUrl + v.annexAddress,
                name: v.annexAddress,
                status: 'done'
              }
            })
          }
          if (res.data.annexListH && res.data.annexListH.length) {
            that.fileList2 = _.map(res.data.annexListH, function(v) {
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
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controla1') {
        if (e.target.value === '1') {
          this.controla1p = true
          this.controla1n = false
        } else {
          this.controla1n = true
          this.controla1p = false
        }
      } else if (t === 'controle1') {
        if (e.target.value === '-1') {
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
          if (this.fgnxgjc && this.fgnxgjc.fgnxgjcId) {
            re.fgnxgjcId = this.fgnxgjc.fgnxgjcId
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
              that.$message.success(res.msg)
              that.spinning = false
              that.getFormData()
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
      if (!this.fgnxgjc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.fgnxgjc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.fgnxgjc[key])
      } else if (type === 'array') {
        return this.fgnxgjc[key].split(',')
      } else {
        return this.fgnxgjc[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        if (answer.a1 === 1) {
          this.controla1p = true
          this.controla1n = false
        } else if (answer.a1 === -1) {
          this.controla1p = false
          this.controla1n = false
        }
        if (answer.a21 === 1) {
          this.controla21 = true
        }
        if (answer.a31 === 1) {
          this.controla31 = true
        }
        if (answer.a41 === 1) {
          this.controla41 = true
        }
        if (answer.a51 === 1) {
          this.controla51 = true
        }
        if (answer.a61 === 1) {
          this.controla61 = true
        }
        if (answer.b23 === 1) {
          this.controlb23 = true
        }
        if (answer.b33 === 1) {
          this.controlb33 = true
        }
        if (answer.b43 === 1) {
          this.controlb43 = true
        }
        if (answer.b53 === 1) {
          this.controlb53 = true
        }
        if (answer.b63 === 1) {
          this.controlb63 = true
        }
        if (answer.c1 === 1) {
          this.controlc1 = true
        }
        if (answer.c11 === 1) {
          this.controlc11 = true
        }
        if (answer.c21 === 1) {
          this.controlc21 = true
        }
        if (answer.c31 === 1) {
          this.controlc31 = true
        }
        if (answer.c41 === 1) {
          this.controlc41 = true
        }
        if (answer.e1 === -1) {
          this.controle1 = true
        }
      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.fgnxgjc && this.fgnxgjc.fgnxgjcId) {
        re.fgnxgjcId = this.fgnxgjc.fgnxgjcId
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
          that.$message.success(res.msg)
          that.spinning = false
          that.getFormData()
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
    },
    _importQ() {
      this.$refs.selectModule.add(this.patient.patientId, 53)
    },
    _importH() {
      this.$refs.selectModule.add(this.patient.patientId, 54)
    },
    confirmSelect(data) {
      var that = this
      console.log(data)
      var params = new URLSearchParams()
      params.append('reportCollectDetailId', data.reportCollectDetailId)
      getFsImportDate(params)
        .then(res => {
          console.log(res.data)
          that.fgnxgjc = _.extend(that.fgnxgjc || {}, that.dealAnswers(res.data.fgnxgjc))
          if (res.data.annexList && res.data.annexList.length) {
            if (res.data.annexList[0].businessType === 3) {
              that.fileList1 = _.map(res.data.annexList, function(v) {
                return {
                  uid: v.annexId,
                  url: that.viewPicUrl + v.annexAddress,
                  name: v.annexAddress,
                  status: 'done'
                }
              })
            } else {
              that.fileList2 = _.map(res.data.annexList, function(v) {
                return {
                  uid: v.annexId,
                  url: that.viewPicUrl + v.annexAddress,
                  name: v.annexAddress,
                  status: 'done'
                }
              })
            }
          }
        })
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
  height: 100%;
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