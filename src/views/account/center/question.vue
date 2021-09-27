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
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleChange">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="head-bar">
              <a-row type="flex" style="flex:1">
                <span class="head-icon"></span>
                <div v-if="question.name && question.name" class="question-title">{{question.name}}</div>
                <span v-if="score" class="question-score">{{`（得分：${score}分）`}}</span>
                <a-row v-if="(questionId === 32 || questionId === 38 || questionId === 46 || questionId === 58 || questionId === 66) && (questionTask.status === 1 || questionTask.status === 5) && typeof questionTask.score1 !== 'undefined'" type="flex" style="flex:1;margin-left:40px">
                  <a-col :span="6"><strong>身体功能性维度（<span style="color: #3398dc">{{ questionTask.score1 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>角色功能性维度（<span style="color: #3398dc">{{ questionTask.score2 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>活力性维度（<span style="color: #3398dc">{{ questionTask.score3 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>情绪功能性维度（<span style="color: #3398dc">{{ questionTask.score4 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>社会功能性维度（<span style="color: #3398dc">{{ questionTask.score5 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>医疗负担性维度（<span style="color: #3398dc">{{ questionTask.score6 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>健康感觉性维度（<span style="color: #3398dc">{{ questionTask.score7 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>呼吸症状性维度（<span style="color: #3398dc">{{ questionTask.score8 }}分</span>）</strong></a-col>
                </a-row>
                <a-row v-if="(questionId === 33 || questionId === 59) && questionTask.status === 1 && typeof questionTask.score1 !== 'undefined'" type="flex" align="middle" style="flex:1;margin-left:40px;">
                  <a-col :span="6"><strong>症状symptom（<span style="color: #3398dc">{{ questionTask.score1 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>活动activity（<span style="color: #3398dc">{{ questionTask.score2 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>影响impact（<span style="color: #3398dc">{{ questionTask.score3 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>合计（<span style="color: #3398dc">{{ questionTask.score }}分</span>）</strong></a-col>
                </a-row>
                <a-row v-if="(questionId === 35 || questionId === 41 || questionId === 61) && questionTask.status === 1 && typeof questionTask.score1 !== 'undefined'" type="flex" align="middle" style="flex:1;margin-left:40px;">
                  <a-col :span="6"><strong>生理（<span style="color: #3398dc">{{ questionTask.score1 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>心理（<span style="color: #3398dc">{{ questionTask.score2 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>社会（<span style="color: #3398dc">{{ questionTask.score3 }}分</span>）</strong></a-col>
                  <a-col :span="6"><strong>合计（<span style="color: #3398dc">{{ questionTask.score }}分</span>）</strong></a-col>
                </a-row>
              </a-row>
              <a-row type="flex" align="middle" class="btn-group" v-if="executeStatus !== 2 && questionTask.status !== 5 && canEdit">
                <a-button class="btn fr" @click="save">保存</a-button>
                <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              </a-row>
            </div>
            <!-- <a-form-item class="ques-box date" :colon="false" label="问卷调查时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
              <a-date-picker placeholder="请选择" v-decorator="['taskTime', {...dateRequire, initialValue: questionTask.taskTime ? moment(questionTask.taskTime): ''}]" :disabledDate="disabledDate" style="width: 240px;"></a-date-picker>
            </a-form-item> -->
            <div class="baselineForm" :style="baselineFormStyle">
              <!-- 调查问卷 -->
              <div v-if="question.remark && question.remark" class="question-des"><span style="color:#3398dc">说明：</span>{{question.remark}}</div>
              <div v-for="item in listArr" :key="item.questionTitleId">
                <div class="question-t">
                  <span class="question-icon"></span>
                  <span>{{item.name}}</span>
                </div>
                <div v-for="(qu1, index) in item.childrens" :key="index">
                  <div v-if="showFlag || [37,38,39].indexOf(parseInt(qu1.inputType)) < 0">
                    <a-form-item class="ques-box" :colon="false" :label="qu1.type !== 5 ? qu1.name : ''">
                      <p v-if="qu1.type == 5" class="question-tip">
                        <span class="tip-icon"></span>
                        <span>{{qu1.name}}</span>
                      </p>
                      <a-input v-if="qu1.type === 3" style="width: 200px" :addonAfter="qu1.unit" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? qu1.answers[0].questionOptionValue : null , rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]" />
                      <a-radio-group @change="handleClick" v-if="qu1.type === 1" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? qu1.answers[0].questionOptionId : (qu1.questionTitleId === 16 ? (patient.sex === 0 ? 76 : 75) : null), rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]">
                        <a-radio :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId">{{item.name}}</a-radio>
                      </a-radio-group>
                      <a-checkbox-group v-if="qu1.type === 2" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.inputTypes, rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]">
                        <a-checkbox :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId">{{item.name}}</a-checkbox>
                      </a-checkbox-group>
                      <a-date-picker v-if="qu1.type === 6" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? moment(qu1.answers[0].questionOptionValue, 'YYYY/MM/DD') : (qu1.questionTitleId === 15 ? moment(patient.birthDate) : null), rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]" format="YYYY-MM-DD" :disabledDate="disabledDate" />
                    </a-form-item>
                  </div>
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
import { mapActions } from 'vuex'
import { getPatientBasis, getQuestionDetail, saveQuestion } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import { MyIcon } from '@/components/_util/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'BasisQuestion',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        paddingRight: "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      baselineFormStyle: {
        overflow: 'auto',
        padding: '20px 20px 80px',
        height: 'calc(100% - 150px)'
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 }
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 }
      },
      title: '',
      openKeys: [],
      defaultSelectedKeys: [],
      orgTree: [],
      patient: {},
      patientBasis: {},
      question: {},
      score: "",
      patientBasisId: parseInt(this.$route.params.id),
      questionId: parseInt(this.$route.params.qid),
      form: this.$form.createForm(this),
      listArr: [],
      questionFinished: false,
      disBlock: {
        display: 'block'
      },
      spinning: false,
      executeStatus: false,
      questionTask: {},
      showFlag: true,
      selectedKeys: [],
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      dateRequire: {
        rules: [{ type: 'object', required: true, message: '请选择时间！' }]
      }
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
        that.defaultSelectedKeys = [that.questionId]
        that.canEdit = that.$ls.get(ACCESS_TOKEN).centerId === that.patient.targetCenterId
        if (that.patientBasis.type === 1) {
          that.title = '基线'
          that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
        if (that.patientBasis.type === 2) {
          that.title = '半年随访'
          that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
        if (that.patientBasis.type === 3) {
          that.title = '年访视'
          that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
        if (that.patientBasis.type === 4) {
          that.title = '急性加重期'
          that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
        if (that.patientBasis.type === 7) {
          that.title = '急性加重期'
          that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
      })
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.name === 'BasisQuestion') {
          this.questionId = parseInt(to.params.qid)
          this.getFormData()
          this.defaultSelectedKeys = this.selectedKeys = [this.questionId]
          document.querySelector('.baselineForm').scrollTop = 0
        }
      },
      immediate: true
    }
  },
  activated() {
    // console.log(document.querySelector('.baselineForm').scrollTop)
  },
  mounted() {
    console.log(document.querySelector('.baselineForm').scrollTop)
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    handleChange(e) {
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      var that = this
      getPatientBasis(params)
        .then(res => {
          that.patientBasis = res.data.patientBasis
          if (that.patientBasis.type === 1) {
            that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
          if (that.patientBasis.type === 2) {
            that.title = '半年随访'
            that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
          if (that.patientBasis.type === 3) {
            that.title = '年访视'
            that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
          if (that.patientBasis.type === 4) {
            that.title = '急性加重期'
            that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
          if (that.patientBasis.type === 7) {
            that.title = '急性加重期'
            that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
        })
      if (e.key >= 31 && e.key <= 42 || (e.key >= 57 && e.key <= 62) || (e.key >= 45 && e.key <= 50) || (e.key > 64)) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else if (this.patientBasis.type === 1) {
        this.$router.replace('/list/basis/' + this.patientBasisId + '/' + e.key)
      } else if (this.patientBasis.type === 4) {
        this.$router.replace('/jxjzq/' + this.patientBasisId)
      } else if(this.patientBasis.type === 7){
        this.$router.replace('/icon/jxjzq/' + this.patientBasisId)
      }else {
        this.$router.replace('/list/task/' + this.patientBasisId + '/' + e.key)
      }
    },
    handleClick(e) {
      if (e.target.value == '149') {
        this.showFlag = false
      } else if (e.target.value == '148') {
        this.showFlag = true
      }
    },
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('questionId', this.questionId)
      params.append('patientBasisId', this.patientBasisId)
      getQuestionDetail(params)
        .then(res => {
          that.spinning = false
          that.listArr = that.initQuestionAnswers(res.data.topTitles)
          that.question = res.data.question
          that.questionTask = res.data.questionTask || {}
          that.score = that.questionId !== 33 && that.questionId !== 59 && res.data.questionTask && res.data.questionTask.score
          if (res.data.isFinish === '0') {
            that.questionFinished = false
          } else {
            that.questionFinished = true
          }
        })
    },
    initQuestionAnswers(list) {
      _.each(list, function(a) {
        if (a.childrens && a.childrens.length) {
          _.each(a.childrens, function(b) {
            if (b.type === 2) {
              if (b.answers && b.answers.length) {
                b.inputTypes = _.map(b.answers, function(v) { return v.questionOptionId })
              } else {
                b.inputTypes = []
              }
            }
          })
        }
      })
      return list
    },
    handleSubmit(e) {
      e.preventDefault()
      this.spinning = true
      const { form: { validateFieldsAndScroll } } = this
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          const that = this
          var result = this.generateQuestionAnswers()
          var params = new URLSearchParams()
          params.append('answers', JSON.stringify(result))
          params.append('patientBasisId', this.patientBasisId)
          params.append('questionId', this.questionId)
          params.append('patientId', this.patient.patientId)
          params.append('type', 2)
          params.append('taskTime', typeof values.taskTime !== 'undefined' ? values.taskTime.format('YYYY-MM-DD'): '')
          saveQuestion(params)
            .then(res => {
              that.spinning = false
              that.$message.success(res.msg)
              that.getFormData()
              params = new URLSearchParams()
              params.append('patientBasisId', this.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.selectedKeys = [that.questionId]
                  if (that.patientBasis.type === 1) {
                    that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
                  } else if (that.patientBasis.type === 2 || that.patientBasis.type === 4) {
                    that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
                  } else if (that.patientBasis.type === 3) {
                    that.executeStatus = _.find(res.data.list[5].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
                  }
                })
            })
        } else {
          this.spinning = false
        }
      })
    },
    generateQuestionAnswers() {
      let that = this
      var result = []
      var titleObject = {}
      var childrenObject = []
      var subOp = {}
      _.each(this.listArr, function(title) {
        titleObject = {
          options: []
        }
        titleObject.titleId = title.inputType
        childrenObject = []
        if (title.childrens && title.childrens.length) {
          _.each(title.childrens, function(sub) {
            if (sub.type === 3) {
              childrenObject.push({
                titleId: sub.inputType,
                value: $('input[name="' + sub.inputType + '"]').val()
              })
            }
            if (sub.type === 6) {
              childrenObject.push({
                titleId: sub.inputType,
                value: $('[name="' + sub.inputType + '"] input').val()
              })
            }
            if (sub.type === 2 && sub.options && sub.options.length) {
              // console.log(that.form.getFieldValue(sub.inputType))
              subOp = {
                titleId: sub.inputType,
                options: []
              }
              if (that.form.getFieldValue(sub.inputType) != null) {
                that.form.getFieldValue(sub.inputType).forEach(item => {
                  subOp.options.push({
                    questionTitleId: sub.inputType,
                    questionOptionId: item
                  })
                })
              }
              childrenObject.push(subOp)
            }
            if ((sub.type === 1) && sub.options && sub.options.length) {
              subOp = {
                titleId: sub.inputType,
                options: []
              }
              $('input[name="' + sub.inputType + '"]:checked').each(function() {
                console.log("checked......");

                subOp.options.push({
                  questionTitleId: sub.inputType,
                  questionOptionId: $(this).val()
                })
                console.log($(this).val());

              })
              childrenObject.push(subOp)
            }
          })
        }
        titleObject.childrens = childrenObject
        result.push(titleObject)
      })
      return result
    },
    save() {
      const that = this
      var result = this.generateQuestionAnswers()
      console.log(result)
      var params = new URLSearchParams()
      params.append('answers', JSON.stringify(result))
      params.append('patientBasisId', this.patientBasisId)
      params.append('questionId', this.questionId)
      params.append('patientId', this.patient.patientId)
      params.append('type', 1)
      this.spinning = true
      saveQuestion(params)
        .then(res => {
          that.spinning = false
          that.getFormData()
          that.$message.success(res.msg)
          params = new URLSearchParams()
          params.append('patientBasisId', this.patientBasisId)
          getPatientBasis(params)
            .then(res => {
              that.orgTree = res.data.list
              that.selectedKeys = [that.questionId]
              if (that.patientBasis.type === 1) {
                that.executeStatus = _.find(res.data.list[4].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
              } else if (that.patientBasis.type === 2 || that.patientBasis.type === 4) {
                that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
              } else if (that.patientBasis.type === 3) {
                that.executeStatus = _.find(res.data.list[5].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
              }
            })
        })
        .catch(error => {
          that.spinning = false
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

  & .ant-spin-dot {
    position: absolute;
    top: 55%;
    left: 50%;
  }
}

.head-bar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7ffff;
  border: 2px solid #079ce9;
  box-shadow: 4px 4px 0px #b9b4ac;
  margin: 10px 20px 0;
  padding: 0 15px;

  .head-icon {
    width: 50px;
    height: 50px;
    background-image: url('../../../assets/head-icon.png');
    background-size: 100% 100%;
  }

  .question-title {
    font-size: 30px;
    color: #3398dc;
    font-weight: bold;
    margin-left: 15px;
  }

  .question-score {
    font-size: 30px;
    color: #3398dc;
    font-weight: bold;
  }
}

.btn-group {
  width: 140px;
  justify-content: space-between;
}

/deep/ #baselineHeader {
  .ant-card-body {
    padding: 10px
  }
}

.ant-row.ant-form-item:hover {
  background-color: #e6f7ff;
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

  &.date {
    height: auto;
    margin-top: 20px;

    .ant-form-item-label {
      background-color: transparent;
      border-top: none;
    }
  }
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

  .baselineForm {

    overflow: auto;

    padding: 40px 20px;
  }
}

.question-des {
  font-size: 16px;
  margin-bottom: 30px;
}

.question-t {
  display: flex;
  line-height: 40px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 2px solid #3398dc;
  padding-bottom: 5px;

  .question-icon {
    width: 40px;
    height: 40px;
    background-image: url('../../../assets/question-icon.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }
}

.question-tip {
  line-height: 40px;
  display: flex;
  margin-top: 12px;

  .tip-icon {
    width: 30px;
    height: 40px;
    background-image: url('../../../assets/tip-icon.png');
    background-size: 60% 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
}

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}

/deep/ .ant-radio-disabled+span {
  color: inherit;
}

/deep/.ant-checkbox-disabled+span {
  color: inherit;
}

.question-des {
  font-size: 16px;
  margin-bottom: 25px;
}

.question-t {
  display: flex;
  line-height: 40px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 2px solid #3398dc;
  padding-bottom: 5px;

  .question-icon {
    width: 40px;
    height: 40px;
    background-image: url('../../../assets/question-icon.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }
}

.question-tip {
  height: 50px;
  display: flex;
  align-items: center;

  .tip-icon {
    width: 20px;
    height: 20px;
    background-image: url('../../../assets/tip-icon.png');
    background-size: 100% 100%;
    margin-right: 5px;
  }
}

.ant-form-item {
  margin-bottom: 0px;
  border-bottom: 1px solid #eee;
}

/deep/ .ant-form-item-label {
  text-align: left;
  display: block;
  background-color: #f7f8f8;
  color: #231815;
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
  border-top: 1px solid #eee;
}

/deep/ .ant-form-item-control-wrapper {
  padding: 5px 0;
  padding-left: 20px;

  label {
    margin: 5px 0;
  }
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;

  .time-span {
    line-height: 50px;
    color: #3398dc;
    margin-left: 10px;
    font-weight: 500;
  }
}
</style>