<template>
  <div>
    <a-modal title="修改密码"     :maskClosable="maskClosable" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-form :form="form" >
        <a-form-item label="原密码"  :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input  type="password"  v-decorator="['password', { rules: [{ required: true, message: '请输入原密码!' }] }]" />
        </a-form-item>
         <a-form-item label="新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input  type="password" v-decorator="['newPassword', { rules: [{ required: true, message: '请输入新密码!' }] }]" />
        </a-form-item>
        <a-form-item label="确认新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input  type="password" v-decorator="['confirmPassword', { rules: [{ required: true, validator: confirm }] }]" />
        </a-form-item>
        <!-- <a-form-item :wrapper-col="{ span: 12, offset: 5 }"><a-button type="primary" html-type="submit">Submit</a-button></a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ModalText: 'Content of the ',
      visible: false,
      maskClosable: false,
      confirmLoading:false,
      destroyOnClose: false,
      form: this.$form.createForm(this)
    };
  },
  methods: {
    showModal() {
      this.visible = true;
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
    handleOk(e) {
        // const {
        //   form: { validateFields }
        // } = this;
        // this.confirmLoading = false;
        // validateFields((errors, fieldsValue) => {
        //   const that = this;
        //   if (errors) {
        //     this.confirmLoading = false;
        //     return;
        //   }
        //   const values = {
        //     ...fieldsValue,
        //   };
        //   const params = new URLSearchParams();
        //   params.append('patientStr', JSON.stringify(values));
        //   addOrUpdate(params).then(res => {
        //     console.log(res);
        //     that.visible = false;
        //     that.confirmLoading = false;
        //   });
        // });
    },
    handleCancel(e) {
      this.visible = false;
    }
  }
};
</script>
