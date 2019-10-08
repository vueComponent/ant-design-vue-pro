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
    <a-card :bordered="false" :bodyStyle="bodyStyle" style="margin-top: 10px;padding-left: 0">
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
              <div class="title">1.体格检查</div>
              <a-form-item label="(1) T:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a1', {...inputRequired, initialValue: initValue('a1')}]" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(2) BP:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a2', {...inputRequired, initialValue: initValue('a2')}]" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(3) R:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a3', {...inputRequired, initialValue: initValue('a3')}]" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(4) HR:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a4', {...inputRequired, initialValue: initValue('a4')}]" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(5) SpO2:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a5', {...inputRequired, initialValue: initValue('a5')}]" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(6) 身高:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a6', {...inputRequired, initialValue: initValue('a6')}]" style="width: 240px;" addonAfter="cm" @change="computBMI"></a-input>
              </a-form-item>
              <a-form-item label="(7) 体重:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a7', {...inputRequired, initialValue: initValue('a7')}]" style="width: 240px;" addonAfter="kg" @change="computBMI"></a-input>
              </a-form-item>
              <a-form-item label="(8) BMI(自动演算出):" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input v-decorator="['a8', {...inputRequired, initialValue: initValue('a8')}]" :readOnly="true" style="width: 240px;"></a-input>
              </a-form-item>
              <a-form-item label="(9) 肺部体征：双肺呼吸音:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="啰音" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['a9', {...require2, initialValue: initValue('a9')}]" @change="changeRadio($event, 'controla9')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla9">
                <a-form-item label="啰音类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['a91', {...selectRequired, initialValue: initValue('a91')}]">
                    <a-radio value="1">湿罗音</a-radio>
                    <a-radio value="2">干啰音</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="啰音部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['a92', {...inputRequired, initialValue: initValue('a92')}]"></a-input>
                </a-form-item>
              </div>
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
import { getPatientBasis, saveBasis, getBasisForm, computeScore } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask2',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      markName: 'tgjc',
      title: '',
      openKeys: [],
      defaultSelectedKeys: [2],
      orgTree: [],
      patient: {},
      patientBasis: {},
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      baselineInfoStyle: {
        overflow: "auto",
        height: (window.screen.height - 330) + 'px',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        height: (window.screen.height - 350) + 'px',
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
      controla9: false,
      tgjc: undefined
    }
  },
  created() {
    var that = this
    this.defaultSelectedKeys = [2]
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
        if (res.data && res.data.tgjc)
          that.tgjc = that.dealAnswers(res.data.tgjc)
      })
      .catch(error => {
        console.log(error)
      })
  },
  activated() {
    this.defaultSelectedKeys = [2]
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controlb191') {
        if (e.target.value === '1' || e.target.value === '2') {
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
      if (!this.tgjc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.tgjc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.tgjc[key])
      } else if (type === 'array') {
        return this.tgjc[key].split(',')
      } else {
        return this.tgjc[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        if (answer.a9 === '1') {
          this.controla9 = true
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
      if (this.tgjc && this.tgjc.tgjcId) {
        re.tgjcId = this.tgjc.tgjcId
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
    },
    computBMI() {
      var that = this
      var height = this.form.getFieldValue('a6')
      var weight = this.form.getFieldValue('a7')
      if (height && weight) {
        var params = new URLSearchParams()
        params.append('scoreType', 'bmi')
        params.append('tgjcStr', JSON.stringify({ a_6: height, a_7: weight }))
        computeScore(params)
          .then(res => {
            console.log(res.data.a8)
            that.form.setFieldsValue({
              a8: res.data.a8
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
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