<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhe_huaban" />
          受访者:{{ info.name }}
        </a-col>
        <a-col :md="6" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzheng_huaban" />
          {{ info.card }}
        </a-col>
        <a-col :md="12" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{info.createTime | moment}}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
      <a-row :gutter="8">
        <div style="overflow: hidden;">
          <a-button class="btn fr" type="primary" @click="save(4)">通过</a-button>
          <a-button class="btn fr" @click="save(4)">不通过</a-button>
        </div>
        <div class="baselineForm" :style="baselineFormStyle">
          <a-form :form="form">
            <!-- 调查问卷 -->
            <a-form-item>
              <div v-if="question.name" class="question-title">{{question.name}}</div>
              <div v-if="question.remark" class="question-des">{{question.remark}}</div>
            </a-form-item>
            <div v-for="item in listArr" :key="item.id">
              <div class="question-t">{{item.name}}</div><br />
              <a-form-item v-for="(qu1, index) in item.childrens" :key="index" :label="qu1.type !== 5 ? qu1.name : ''" :labelCol="labelColVer" :wrapperCol="wrapperVer">
                <p v-if="qu1.type == 5">{{qu1.name}}</p>
                <a-input v-if="qu1.type === 3" style="width: 200px" :addonAfter="qu1.unit" :name="qu1.questionTitleId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].questionOptionValue" />
                <a-radio-group v-if="qu1.type === 1" :name="qu1.questionTitleId+''" v-model="qu1.inputType">
                  <a-radio :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId">{{item.name}}</a-radio>
                </a-radio-group>
                <a-checkbox-group v-if="qu1.type === 2" v-model="qu1.inputType">
                  <a-checkbox :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId" :name="qu1.questionTitleId+''">{{item.name}}</a-checkbox>
                </a-checkbox-group>
                <a-date-picker v-if="qu1.type === 6" :name="qu1.questionTitleId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].questionOptionValue && moment(qu1.answers[0].questionOptionValue, 'YYYY-MM-DD')" />
              </a-form-item>
            </div>
          </a-form>
        </div>
      </a-row>
    </a-card>
  </div>
</template>
<script>
  import moment from 'moment'
  import { mapActions } from 'vuex'
  import { getWxQuestionDetail, questionReview } from '@/api/distract'
  import { MyIcon } from '@/components/_util/util'
  export default {
    components: {
      MyIcon
    },
    data() {
      return {
        info: {},
        baselineFormStyle: {
          height: (window.screen.height - 350) + 'px',
        },
        form: this.$form.createForm(this),
        question: {},
        listArr: [],
        labelColVer: {
          xs: { span: 24 },
          sm: { span: 24 },
          md: { span: 24 }
        },
        wrapperVer: {
          xs: { span: 24 },
          sm: { span: 24 },
          md: { span: 24 }
        },
        disBlock: {
          display: 'block',
        },
      }
    },
    created() {
      this.CloseSidebar()
      this.info.name = this.$route.params.name
      this.info.card = this.$route.params.card
      this.info.createTime = this.$route.params.createTime

      const params = {
        questionTaskId: this.$route.params.id
      }
      getWxQuestionDetail(params).then(res => {
        this.listArr = this.initQuestionAnswers(res.data.topTitles)
        this.question = res.data.question
      })
    },
    methods: {
      ...mapActions(['CloseSidebar']),
      moment,

      save(id) {
        const params = {
          questionTaskId: this.$route.params.id,
          status: id
        }
        questionReview(params).then(res => {
          this.$message.success(res.msg);
          this.$router.back(-1)
        })
      },

      initQuestionAnswers(list) {
        _.each(list, function (a) {
          if (a.childrens && a.childrens.length) {
            _.each(a.childrens, function (b) {
              if (b.type === 1 && b.answers && b.answers.length) {
                b.inputType = b.answers[0].questionOptionId
              }
              if (b.type === 2) {
                if (b.answers && b.answers.length) {
                  b.inputType = _.map(b.answers, function (v) { return v.questionOptionId })
                } else {
                  b.inputType = []
                }
              }
            })
          }
        })
        return list
      },
    }
  }
</script>
<style lang="less" scoped>
  .page-header-index-wide {
    .UserNameCard {
      font-size: 20px;
      .anticon {
        font-size: 26px;
        vertical-align: text-bottom;
        position: relative;
        left: -5px;
      }
    }

    .ant-row.ant-form-item:hover {
      background-color: #e6f7ff;
    }

    /deep/ .ant-card-wider-padding .ant-card-body {
      padding: 10px 15px;
    }

    .fr {
      float: right;
    }

    .btn {
      margin-right: 10px;
    }

    .baselineForm {
      overflow: auto;
      padding: 20px;

      .question-title {
        text-align: center;
        font-size: 22px;
        color: #3398dc;
      }
      .question-des {
        font-size: 16px;
        padding: 0 10px;
      }

      .question-t {
        font-size: 18px;
        line-height: 40px;
        font-weight: 700;
      }

      .ant-form-item {
        margin-bottom: 0px;
        border-bottom: 1px solid #eee;
      }

      /deep/ .ant-form-item-label {
        text-align: left;

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
    }
  }
</style>