<template>
  <div class="patient">
    <div class="patient-box">
      <img src="../../../assets/woman.png" height="60px" v-if="patient.sex == 0" />
      <img src="../../../assets/man.png" height="60px" v-else />
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
        <p>患者编号：{{patient.code}}</p>
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
    <a-row>
      <a-col :span="8">
        <p>文化程度：{{patient.censusName}}</p>
      </a-col>
      <a-col :span="8">
        <p>职业：{{patient.workName}}</p>
      </a-col>
      <a-col :span="8">
        <p>家庭年收入：{{patient.income + '万元'}}</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    props: ['patient'],
    computed: {
      getAge() {
        var identityCard = this.patient.card
        var len = (identityCard + '').length
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
    border: 1px solid rgba(22, 143, 253, 0.15);
    background: #f5f9fd;
    padding: 15px 20px;
    .patient-box {
      border-bottom: 1px dashed rgba(22, 143, 253, 0.15);
      padding-bottom: 15px;
      margin-bottom: 15px;
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
    p {
      font-size: 14px;
    }
  }
</style>
