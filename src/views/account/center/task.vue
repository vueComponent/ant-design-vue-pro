<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
     <a-card :bordered="false" style="background-color: #0399EC;color:#FFFFFF">
       <a-row :gutter="30" style="line-height: 34px;">
         <a-col :md="1" :sm="4"><a-icon type="left" style="fontSize:20px;cursor: pointer;" @click="$router.back(-1)" /></a-col>
         <a-col :md="4" :sm="20" class="UserNameCard">
           <my-icon type="iconshoufangzhe_huaban" />
           受访者:{{ patient.name }}
         </a-col>
         <a-col :md="6" :sm="24" class="UserNameCard">   
         <my-icon type="iconshenfenzheng_huaban" />
           {{ patient.card }}
         </a-col>
         <a-col :md="13" :sm="24" style="fontSize:20px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
       </a-row>
      </a-card>
    </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { mapActions } from 'vuex'
import { getPatientBasis, getElementsAnswer, submit, getMedicineAllergyList, computeScore, getTaskDetail } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import { MyIcon } from '@/components/_util/util';
export default {
  name: 'taskDetail',
  components: {
    MyIcon
  },
  data() {
    return {
      checkedList:[],
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6}
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24}
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
      visible: false,
      confirmLoading: false,
      list: [],
      visitTaskId: this.$route.params.id,
      computeMap: {
        1208: '',
        2727: '', 
        1160: '',
        4207: ''
      },
      disBlock :{
        display: 'block',
      },
      bodyStyle: {
        'padding-left': '0px'
      }
    }
  },
  beforeCreate (){
    this.form = this.$form.createForm(this, {onFieldsChange: this.onFieldsChange, onValuesChange: this.onValuesChange})
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('visitTaskId', this.visitTaskId)
    getTaskDetail(params)
    .then(res => {
      that.basisMarkId = res.data.basisMarkId
    })   
  },
  computed: {
    validate() {
      return function(index){
        if(!this.validateFlag) return ''
        var first = this.list[index]
        if(first.required > 0) return 'error'
      }
    }
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    showList(e,type,name){
      if(type !== 'showList') return;
      if(e.target.checked){
        if(name=="其他") return;
        this.getMedicineAllergyList(name,e.target.value)
      }else{
         this.$set(this.optionDataSource,e.target.value,[])
      }
       
    },
    getMedicineAllergyList(value,index){
       const that = this
       const params = new URLSearchParams()
       params.append('microbeName', value)
       getMedicineAllergyList(params).then(res => {
        const  optionDataSource = _.map(res.data, function(v) {
          return {
            keyW: v.keyW,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
       })   
        that.$set(that.optionDataSource,index, optionDataSource)
      }) 
    },
    blurInput(e,item){
       this.getMedicineAllergyList(e.target.value,item.parentId)
    },
    handleClick(e) {
      this.basisMaskId = e.key
      this.getElementsAnswer()
    },
    handleSubmit () {
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
    handleCancel () {
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
    getElementsAnswer (){
      var that = this;
      var params = new URLSearchParams();
      if (this.basisMaskId > 30) {
        that.list = [];
        params.append('questionId', this.basisMaskId)
        getAllQuestionList(params)
        .then(res => {
          res.data.topTitles.forEach((item,index,arr)=> {
            that.listArr = arr;
         })
         that.question = that.initList(res.data.question);
          // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
        })
        
      }else{
        that.question = {};
        that.listArr = [];
        params.append('basisMaskId', this.basisMaskId)
        params.append('patientBasisId', this.patientBasisId)
        getElementsAnswer(params)
        .then(res => {
          that.list = that.initList(res.data)
          // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
        })
      }
     
    },
    generateAnswers (){
      var result = []
      _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementNumValue: typeof $('input[name="' + item.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + item.basisElementCopyId + '"]:checked').val() : '',
            elementTextValue: ''
          })
        }else if(item.isWrite > 0){
          var text = $('[name="' + item.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementCopyId + '"] input').val() : $('[name="' + item.basisElementCopyId + '"]').val()
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementTextValue: text,
            elementNumValue: ''
          }) 
        }
        if(item.hasChild > 0){
          if(item.childList[0].type === 1){
            _.each(item.childList, function(sub){
              if(sub.isWrite > 0){
                var text = $('[name="' + sub.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sub.basisElementCopyId + '"] input').val() : $('[name="' + sub.basisElementCopyId + '"]').val()
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementTextValue: text,
                  elementNumValue: ''
                })
              }
              if(sub.simple > 0){
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: typeof $('input[name="' + sub.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + sub.basisElementCopyId + '"]:checked').val() : '',
                  elementTextValue: ''
                })
              }
              
              if(sub.hasChild > 0){
                if(sub.isRadio !== 0){
                  _.each(sub.childList, function(third){
                    result.push({
                      basisAnswerId: third.answers && third.answers.length ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('[value="' + third.basisElementCopyId + '"][name="' + third.parentId + '"]').prop('checked') ? 1 : -1,
                      elementTextValue: ''
                    })
                  })
                }
                _.each(sub.childList, function(third){
                  if(third.simple > 0){
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: typeof $('input[name="' + third.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + third.basisElementCopyId + '"]:checked').val() : '',
                      elementTextValue: ''
                    })
                  }
                  if(third.isWrite > 0){
                    var text = $('[name="' + third.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.basisElementCopyId + '"] input').val() : $('[name="' + third.basisElementCopyId + '"]').val()
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementTextValue: text || '',
                      elementNumValue: ''
                    })
                  }
                  if(third.hasChild > 0){
                    
                    _.each(third.childList,function(fourth){
                      if(third.isRadio !== 0){
                        result.push({
                          basisAnswerId: fourth.answers && fourth.answers.length ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('[value="' + fourth.basisElementCopyId + '"][name="' + fourth.parentId + '"]').prop('checked') ? 1 : -1,
                          elementTextValue: ''
                        })
                      }
                      if(fourth.simple > 0){
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: typeof $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() : '',
                          elementTextValue: ''
                        })
                      }
                      if(fourth.isWrite > 0){
                        var text = $('[name="' + fourth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fourth.basisElementCopyId + '"] input').val() : $('[name="' + fourth.basisElementCopyId + '"]').val()
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementTextValue: text || '',
                          elementNumValue: ''
                        })
                      }
                      if(fourth.hasChild > 0 && fourth.isRadio === 0){
                        _.each(fourth.childList, function(fifth){
                          if(fifth.isWrite > 0){
                            var text = $('[name="' + fifth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fifth.basisElementCopyId + '"] input').val() : $('[name="' + fifth.basisElementCopyId + '"]').val()
                            result.push({
                              basisAnswerId: (fifth.answers && fifth.answers.length) ? fifth.answers[0].basisAnswerId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementTextValue: text || '',
                              elementNumValue: ''
                            })
                          }
                        })
                      }else if(fourth.hasChild > 0 && fourth.isRadio !== 0){
                        _.each(fourth.childList, function(fifth){
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
          }else{
            // 是选项，单选或多选
            if(item.isRadio !== 0){
              _.each(item.childList, function(sub){
                result.push({
                  basisAnswerId: sub.answers && sub.answers.length ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('[value="' + sub.basisElementCopyId + '"][name="' + sub.parentId + '"]').prop('checked') ? 1 : -1,
                  elementTextValue: ''
                })
                // TODO:此处后面需看还有没有更多情况
                if(sub.hasChild > 0 && sub.isWrite > 0){
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
    save (){
      var result = this.generateAnswers()
      console.log(result)
      var params = new URLSearchParams();
      const allergy=[]
       for(var key in this.optionDataSource){
          _.each(this.optionDataSource[key], function(item){
            allergy.push({
              basisElementId:key,
              microbeName:item.microbeName,
              antibiotic:item.antibiotic,
              antibioticResult:item.antibioticResult,
              allergyValue:item.allergyValue
            })
          })
      }
      params.append('basisAnswer', JSON.stringify(result))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.basisMaskId)
      params.append('allergy', JSON.stringify(allergy))
      submit(params)
      .then(res => {
        console.log(res)
        alert('保存成功')
        // location.href = location.href
      })
      .catch(error => {
        console.log(error)
      })
    },
    submit (){
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
      return false
    },
    initList (list){
      var that = this
      _.each(list, function(a){
        if(a.simple > 0 && a.answers && a.answers.length){
          a.basisElementId = a.answers[0].elementNumValue
        }
        if(typeof a.computeElement !== 'undefined' && a.computeElement === 0 && a.answers && a.answers.length) {
          that.computeMap[a.basisElementCopyId] = a.answers[0].elementTextValue
        }
        if(a.hasChild > 0 && a.isRadio === 0){
          _.each(a.childList,function(b){
            if(typeof b.computeElement !== 'undefined' && b.computeElement === 0 && b.answers && b.answers.length) {
              that.computeMap[b.basisElementCopyId] = b.answers[0].elementTextValue
            }
            if(b.simple > 0 && b.answers && b.answers.length){
              b.basisElementId = b.answers[0].elementNumValue
            }
            //单选
            if(b.hasChild > 0 && b.isRadio > 0){
              var re = _.filter(b.childList, function(v){return v.answers && v.answers.length && v.answers[0].elementNumValue > 0})
              if(re.length) b.basisElementId = re[0].basisElementId
            }
            //多选
            if(b.hasChild > 0 && b.isRadio < 0){
              if(b.childList[0].answers && b.childList[0].answers.length){
                b.elementId = _.map(_.filter(_.flatten(_.map(b.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
              }else{
                b.elementId = []
              }
              //多选框控制子选项
              _.each(b.childList,function(c){
                if(c.logicValue > 0 && c.answers && c.answers.length && c.answers[0].elementNumValue > 0){
                  var selected = _.filter(_.flatten(_.map(c.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0})
                  if(selected.length){
                    c.basisElementId = _.map(selected,function(v){return v.basisElementId})[0]
                  }
                }
              })
            }
            //子选项,第三层
            if(b.hasChild > 0 && b.isRadio === 0){
              _.each(b.childList, function(c){
                if(c.simple > 0 && c.answers && c.answers.length){
                  c.basisElementId = c.answers[0].elementNumValue
                }
                if(c.hasChild > 0 && c.isRadio === 0){
                  _.each(c.childList, function(d){
                    if(d.simple > 0 && d.answers && d.answers.length){
                      d.basisElementId = d.answers[0].elementNumValue
                    }
                    if(d.hasChild > 0 && d.isRadio < 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        d.elementId = _.map(_.filter(_.flatten(_.map(d.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                      }else{
                        d.elementId = []
                      }
                    }else if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio < 0){
                  if(c.childList[0].answers && c.childList[0].answers.length){
                    c.elementId = _.map(_.filter(_.flatten(_.map(c.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                  }else{
                    c.elementId = []
                  }
                  _.each(c.childList, function(d){
                    if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio > 0){
                  if(c.childList[0].answers && c.childList[0].answers.length){
                    var selected = _.filter(_.flatten(_.map(c.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                    if(selected.length){
                      c.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                    }
                  }
                }
              })
            }
          })
        }else if(a.hasChild > 0 && a.isRadio < 0){
          if(a.childList[0].answers && a.childList[0].answers.length){
            a.elementId = _.map(_.filter(_.flatten(_.map(a.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
          }else{
            a.elementId = []
          }
        }else if(a.hasChild > 0 && a.isRadio > 0){
          var re = _.filter(a.childList, function(v){return v.answers && v.answers.length && v.answers[0].elementNumValue > 0})
          if(re.length) a.basisElementId = re[0].basisElementId
        }
      })
      return list
    },
    compute (id){
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
          if(typeof res.data[id] !== 'undefined') {
            that.computeMap[id] = res.data[id]
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .ml-10{
    margin-left: 10px; 
  }
 .UserNameCard{
   font-size: 20px;
   .anticon{
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
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: #CFF4FF;
}


/deep/.ant-menu-vertical .ant-menu-item:after, .ant-menu-vertical-left .ant-menu-item:after, .ant-menu-vertical-right .ant-menu-item:after, .ant-menu-inline .ant-menu-item:after{
      border-right: 6px solid #1890ff;
}
/deep/ .ant-row {
  clear: both;
}
.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 10px 15px;
  }
  /deep/ .tree-title {
    border-right: 1px solid #e8e8e8;
    color: #25aefe;
    font-size: 22px;
    padding-left: 70px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-image: url(../../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    padding-left: 20p;
    background-position-x: 15px;
    padding-bottom: 26px;
  }
  /deep/ .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title,
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
    background-color: rgba(245,251,255);
    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245,251,255);
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
    height: 350px;
    overflow: auto;

    padding: 20px;
    .ant-row {
      // padding-bottom: 10px;
      // padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;
      &.no-border{
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }
      &:hover {
      }
    }
    /deep/ .ant-form-item-label {
      text-align: left;
      label:after {
        content: '';
      }
      &.ant-col-md-24 label {
        display: block;
        background-color: #f7f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
      }
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
.question-title{
  text-align: center;
  font-size: 22px;
  color: #3398DC;
}
.question-des{
  font-size: 16px;
  // border: 1px solid #91D5FF ;
  // border-radius: 3px;
  // background: lightblue;
  padding:0 10px ;
}
.question-t{
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
}
/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle{
  width: 120px;
}
</style>

