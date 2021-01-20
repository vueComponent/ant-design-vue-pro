<template>
  <a-modal :title="options.title" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="病例识别号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入身份证号" v-decorator="['card', { rules: [ { validator: isIdCardNo }] }]" />
        </a-form-item>
        <!-- <a-form-item label="病例入组编号" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['card', { rules: [{ required: true }] }]" /></a-form-item> -->
        <a-form-item label="患者同意注册日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['registerDate', requiredRule]" :disabledDate="disabledDate" />
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', requiredRule]" />
        </a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['sex', requiredRule]">
            <a-radio value="1">男</a-radio>
            <a-radio value="0">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="出生日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['birthDate', requiredRule]" />
        </a-form-item>
        <a-form-item label="常居住地" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-form-item>
                <a-cascader v-decorator="['residence', requiredRule]" :options="residences" :fieldNames="{ label: 'city', value: 'cityId', children: 'children' }" placeholder="选择省/市" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-input v-decorator="['address', requiredRule]" placeholder="请输入详细地址" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="民族" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['nation', requiredRule]" :options="nationList"></a-select>
        </a-form-item>
        <a-form-item label="职业" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group :options="professionList" v-decorator="['work', requiredRule]" />
        </a-form-item>
        <a-form-item label="文化程度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group :options="censusList" v-decorator="['census', requiredRule]" />
        </a-form-item>
        <a-form-item label="家庭年收入" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['income', requiredRule]" addonAfter="万元" />
        </a-form-item>
        <a-form-item label="医疗费用支付情况" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group :options="payTypeList" v-decorator="['payType', requiredRule]" />
        </a-form-item>
        <a-form-item label="联系电话1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['telephone1', requiredRule]" />
        </a-form-item>
        <a-form-item label="联系电话2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['telephone2']" />
        </a-form-item>
        <a-form-item label="联系电话3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['telephone3']" />
        </a-form-item>
        <a-form-item label="随访开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" class="aaa">
          <a-popover>
            <template slot="content">
              第一次半年随访根据此时间生成
            </template>
            <a-icon type="exclamation-circle" style="position: relative;left: -20px;color: #0399ec;cursor: pointer;" />
          </a-popover>
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['startDate', requiredRule]" />
        </a-form-item>
        <a-form-item :wrapperCol="agrWrapperCol">
          <a-checkbox v-decorator="['agreeMent', { rules: [ { required: true, validator: agrValidator }], valuePropName: 'checked' }]" :disabled="options.title == '编辑患者'">
            患者是否已签署
            <a href="javascript:;" @click="download">知情同意书</a>
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getProvinceAndCity, getNation, getDictionaryAttributeByDictionaryId, addOrUpdate, validateCard } from '@/api/basis';
import moment from 'moment';
import _ from 'lodash';
export default {
  data() {
    return {
      options: {},
      residences: [],
      nationList: [],
      professionList: [],
      censusList: [],
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      maskClosable: false,
      payTypeList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      agrWrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 6
        }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      patientId: undefined
    };
  },
  created() {
    const that = this;
    getProvinceAndCity().then(res => {
      const keyMap = { province: 'city', provinceId: 'cityId' };
      _.each(res.data, function(item, index) {
        that.residences[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
    getNation().then(res => {
      const keyMap = { name: 'title', nationId: 'value' };
      _.each(res.data, function(item, index) {
        that.nationList[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
    const dictionary1 = new URLSearchParams();
    dictionary1.append('dictionaryId', 1);
    dictionary1.append('status', 1);
    getDictionaryAttributeByDictionaryId(dictionary1).then(res => {
      const keyMap = { name: 'label', dictionaryAttributeId: 'value' };
      _.each(res.data, function(item, index) {
        that.professionList[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
    const dictionary2 = new URLSearchParams();
    dictionary2.append('dictionaryId', 2);
    dictionary2.append('status', 1);
    getDictionaryAttributeByDictionaryId(dictionary2).then(res => {
      const keyMap = { name: 'label', dictionaryAttributeId: 'value' };
      _.each(res.data, function(item, index) {
        that.censusList[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });

    const dictionary3 = new URLSearchParams();
    dictionary3.append('dictionaryId', 3);
    dictionary3.append('status', 1);
    getDictionaryAttributeByDictionaryId(dictionary3).then(res => {
      const keyMap = { name: 'label', dictionaryAttributeId: 'value' };
      _.each(res.data, function(item, index) {
        that.payTypeList[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
  },
  methods: {
    add() {
      this.options.title = '新建患者';
      this.patientId = undefined
      this.visible = true;
    },
    edit(value) {
      console.log('value', value);
      this.options.title = '编辑患者';
      this.patientId = value.patientId
      value.residence = [value.addressP, value.addressC]
      setTimeout(() => {
        this.form.setFieldsValue({
          card: value.card,
          registerDate: moment(value.registerDate, 'x'),
          name: value.name,
          sex: String(value.sex),
          birthDate: moment(value.birthDate, 'x'),
          residence: value.residence,
          address: value.address,
          nation: value.nation,
          work: value.work,
          census: value.census,
          income: value.income,
          payType: value.payType,
          telephone1: value.telephone1,
          telephone2: value.telephone2,
          telephone3: value.telephone3,
          agreeMent: JSON.parse(value.agreeMent)
        })
        if (value.startDate)
          this.form.setFieldsValue({
            startDate: moment(value.startDate, 'YYYY-MM-DD')
          })
      }, 0);
      this.visible = true
    },
    handleSubmit() {
      if (!this.confirmLoading) {
        this.confirmLoading = true;
        this.form.validateFieldsAndScroll((errors, fieldsValue) => {
          const that = this;
          if (errors) {
            this.confirmLoading = false;
            return;
          }
          const residence = fieldsValue['residence'];
          const values = {
            ...fieldsValue,
            birthDate: fieldsValue['birthDate'].format('YYYY-MM-DD'),
            registerDate: fieldsValue['registerDate'].format('YYYY-MM-DD'),
            startDate: fieldsValue['startDate'].format('YYYY-MM-DD'),
            addressP: residence[0],
            addressC: residence[1],
            patientId: this.patientId
          };
          const params = new URLSearchParams();
          params.append('patientStr', JSON.stringify(values));
          params.append('changeCenter', '');
          params.append('centerId', '');
          addOrUpdate(params).then(res => {
            that.visible = false;
            that.confirmLoading = false;
            that.$message.success(res.msg)
            that.$emit('ok', values);
          });
        });
      }
    },
    handleCancel() {
      this.visible = false;
    },
    agrValidator(rule, value, callback) {
      if (this.options.title == '编辑患者') {
        callback()
        return
      }
      if (!value) {
        callback('该选项必填！')
        return
      }
      callback()
    },
    isIdCardNo(rule, value, callback) {
      if (this.form.getFieldValue('work') === 4 && !value) {
        callback();
        return;
      }
      if (!value) {
        callback('该选项必填！')
        return
      }
      let num = value.toUpperCase();
      if (num.length === 18) {
        //验证城市
        let aCity = {
          11: '北京',
          12: '天津',
          13: '河北',
          14: '山西',
          15: '内蒙古',
          21: '辽宁',
          22: '吉林',
          23: '黑龙江 ',
          31: '上海',
          32: '江苏',
          33: '浙江',
          34: '安徽',
          35: '福建',
          36: '江西',
          37: '山东',
          41: '河南',
          42: '湖北',
          43: '湖南',
          44: '广东',
          45: '广西',
          46: '海南',
          50: '重庆',
          51: '四川',
          52: '贵州',
          53: '云南',
          54: '西藏',
          61: '陕西',
          62: '甘肃',
          63: '青海',
          64: '宁夏',
          65: '新疆',
          71: '台湾',
          81: '香港',
          82: '澳门',
          91: '国外'
        };
        if (aCity[parseInt(num.substr(0, 2))] == null) {
          callback('身份证号不正确或不符合规定！');
          return;
        }
        // 验证生日
        let reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        let arrSplit = num.match(reg);
        let dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        let bGoodDay;
        bGoodDay = dtmBirth.getFullYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);
        if (!bGoodDay) {
          callback('身份证号不正确或不符合规定！');
          return
        }
        // 验证格式
        var valnum;
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0,
          i;
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)) {
          callback('身份证号不正确或不符合规定！');
          return
        }
        // 回显性别、生日
        if (!this.patientId) {
          this.form.resetFields(['birthDate', 'sex'])
          this.confirmLoading = true
          const params = new FormData();
          params.append('card', num);
          validateCard(params).then(res => {
            this.confirmLoading = false
            switch (res.code) {
              case 2:
                callback(res.msg);
                break
              case 3:
                let birthDate = new Date(num.substr(6, 8).replace(/(.{4})(.{2})/, "$1-$2-")).getTime();
                let sex = parseInt(num.charAt(16) / 2) * 2 != num.charAt(16) ? '1' : '0';
                this.form.setFieldsValue({
                  birthDate: moment(birthDate, 'x'),
                  sex
                })
                callback();
                break
              case 4:
                callback('该患者已存在，请在列表内搜索！');
                break
              default:
                callback();
            }
          })
        }
      }
      callback();
      return;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    download() {
      window.open(this.baseUrl + '/patient/downLoad')
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}

/deep/ .aaa .ant-form-item-label {
  position: relative;
  left: -18px;
}

.aaa .ant-form-item-children>i {
  position: absolute !important;
  left: -22px !important;
  top: 4px;
}
</style>