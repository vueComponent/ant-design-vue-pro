<template>
  <div class="patient">
    <div class="patient-box">
      <img src="../../../assets/woman.png" height="100%" v-if="patient.sex == 0" />
      <img src="../../../assets/man.png" height="100%" v-else />
      <div class="patient-info">
        <span class="patient-name">{{ patient.name }}</span>
        <span class="patient-age" :class="patient.sex == 0 ? 'womenBg' : ''">
          <a-icon :type="patient.sex == 1 ? 'man':'woman'" />
          {{getAge}}岁
        </span>
        <span class="patient-nation">{{patient.nationName}}</span>
      </div>
    </div>
    <a-row>
      <a-col :span="8">
        <p>档案编号：{{patient.fileCode}}</p>
      </a-col>
      <a-col :span="8">
        <p>身份证号：{{patient.card}}</p>
      </a-col>
      <a-col :span="8">
        <p>创建人：{{patient.creatorName}}</p>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <p>联系电话：{{patient.telephone1}}</p>
      </a-col>
      <a-col :span="8">
        <p>所属中心：{{patient.centerName}}</p>
      </a-col>
      <a-col :span="8">
        <p>创建时间：{{patient.createDate | moment}}</p>
      </a-col>
    </a-row>
    <!-- <div class="userDetailContent">
      <p class="userDetailItem">
        <span class="userDetailItemTitle">档案编号</span>
        <span class="userDetailItemInfo">{{patient.fileCode}}</span>
      </p>
      <p class="userDetailItem" style="width:10%;">
        <span class="userDetailItemTitle">姓名</span>
        <span class="userDetailItemInfo">{{patient.name}}</span>
      </p>
      <p class="userDetailItem" style="width:30%;">
        <span class="userDetailItemTitle">身份证号</span>
        <span class="userDetailItemInfo">{{patient.card}}</span>
      </p>
      <p class="userDetailItem">
        <span class="userDetailItemTitle">联系电话</span>
        <span class="userDetailItemInfo">{{patient.telephone}}</span>
      </p>
      <p class="userDetailItem">
        <span class="userDetailItemTitle">所属中心</span>
        <span class="userDetailItemInfo">{{patient.centerName}}</span>
      </p>
    </div> -->
    <!-- <div style="margin-top:20px;">
      <h4>申请理由：</h4>
      <a-textarea
        @change="handleChangeText"
        v-model="textValue"
        placeholder="请填写申请理由"
        :autosize="{ minRows: 6, maxRows: 10 }"
      />
    </div> -->
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    //   data() {
    //     return {
    //       patient: {},
    //       textValue: ''
    //     }
    //   },
    // props: {
    //   patient: {
    //     type: Object,
    //     default: {}
    //   }
    // },
    props: ['patient'],
    //   mounted() {
    //     this.patient = this.userData
    //   },
    //   methods: {
    //     handleChangeText() {
    //       this.$emit('handle-change', this.textValue)
    //     }
    //   },
    computed: {
      getAge() {
        var identityCard = this.patient.card
        var len = (identityCard + '').length
        if (len == 0) {
          return 0
        } else {
          if (len != 15 && len != 18) {
            //身份证号码只能为15位或18位其它不合法
            return 0
          }
        }
        var strBirthday = ''
        if (len == 18) {
          //处理18位的身份证号码从号码中得到生日和性别代码
          strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
        }
        if (len == 15) {
          strBirthday =
            '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
        }
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday)
        var nowDateTime = new Date()
        var age = nowDateTime.getFullYear() - birthDate.getFullYear()
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (
          nowDateTime.getMonth() < birthDate.getMonth() ||
          (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())
        ) {
          age--
        }
        return age
      }
    }
  }
</script>
<style lang="less" scoped>
  .patient {
    // border: 1px solid #f8f8f8;
    border-top: 4px solid #168ffd;
    padding: 15px 25px;
    background-color: #fff;
    .patient-box {
      height: 60px;
      margin-bottom: 20px;
      display: flex;
      .patient-info {
        flex: 1;
        display: flex;
        align-items: center;
        span {
          height: 24px;
          line-height: 24px;
          font-size: 14px;
          margin-left: 15px;
        }
        .patient-name {
          font-size: 20px;
        }
        .womenBg {
          background-color: #fd94dc !important;
        }
        .patient-age {
          color: #fff;
          background-color: #96dcfd;
          padding: 0px 10px;
          border-radius: 3px;
        }
        .patient-nation {
          background-color: #e8e8e8;
          padding: 0px 10px;
          border-radius: 3px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
