<template>
  <div>
    <a-modal title="个人中心" :width="400" :maskClosable="maskClosable"  :bodyStyle="bodyStyle" :visible="visible"   :footer="null" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <div class="userCenter">
        <img src="../../assets/userCenerHeader.png" alt="">
        <h4 class="userName">{{ ModalText.name }}</h4>
        <p class="userCenter"><span>所属分支中心：</span>{{ ModalText.centerName }}</p>
        <p class="userAccount"><a-icon type="user" /> <span>账号：</span>{{ ModalText.account }}</p>
        <p class="userAccount"><a-icon type="clock-circle" /><span>创建时间：</span> {{ ModalText.createTime|formDate }}</p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getDetailById } from '@/api/login';
import moment from 'moment';
export default {
  data() {
    return {
      ModalText: {},
      visible: false,
      confirmLoading: false,
      bodyStyle:{
         height: '350px',
      },
      maskClosable:false
    };
  },
  created(){
     this.getUDetailById(window.localStorage.getItem("doctorId"));
  },
  // mounted: {
  //   this.getUDetailById(1);
  // },
    filters: {
    formDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }
    },
  methods: {
    getUDetailById(id) {
      const Params = new URLSearchParams();
      Params.append('doctorId', id);
      getDetailById(Params).then(res => {
        this.ModalText=res.data.doctor
      });
    },
    showModal() {
      this.visible = true;
    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
  .userCenter{
    text-align: center;
    img{
      width: 110px;
    }
    h4{
     font-weight: normal;
     font-size: 20px;
     margin-top: 10px;
    } 
    p{
      span{
        color: #AEAEAE
      }
      .anticon{
          margin-right: 10px;
          font-size: 20px;
      }
    }
    .userCenter{
      font-size: 14px;
      border-bottom: 1px dashed #eee;
      padding-bottom: 20px;
    }
    .userAccount{
      text-align: left
    }
  }
</style>
