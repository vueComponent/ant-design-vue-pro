<template>
  <a-modal
    title="添加采集"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :centered="centered"
    :destroyOnClose="destroyOnClose"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div v-if="userData == ''">
          <a-form-item><a-input-search placeholder="搜索患者姓名,身份证号" @search="onSearch" v-decorator="['card', { rules: [{ required: true }] }]" enterButton /></a-form-item>
        </div>
        <div v-else><user-detail :option="userData"></user-detail></div>
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="采集报告" key="1">
            <a-form-item>
              <a-checkbox-group v-decorator="['register', { rules: [{ required: true }] }]" style="width:100%">
                <a-row>
                  <a-col :span="8" style="margin-top: 20px;" v-for="item in registerList">
                    <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
      <user-list ref="userListModule" @listen="checkuUser" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getDictionaryAttributeByDictionaryId, addOrUpdate } from '@/api/basis';
import UserList from './UserList';
import UserDetail from '../../list/modules/UserDetailTop.vue';
import _ from 'lodash';
export default {
  components: {
    UserList,
    UserDetail
  },
  data() {
    return {
      userData: '',
      registerList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      maskClosable: false,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] }
    };
  },
  created() {
    const that = this;
    const dictionary1 = new URLSearchParams();
    dictionary1.append('dictionaryId', 5);
    dictionary1.append('status', 1);
    getDictionaryAttributeByDictionaryId(dictionary1).then(res => {
      const keyMap = { name: 'label', dictionaryAttributeId: 'value' };
      _.each(res.data, function(item, index) {
        that.registerList[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
  },
  methods: {
    add() {
      this.userData = '';
      this.visible = true;
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      this.confirmLoading = false;
      validateFields((errors, fieldsValue) => {
        const that = this;
        if (errors) {
          this.confirmLoading = false;
          return;
        }
        const params = new URLSearchParams();
        params.append('patientStr', JSON.stringify(values));
        params.append('changeCenter', '');
        params.append('centerId', '');
        addOrUpdate(params).then(res => {
          console.log(res);
          that.visible = false;
          that.confirmLoading = false;
          that.$emit('ok', values);
        });
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // callback(key) {
    //   console.log(key);
    // },
    onSearch(value) {
      this.$refs.userListModule.add(value);
    },
    checkuUser(data) {
      this.userData = data[0];
    }
  }
};
</script>
