<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main" style="height:100%;">
    <a-spin :spinning="isLoading" style="height:100%">
      <div style="flex: 1;display: flex;flex-direction: column;">
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
        <!-- <a-card :bordered="false" style="margin-top: 10px"> -->
        <a-row type="flex" style="flex:1;padding: 10px 15px;flex-direction: column;margin-top: 10px;overflow: hidden;">
          <div class="head-bar">
            <a-row type="flex">
              <span class="head-icon"></span>
              <div v-if="question.name" class="question-title">{{question.name}}</div>
            </a-row>
            <a-row>
              <a-button class="btn fr" type="primary" @click="save(4)">通过</a-button>
              <a-button class="btn fr" @click="save(3)">不通过</a-button>
            </a-row>
          </div>
          <div class="baselineForm">
            <!-- 调查问卷 -->
            <div v-if="question.remark" class="question-des"><span style="color:#3398dc">说明：</span>{{question.remark}}</div>
            <a-form :form="form">
              <div v-for="item in listArr" :key="item.id">
                <div class="question-t">
                  <span class="question-icon"></span>
                  <span>{{item.name}}</span>
                </div>
                <a-form-item v-for="(qu1, index) in item.childrens" :key="index" :colon="false" :label="qu1.type !== 5 ? qu1.name : ''" :labelCol="labelColVer" :wrapperCol="wrapperVer">
                  <p v-if="qu1.type == 5" class="question-tip">
                    <span class="tip-icon"></span>
                    <span>{{qu1.name}}</span>
                  </p>
                  <a-input v-if="qu1.type === 3" style="width: 200px" :addonAfter="qu1.unit" :name="qu1.questionTitleId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].questionOptionValue" readOnly />
                  <a-radio-group v-if="qu1.type === 1" :name="qu1.questionTitleId+''" v-model="qu1.inputType">
                    <a-radio :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId" disabled>{{item.name}}</a-radio>
                  </a-radio-group>
                  <a-checkbox-group v-if="qu1.type === 2" v-model="qu1.inputType">
                    <a-checkbox :style="disBlock" v-for="(item, index) in qu1.options" :key="index" :value="item.questionOptionId" :name="qu1.questionTitleId+''" disabled>{{item.name}}</a-checkbox>
                  </a-checkbox-group>
                  <a-date-picker v-if="qu1.type === 6" :name="qu1.questionTitleId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].questionOptionValue && moment(qu1.answers[0].questionOptionValue, 'YYYY-MM-DD')" disabled />
                </a-form-item>
              </div>
            </a-form>
          </div>
        </a-row>
      </div>
      <!-- </a-card> -->
    </a-spin>
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
        isLoading: true,
        info: {},
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

      const params = new FormData()
      params.append('questionTaskId', this.$route.params.id)
      getWxQuestionDetail(params).then(res => {
        this.isLoading = false
        this.listArr = this.initQuestionAnswers(res.data.topTitles)
        this.question = res.data.question
      })
    },
    methods: {
      ...mapActions(['CloseSidebar']),
      moment,

      save(id) {
        const params = new FormData()
        params.append('questionTaskId', this.$route.params.id)
        params.append('status', id)
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
    /deep/ .ant-spin-container {
      height: 100%;
      display: flex;
    }
    .head-bar {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f7ffff;
      border: 2px solid #079ce9;
      box-shadow: 4px 4px 0px #b9b4ac;
      padding: 0 15px;
      margin-bottom: 15px;
      /deep/ .ant-btn {
        height: 40px;
        padding: 0 20px;
        font-size: 16px;
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
        background-image: url('../../assets/head-icon.png');
        background-size: 100% 100%;
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
      flex: 1;
      overflow: auto;
      padding: 20px;

      /deep/ .ant-radio-disabled + span {
        color: inherit;
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
          background-image: url('../../assets/question-icon.png');
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
          background-image: url('../../assets/tip-icon.png');
          background-size: 60% 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      .ant-form-item {
        margin-bottom: 0px;
        border-bottom: 1px solid #eee;
      }

      .ant-form-item label {
        margin: 5px 0;
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

      /deep/ .ant-form-item-control-wrapper {
        padding: 5px 0;
      }
    }
  }
</style>