<template>
  <a-modal centered title="新建病例" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="病例识别号（身份证号)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['card', { rules: [{ required: true, validator: isIdCardNo }] }]" />
        </a-form-item>
        <!-- <a-form-item label="病例档案号" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['card', { rules: [{ required: true }] }]" /></a-form-item> -->
        <a-form-item label="患者同意注册日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD"  v-decorator="['registerDate', requiredRule]" />
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['name', requiredRule]" /></a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['sex', requiredRule]" style="width: 100%">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="0">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="出生日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD"  v-decorator="['birthDate', requiredRule]" />
        </a-form-item>
        <a-form-item label="常居住地" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-cascader
                v-decorator="[
                  'residence',
                  requiredRule
                ]"
                :options="residences"
                :fieldNames="{ label: 'city', value: 'cityId', children: 'children' }"
                placeholder="选择省/市"
              />
            </a-col>
            <a-col :span="12"><a-input placeholder="请输入详细地址" v-decorator="['address',requiredRule]" /></a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="民族" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['nation',requiredRule ]"
            :options="nationList"
          ></a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="职业">
          <a-radio-group :options="professionList" v-decorator="['work',requiredRule]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="文化程度">
          <a-radio-group :options="censusList" v-decorator="['census',requiredRule]" />
        </a-form-item>
       <a-form-item label="家庭年收入" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['income', requiredRule]" addonAfter="万元" /></a-form-item>
       <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="医疗费用支付情况">
         <a-radio-group :options="payTypeList" v-decorator="['payType',requiredRule]" />
       </a-form-item>
       <a-form-item label="联系电话1" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['telephone1']"/></a-form-item>
       <a-form-item label="联系电话2" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['telephone2']"/></a-form-item>
       <a-form-item label="联系电话3" :labelCol="labelCol" :wrapperCol="wrapperCol"><a-input v-decorator="['telephone3']"/></a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getProvinceAndCity, getNation, getDictionaryAttributeByDictionaryId,addOrUpdate } from '@/api/basis';
import _ from 'lodash';
export default {
  data() {
    return {
      residences: [],
      nationList: [],
      professionList: [],
      censusList: [],
      payTypeList:[],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] }
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
      this.visible = true;
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      this.confirmLoading = false;
      validateFields((errors, fieldsValue) => {
        const that=this;
        if (errors) {
          this.confirmLoading = false;
          return;
        }
        const birthDate = fieldsValue['birthDate'];
        const registerDate = fieldsValue['registerDate'];
        const residence = fieldsValue['residence'];
        const values = {
          ...fieldsValue,
          birthDate: fieldsValue['birthDate'].format('YYYY-MM-DD'),
          registerDate:fieldsValue['registerDate'].format('YYYY-MM-DD'),
          addressP:residence[0],
          addressC:residence[1]
        };
        const params = new URLSearchParams();
        params.append('patientStr', JSON.stringify(values))
        params.append('changeCenter', '')
        params.append('centerId','')
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
    isIdCardNo(rule, value, callback) {
      console.log('value', value);
      if (!value || value == '') {
        callback('该选项必填');
        return false;
      }
      console.log(1234);
      const num = value.toUpperCase(); //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        //alert('身份证号长度不正确或不符合规定！');
        callback('身份证号长度不正确或不符合规定！');
      }
      //验证前2位，城市符合
      var aCity = {
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
        //alert('身份证号不正确或不符合规定！');
        callback('身份证号不正确或不符合规定！');
      }
      //alert('城市:'+aCity[parseInt(num.substr(0,2))]);

      //下面分别分析出生日期和校验位
      var len, re;
      len = num.length;
      if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re); //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = dtmBirth.getYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);
        if (!bGoodDay) {
          //alert('身份证号的出生日期不对！');
          callback('身份证号的出生日期不对！');
        } else {
          //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
          var nTemp = 0,
            i;
          num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i];
          }
          num += arrCh[nTemp % 11];
          callback();
        }
      }
      if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re); //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = dtmBirth.getFullYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);
        if (!bGoodDay) {
          //alert(dtmBirth.getYear());
          //alert(arrSplit[2]);
          //alert('身份证号的出生日期不对！');
          callback('身份证号的出生日期不对！');
        } else {
          //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
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
            //alert('18位身份证的校验码不正确！应该为：' + valnum);
            //alert('18位身份证号的校验码不正确！');
            callback('18位身份证号的校验码不正确！');
          }
          callback();
        }
      }
      callback('身份证号不正确！');
    }
  }
};
</script>
