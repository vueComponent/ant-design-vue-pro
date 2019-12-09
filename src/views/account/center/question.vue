<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
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
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleChange">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="head-bar">
              <a-row type="flex">
                <span class="head-icon"></span>
                <div v-if="question.name && question.name" class="question-title">{{question.name}}<span v-if="score">{{`（得分：${score}分）`}}</span></div>
              </a-row>
              <a-row v-if="executeStatus !== 2">
                <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
                <a-button class="btn fr" @click="save">保存</a-button>
              </a-row>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <!-- 调查问卷 -->
              <div v-if="question.remark && question.remark" class="question-des"><span style="color:#3398dc">说明：</span>{{question.remark}}</div>
              <div v-for="item in listArr" :key="item.questionTitleId">
                <div class="question-t">
                  <span class="question-icon"></span>
                  <span>{{item.name}}</span>
                </div>
                <a-form-item class="ques-box" v-for="(qu1, index) in item.childrens" :key="index" :colon="false" :label="qu1.type !== 5 ? qu1.name : ''">
                  <p v-if="qu1.type == 5" class="question-tip">
                    <span class="tip-icon"></span>
                    <span>{{qu1.name}}</span>
                  </p>
                  <a-input v-if="qu1.type === 3" style="width: 200px" :addonAfter="qu1.unit" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? qu1.answers[0].questionOptionValue : null , rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]" />
                  <a-radio-group v-if="qu1.type === 1" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? qu1.answers[0].questionOptionId : null, rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]">
                    <a-radio :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId">{{item.name}}</a-radio>
                  </a-radio-group>
                  <a-checkbox-group v-if="qu1.type === 2" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.inputTypes, rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]">
                    <a-checkbox :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId">{{item.name}}</a-checkbox>
                  </a-checkbox-group>
                  <a-date-picker v-if="qu1.type === 6" :name="qu1.inputType" v-decorator="[qu1.inputType, { initialValue: qu1.answers && qu1.answers.length ? moment(qu1.answers[0].questionOptionValue, 'YYYY/MM/DD') : null, rules: [{ required: qu1.isRequired && qu1.isRequired === 1, message: '该选项必填' }] }]" format="YYYY-MM-DD" :disabledDate="disabledDate" />
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
import { mapActions } from 'vuex'
import { getPatientBasis, getQuestionDetail, saveQuestion } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import { MyIcon } from '@/components/_util/util'

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
        height: 'calc(100% - 70px)'
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
      questionTask: {}
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
          that.executeStatus = _.find(res.data.list[5].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
        }
        if (that.patientBasis.type === 4) {
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
        }
      },
      immediate: true
    }
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
            that.executeStatus = _.find(res.data.list[5].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
          if (that.patientBasis.type === 4) {
            that.title = '急性加重期'
            that.executeStatus = _.find(res.data.list[1].childList, function(v) { return v.basisMarkId === that.questionId }).executeStatus
          }
        })
      if (e.key >= 31 && e.key <= 42 || (e.key >= 57 && e.key <= 62) || (e.key >= 45 && e.key <= 50)) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else if (this.patientBasis.type === 1) {
        this.$router.replace('/list/basis/' + this.patientBasisId + '/' + e.key)
      } else if (this.patientBasis.type === 4) {
        this.$router.replace('/jxjzq/' + this.patientBasisId)
      } else {
        this.$router.replace('/list/task/' + this.patientBasisId + '/' + e.key)
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
          that.score = res.data.questionTask && res.data.questionTask.score
          if (res.data.isFinish === '0') {
            that.questionFinished = false
          } else {
            that.questionFinished = true
          }
        })
    },
    initQuestionAnswers(list) {
      _.each(list, function (a) {
        if (a.childrens && a.childrens.length) {
          _.each(a.childrens, function (b) {
            if (b.type === 2) {
              if (b.answers && b.answers.length) {
                b.inputTypes = _.map(b.answers, function (v) { return v.questionOptionId })
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
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          const that = this
          var result = this.generateQuestionAnswers()
          var params = new URLSearchParams()
          params.append('answers', JSON.stringify(result))
          params.append('patientBasisId', this.patientBasisId)
          params.append('questionId', this.questionId)
          params.append('patientId', this.patient.patientId)
          params.append('type', 2)
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
                  that.defaultSelectedKeys = [that.questionId]
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
            if(sub.type === 2 && sub.options && sub.options.length) {
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
              that.defaultSelectedKeys = [that.questionId]
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

  /deep/ .ant-btn {
    // height: 40px;
    // padding: 0 20px;
    // font-size: 16px;
    margin-top: 12px;
  }

  .question-title {
    font-size: 30px;
    color: #3398dc;
    font-weight: bold;
    margin-left: 15px;
  }

  .head-icon {
    width: 50px;
    height: 50px;
    background-image: url('../../../assets/head-icon.png');
    background-size: 100% 100%;
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

    // .title {
    //   background-color: #f7f8f8;
    //   font-weight: bold;
    //   font-size: 16px;
    //   color: #231815;
    //   padding-left: 15px;
    //   border-top: 1px solid #eee;
    //   border-bottom: 1px solid #eee;
    //   height: 40px;
    //   line-height: 40px;
    // }

    padding: 20px;

    // .ant-form-item {
    //   // padding-bottom: 10px;
    //   // padding-top: 10px;
    //   margin-bottom: 0px;
    //   border-bottom: 1px solid #eee;

    //   &.no-border {
    //     border-bottom: none;
    //     padding-top: 0;
    //     padding-bottom: 0;
    //   }

    //   &:hover {}

    //   &.border-dotted {
    //     border-bottom: 1px dotted #eee;
    //   }
    // }

    // /deep/ .ant-form-item-label {
    //   text-align: left;
    //   line-height: 56px;
    //   white-space: inherit;

    //   label:after {
    //     content: '';
    //   }

    //   &.ant-col-md-24 label {
    //     display: block;
    //     background-color: #f7f8f8;
    //     font-weight: bold;
    //     font-size: 16px;
    //     color: #231815;
    //     padding-left: 15px;
    //     border-top: 1px solid #eee;
    //     height: 36px;
    //     line-height: 36px;
    //   }
    // }

    // /deep/ .ant-form-item-control-wrapper .ant-form-item-control {
    //   line-height: 56px;
    // }

    // .formSubtitle {
    //   height: 50px;
    //   line-height: 50px;
    //   font-weight: bold;
    //   font-size: 16px;
    //   padding-left: 10px;
    //   margin-bottom: 0px;
    //   background: #fafcfd;
    //   border-bottom: 1px solid #f3f3f3;
    // }

    // .itemRow:hover {
    //   background-color: #e6f7ff;
    // }
  }
}

.question-title {
  text-align: center;
  font-size: 22px;
  color: #3398DC;
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
}
</style>