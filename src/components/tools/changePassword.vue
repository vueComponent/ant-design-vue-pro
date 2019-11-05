<template>
  <div>
    <a-modal title="修改密码" :maskClosable="maskClosable" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-form :form="form" >
        <a-form-item label="原密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input  type="password" v-decorator="['password', { rules: [{ required: true, validator: confirmPassword }] }]" />
        </a-form-item>
        <a-form-item label="新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input type="password" v-decorator="['newPassword', { rules: [{ required: true,validator: confirmNewPassword }] }]" />
        </a-form-item>
        <a-form-item label="确认新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input autocomplete="off" onfocus="this.type='password'" type="text" v-decorator="['confirmPassword', { rules: [{ required: true, validator: confirm }] }]" />
        </a-form-item>
        <!-- <a-form-item :wrapper-col="{ span: 12, offset: 5 }"><a-button type="primary" html-type="submit">Submit</a-button></a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getDetailById, updatePwd, } from '@/api/login';
import { mapGetters } from 'vuex'
import { log } from 'util';

export default {
  data() {
    return {
      ModalText: 'Content of the ',
      visible: false,
      maskClosable: false,
      confirmLoading:false,
      destroyOnClose: false,
      form: this.$form.createForm(this),
      ModalText: {},
    };
  },
  created() {
    this.getUDetailById(this.token.doctorId);
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    getUDetailById(id) {
      const Params = new URLSearchParams();
      Params.append('doctorId', id);
      getDetailById(Params).then(res => {
        this.ModalText = res.data.doctor
      });
    },
    showModal() {
      this.visible = true;
    },
    confirmPassword(rule, value, callback){
      if (!value || value == '') {
        callback('请输入原密码');
        return false;
      }
      if(this.form.getFieldValue('password') != this.ModalText.password){
          callback('与原密码不相符,请重新确认');
        return false;
      }
    },
    confirmNewPassword(rule, value, callback){
      if (!value || value == '') {
        callback('请输入新密码');
        return false;
      }
      if(this.form.getFieldValue('newPassword') === this.ModalText.password){
          callback('与原密码相符,请重新确认');
        return false;
      }
    },
    confirm(rule, value, callback){
      if (!value || value == '') {
        callback('请输入确认新密码');
        return false;
      }
      if(value!=this.form.getFieldValue('newPassword')){
          callback('与新密码不相符,请重新确认');
        return false;
      }
    },
    checkPassword(){
      if(!this.form.getFieldValue('password') || this.form.getFieldValue('password') == ''){
        return false;
      }
      if(this.form.getFieldValue('password') != this.ModalText.password){
        return false;
      }
      if (!this.form.getFieldValue('newPassword') || this.form.getFieldValue('newPassword') == '') {
        return false;
      }
      if(this.form.getFieldValue('newPassword') === this.ModalText.password){
        return false;
      }
      if (!this.form.getFieldValue('confirmPassword') || this.form.getFieldValue('confirmPassword') == '') {
        return false;
      }
      if(this.form.getFieldValue('confirmPassword') != this.form.getFieldValue('newPassword')){
        return false;
      }
      return;
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        return false;
      });
      this.checkPassword();
      if (this.checkPassword() == false) {

      }else{
        // console.log("成功")
        const Params = new URLSearchParams();
        this.ModalText.password = this.form.getFieldValue('newPassword')
        Params.append('doctor',JSON.stringify(this.ModalText));
        updatePwd(Params).then(res => {
          if(res.code == 0){
            this.$message.success(res.msg);
            this.visible = false;
          }else{
            this.$message.error(res.msg);
          }
        });
      }
    },
    handleCancel(e) {
      this.visible = false;
    }
  }
};
</script>
