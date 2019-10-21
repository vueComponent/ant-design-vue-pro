<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="4" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhe_huaban" />
          受访者:{{ patient.name }}
        </a-col>
        <a-col :md="6" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzheng_huaban" />
          {{ patient.card }}
        </a-col>
        <a-col :md="13" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19">
          <!-- 支扩病史资料 -->
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import { mapActions } from 'vuex'
import { getPatientBasis, getElementsAnswer, getMedicineAllergyList, computeScore, getAllQuestionList, saveQuestion, getVtList, importVtData } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import { MyIcon } from '@/components/_util/util'

const columns = [{
    title: '档案号',
    dataIndex: 'fileCode'
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName'
  },
  {
    title: '计划日期',
    dataIndex: 'planDate',
    customRender: planDate => moment(planDate).format('YYYY-MM-DD')
  }
]
export default {
  name: 'taskTotal',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      columns,
      destroyOnClose: true,
      baselineInfoStyle: {
        overflow: "auto",
        height: '486px',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        height: '444px',
      },
      optionDataSource: [],
      checkedList: [],
      title: '',
      openKeys: [],
      defaultSelectedKeys: [],
      orgTree: [],

      visible: false,
      confirmLoading: false,
      patient: {},
      patientBasis: {},
      list: [],
      listArr: [],
      list1: [],
      question: {},
      patientBasisId: this.$route.params.id,
      basisMaskId: -1,
      validateFlag: false,
      disBlock: {
        display: 'block',
      },
      answersList: [],
      questionFinished: false,
      importData: [],
      pagination: {
        defaultPageSize: 5,
        pageSize: 5,
        hideOnSinglePage: true,
        total: 0
      },
      loading: false,
      columns,
      visible: false,
      confirmLoading: false,
      centered: true,
      selectedRows: {}

    }
  },
  beforeCreate() {},
  created() {
    var that = this
    this.CloseSidebar()
    // this.compute = _.debounce(this.compute, 300) //节流阀
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.title = '年访视'
        that.basisMaskId = that.orgTree[0].basisMarkId
        that.defaultSelectedKeys = [that.basisMaskId]
        that.$router.replace('/list/task/' + that.patientBasisId + '/' + that.basisMaskId)
      })
  },
  computed: {
    validate() {
      return function(index) {
        if (!this.validateFlag) return ''
        var first = this.list[index]
        if (first.required > 0) return 'error'
      }
    },
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      };
    },
    aa() {
      return parseInt(this.patientBasisId)
    }
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'control_b_19_1') {
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
    showList(e, type, name) {
      if (type !== 'showList') return;
      if (e.target.checked) {
        if (name == "其他") return;
        this.getMedicineAllergyList(name, e.target.value)
      } else {
        this.$set(this.optionDataSource, e.target.value, [])
      }

    },
    setUpload() {

      this[1445] = 1
      this[4904] = "3.19"
      //       this.4903=1
      //       this.4903=1
      //       this.4903=1
      //       this.4903=1
      //       this.4903=1
      // 4904: 
      // 4905: 1
      // 4906: "96.6"
      // 4907: 1
      // 4908: "4.05"
      // 4909: 1
      // 4910: "98.4"
      // 4911: 1
      // 4912: "103.1"
    },
    getMedicineAllergyList(value, index) {
      const that = this
      const params = new URLSearchParams()
      params.append('microbeName', value)
      getMedicineAllergyList(params).then(res => {
        const optionDataSource = _.map(res.data, function(v) {
          return {
            keyW: v.keyW,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
        })
        that.$set(that.optionDataSource, index, optionDataSource)
      })
    },
    blurInput(e, item) {
      this.getMedicineAllergyList(e.target.value, item.parentId)
    },
    handleClick(e) {
      this.basisMaskId = e.key
      // this.getElementsAnswer()
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
    handleCancel() {
      this.visible = false
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    getElementsAnswer() {
      var that = this;
      var params = new URLSearchParams();
      if (this.basisMaskId > 30) {
        that.list = [];
        params.append('questionId', this.basisMaskId)
        params.append('patientBasisId', this.patientBasisId)
        getAllQuestionList(params)
          .then(res => {
            that.listArr = that.initQuestionAnswers(res.data.topTitles)
            that.question = res.data.question
            if (res.data.isFinish === '0') {
              that.questionFinished = false
            } else {
              that.questionFinished = true
            }
          })

      } else {
        that.question = {}
        that.listArr = []
        that.questionFinished = false
        params.append('basisMaskId', this.basisMaskId)
        params.append('patientBasisId', this.patientBasisId)
        getElementsAnswer(params)
          .then(res => {
            that.list = that.initList(res.data)
            // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
          })
      }

    },
    generateAnswers() {
      var result = []
      _.each(this.list, function(item) {
        if (item.simple > 0) {
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementNumValue: typeof $('input[name="' + item.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + item.basisElementCopyId + '"]:checked').val() : '',
            elementTextValue: ''
          })
        } else if (item.isWrite > 0) {
          var text = $('[name="' + item.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementCopyId + '"] input').val() : $('[name="' + item.basisElementCopyId + '"]').val()
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementTextValue: text,
            elementNumValue: ''
          })
        }
        if (item.hasChild > 0) {
          if (item.childList[0].type === 1) {
            _.each(item.childList, function(sub) {
              if (sub.isWrite > 0) {
                var text = $('[name="' + sub.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sub.basisElementCopyId + '"] input').val() : $('[name="' + sub.basisElementCopyId + '"]').val()
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementTextValue: text,
                  elementNumValue: ''
                })
              }
              if (sub.simple > 0) {
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: typeof $('input[name="' + sub.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + sub.basisElementCopyId + '"]:checked').val() : '',
                  elementTextValue: ''
                })
              }

              if (sub.hasChild > 0) {
                if (sub.isRadio !== 0) {
                  _.each(sub.childList, function(third) {
                    result.push({
                      basisAnswerId: third.answers && third.answers.length ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('[value="' + third.basisElementCopyId + '"][name="' + third.parentId + '"]').prop('checked') ? 1 : -1,
                      elementTextValue: ''
                    })
                  })
                }
                _.each(sub.childList, function(third) {
                  if (third.simple > 0) {
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: typeof $('input[name="' + third.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + third.basisElementCopyId + '"]:checked').val() : '',
                      elementTextValue: ''
                    })
                  }
                  if (third.isWrite > 0) {
                    var text = $('[name="' + third.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.basisElementCopyId + '"] input').val() : $('[name="' + third.basisElementCopyId + '"]').val()
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementTextValue: text || '',
                      elementNumValue: ''
                    })
                  }
                  if (third.hasChild > 0) {

                    _.each(third.childList, function(fourth) {
                      if (third.isRadio !== 0) {
                        result.push({
                          basisAnswerId: fourth.answers && fourth.answers.length ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('[value="' + fourth.basisElementCopyId + '"][name="' + fourth.parentId + '"]').prop('checked') ? 1 : -1,
                          elementTextValue: ''
                        })
                      }
                      if (fourth.simple > 0) {
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: typeof $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() : '',
                          elementTextValue: ''
                        })
                      }
                      if (fourth.isWrite > 0) {
                        var text = $('[name="' + fourth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fourth.basisElementCopyId + '"] input').val() : $('[name="' + fourth.basisElementCopyId + '"]').val()
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementTextValue: text || '',
                          elementNumValue: ''
                        })
                      }
                      if (fourth.hasChild > 0 && fourth.isRadio === 0) {
                        _.each(fourth.childList, function(fifth) {
                          if (fifth.isWrite > 0) {
                            var text = $('[name="' + fifth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fifth.basisElementCopyId + '"] input').val() : $('[name="' + fifth.basisElementCopyId + '"]').val()
                            result.push({
                              basisAnswerId: (fifth.answers && fifth.answers.length) ? fifth.answers[0].basisAnswerId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementTextValue: text || '',
                              elementNumValue: ''
                            })
                          }
                          if (fifth.simple > 0) {
                            result.push({
                              basisAnswerId: (fifth.answers && fifth.answers.length) ? fifth.answers[0].basisAnswerId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementNumValue: typeof $('input[name="' + fifth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fifth.basisElementCopyId + '"]:checked').val() : '',
                              elementTextValue: ''
                            })
                          }
                          if (fifth.hasChild > 0 && fifth.isRadio === 0) {
                            _.each(fifth.childList, function(sixth) {
                              if (sixth.isWrite > 0) {
                                var text = $('[name="' + sixth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sixth.basisElementCopyId + '"] input').val() : $('[name="' + sixth.basisElementCopyId + '"]').val()
                                result.push({
                                  basisAnswerId: (sixth.answers && sixth.answers.length) ? sixth.answers[0].basisAnswerId : '',
                                  basisElementId: sixth.basisElementCopyId,
                                  elementTextValue: text || '',
                                  elementNumValue: ''
                                })
                              }
                            })
                          }
                        })
                      } else if (fourth.hasChild > 0 && fourth.isRadio !== 0) {
                        _.each(fourth.childList, function(fifth) {
                          result.push({
                            basisAnswerId: fifth.answers && fifth.answers.length ? fifth.answers[0].basisAnswerId : '',
                            basisElementId: fifth.basisElementCopyId,
                            elementNumValue: $('[value="' + fifth.basisElementCopyId + '"][name="' + fifth.parentId + '"]').prop('checked') ? 1 : -1,
                            elementTextValue: ''
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
          } else {
            // 是选项，单选或多选
            if (item.isRadio !== 0) {
              _.each(item.childList, function(sub) {
                result.push({
                  basisAnswerId: sub.answers && sub.answers.length ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('[value="' + sub.basisElementCopyId + '"][name="' + sub.parentId + '"]').prop('checked') ? 1 : -1,
                  elementTextValue: ''
                })
                // TODO:此处后面需看还有没有更多情况
                if (sub.hasChild > 0 && sub.isWrite > 0) {
                  result.push({
                    basisAnswer: sub.childList[0].answers && sub.childList[0].answers.length ? sub.childList[0].answers[0].basisAnswerId : '',
                    basisElementId: sub.childList[0].basisElementCopyId,
                    elementTextValue: $('[name="' + sub.childList[0].basisElementCopyId + '"]').val(),
                    elementNumValue: ''
                  })
                }
              })
            }
          }
        }
      })
      return result
    },
    generateQuestionAnswers() {
      var result = []
      var titleObject = {}
      var childrenObject = []
      var subOp = {}
      _.each(this.listArr, function(title) {
        titleObject = {
          options: []
        }
        titleObject.titleId = title.questionTitleId
        childrenObject = []
        if (title.childrens && title.childrens.length) {
          _.each(title.childrens, function(sub) {
            if (sub.type === 3) {
              childrenObject.push({
                titleId: sub.questionTitleId,
                value: $('input[name="' + sub.questionTitleId + '"]').val()
              })
            }
            if (sub.type === 6) {
              childrenObject.push({
                titleId: sub.questionTitleId,
                value: $('[name="' + sub.questionTitleId + '"] input').val()
              })
            }
            if ((sub.type === 1 || sub.type === 2) && sub.options && sub.options.length) {
              subOp = {
                titleId: sub.questionTitleId,
                options: []
              }
              $('input[name="' + sub.questionTitleId + '"]:checked').each(function() {
                subOp.options.push({
                  questionTitleId: sub.questionTitleId,
                  questionOptionId: $(this).val()
                })
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
      // 问卷调查
      debugger
      var re = this.form.getFieldsValue()
      return false
      const that = this;
      if (!_.isEmpty(this.question)) {
        var result = this.generateQuestionAnswers()
        console.log(result)
        var params = new URLSearchParams()
        params.append('answers', JSON.stringify(result))
        params.append('patientBasisId', this.patientBasisId)
        params.append('questionId', this.question.questionId)
        saveQuestion(params)
          .then(res => {
            console.log(res)
            that.$message.success(res.msg, function() {
              var href = location.href.replace(/\?markId=[\d]+/, '')
              location.href = href + '?markId=' + this.basisMaskId
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
      // 基线、访视、随访
      else {
        var result = this.generateAnswers()
        console.log(result)
        var params = new URLSearchParams()
        const allergy = []
        for (var key in this.optionDataSource) {
          _.each(this.optionDataSource[key], function(item) {
            allergy.push({
              basisElementId: key,
              microbeName: item.microbeName,
              antibiotic: item.antibiotic,
              antibioticResult: item.antibioticResult,
              allergyValue: item.allergyValue
            })
          })
        }
        this.patientBasis.status = 1
        params.append('basisAnswer', JSON.stringify(result))
        params.append('patientBasis', JSON.stringify(this.patientBasis))
        params.append('basisMarkId', this.basisMaskId)
        params.append('allergy', JSON.stringify(allergy))
        submit(params)
          .then(res => {
            console.log(res)
            that.$message.success(res.msg, function() {
              var href = location.href.replace(/\?markId=[\d]+/, '')
              location.href = href + '?markId=' + that.basisMaskId
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
      return false
    },
    initList(list) {
      var that = this
      _.each(list, function(a) {
        if (a.simple > 0 && a.answers && a.answers.length) {
          a.basisElementId = a.answers[0].elementNumValue
        }
        if (typeof a.computeElement !== 'undefined' && a.computeElement === 0 && a.answers && a.answers.length) {
          that.computeMap[a.basisElementCopyId] = a.answers[0].elementTextValue
        }
        if (a.hasChild > 0 && a.isRadio === 0) {
          _.each(a.childList, function(b) {
            if (typeof b.computeElement !== 'undefined' && b.computeElement === 0 && b.answers && b.answers.length) {
              that.computeMap[b.basisElementCopyId] = b.answers[0].elementTextValue
            }
            if (b.simple > 0 && b.answers && b.answers.length) {
              b.basisElementId = b.answers[0].elementNumValue
            }
            //单选
            if (b.hasChild > 0 && b.isRadio > 0) {
              var re = _.filter(b.childList, function(v) { return v.answers && v.answers.length && v.answers[0].elementNumValue > 0 })
              if (re.length) b.basisElementId = re[0].basisElementId
              _.each(b.childList, function(c) {
                if (c.logicValue > 0 && c.hasChild > 0 && c.isRadio === 0) {
                  _.each(c.childList, function(d) {
                    if (d.simple > 0 && d.answers && d.answers.length) {
                      d.basisElementId = d.answers[0].elementNumValue
                    }
                    if (d.hasChild > 0 && d.isRadio === 0) {
                      _.each(d.childList, function(e) {
                        if (e.simple > 0 && e.answers && e.answers.length) {
                          e.basisElementId = e.answers[0].elementNumValue
                        }
                      })
                    }
                  })
                }
                if (c.logicValue > 0 && c.hasChild > 0 && c.isRadio > 0) {

                }
              })
            }
            //多选
            if (b.hasChild > 0 && b.isRadio < 0) {
              if (b.childList[0].answers && b.childList[0].answers.length) {
                b.elementId = _.map(_.filter(_.flatten(_.map(b.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 }), function(v) { return v.basisElementId })
              } else {
                b.elementId = []
              }
              //多选框控制子选项
              _.each(b.childList, function(c) {
                if (c.logicValue > 0 && c.answers && c.answers.length && c.answers[0].elementNumValue > 0) {
                  var selected = _.filter(_.flatten(_.map(c.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 })
                  if (selected.length) {
                    c.basisElementId = _.map(selected, function(v) { return v.basisElementId })[0]
                  }
                }
              })
            }
            //子选项,第三层
            if (b.hasChild > 0 && b.isRadio === 0) {
              _.each(b.childList, function(c) {
                if (c.simple > 0 && c.answers && c.answers.length) {
                  c.basisElementId = c.answers[0].elementNumValue
                }
                if (c.hasChild > 0 && c.isRadio === 0) {
                  _.each(c.childList, function(d) {
                    if (d.simple > 0 && d.answers && d.answers.length) {
                      d.basisElementId = d.answers[0].elementNumValue
                    }
                    if (d.hasChild > 0 && d.isRadio < 0) {
                      if (d.childList[0].answers && d.childList[0].answers.length) {
                        d.elementId = _.map(_.filter(_.flatten(_.map(d.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 }), function(v) { return v.basisElementId })
                      } else {
                        d.elementId = []
                      }
                    } else if (d.hasChild > 0 && d.isRadio > 0) {
                      if (d.childList[0].answers && d.childList[0].answers.length) {
                        var selected = _.filter(_.flatten(_.map(d.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 })
                        if (selected.length) {
                          d.basisElementId = _.map(selected, function(v) { return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if (c.hasChild > 0 && c.isRadio < 0) {
                  if (c.childList[0].answers && c.childList[0].answers.length) {
                    c.elementId = _.map(_.filter(_.flatten(_.map(c.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 }), function(v) { return v.basisElementId })
                  } else {
                    c.elementId = []
                  }
                  _.each(c.childList, function(d) {
                    if (d.hasChild > 0 && d.isRadio > 0) {
                      if (d.childList[0].answers && d.childList[0].answers.length) {
                        var selected = _.filter(_.flatten(_.map(d.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 })
                        if (selected.length) {
                          d.basisElementId = _.map(selected, function(v) { return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if (c.hasChild > 0 && c.isRadio > 0) {
                  if (c.childList[0].answers && c.childList[0].answers.length) {
                    var selected = _.filter(_.flatten(_.map(c.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 })
                    if (selected.length) {
                      c.basisElementId = _.map(selected, function(v) { return v.basisElementId })[0]
                    }
                  }
                }
              })
            }
          })
        } else if (a.hasChild > 0 && a.isRadio < 0) {
          if (a.childList[0].answers && a.childList[0].answers.length) {
            a.elementId = _.map(_.filter(_.flatten(_.map(a.childList, function(v) { return v.answers })), function(v) { return v.elementNumValue > 0 }), function(v) { return v.basisElementId })
          } else {
            a.elementId = []
          }
        } else if (a.hasChild > 0 && a.isRadio > 0) {
          var re = _.filter(a.childList, function(v) { return v.answers && v.answers.length && v.answers[0].elementNumValue > 0 })
          if (re.length) a.basisElementId = re[0].basisElementId
        }
      })
      return list
    },
    initQuestionAnswers(list) {
      _.each(list, function(a) {
        if (a.childrens && a.childrens.length) {
          _.each(a.childrens, function(b) {
            if (b.type === 1 && b.answers && b.answers.length) {
              b.inputType = b.answers[0].questionOptionId
            }
            if (b.type === 2) {
              if (b.answers && b.answers.length) {
                b.inputType = _.map(b.answers, function(v) { return v.questionOptionId })
              } else {
                b.inputType = []
              }
            }
          })
        }
      })
      return list
    },
    compute(id) {
      console.log(id)
      var that = this
      var result = this.generateAnswers()
      var params = new URLSearchParams();
      params.append('basisElementId', id)
      params.append('basisAnswer', JSON.stringify(result))
      computeScore(params)
        .then(res => {
          console.log(res)
          console.log('计算成功,结果为:' + res.data[id])
          if (typeof res.data[id] !== 'undefined') {
            that.computeMap[id] = res.data[id]
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    _import() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientId', this.patient.patientId)
      params.append('basisMarkId', this.basisMaskId)
      that.confirmLoading = true
      getVtList(params)
        .then(res => {
          that.importData = res.data
          that.pagination.total = res.total
          that.confirmLoading = false
          that.visible = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleCancel() {
      this.visible = false
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

.ant-col-4 .ant-calendar-picker,
.ant-col-6 .ant-calendar-picker {
  width: 100%;
}

.ant-checkbox-wrapper+.ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #CFF4FF;
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
    padding: 18px 32px;
  }

  /deep/ .tree-title {
    border-right: 1px solid #e8e8e8;
    color: #25aefe;
    font-size: 22px;
    padding-left: 70px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-image: url(../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    padding-left: 20p;
    background-position-x: 15px;
    padding-bottom: 26px;
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

    .ant-menu-item:hover,
    .ant-menu-item-active,
    .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-submenu-active,
    .ant-menu-submenu-title:hover {
      background-color: #eaf2fd;
    }

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