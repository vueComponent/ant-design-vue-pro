<template>
  <a-modal title="审核" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="申请单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['distractCode']" readOnly />
        </a-form-item>
        <a-form-item label="档案号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fileCode']" readOnly />
        </a-form-item>
        <a-form-item label="患者姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['patientName']" readOnly />
        </a-form-item>
        <a-form-item label="身份号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['card']" readOnly />
        </a-form-item>
        <a-form-item label="申请中心" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['centerName']" readOnly />
        </a-form-item>
        <a-form-item label="申请时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['createDate']" disabled />
        </a-form-item>
        <a-form-item label="申请理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reason']" readOnly />
        </a-form-item>
        <a-form-item label="审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['executeStatus', requiredRule]">
            <a-radio value="1">通过</a-radio>
            <a-radio value="0">驳回</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('executeStatus') == 0" label="驳回理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入驳回理由" v-decorator="['rejectionReason', requiredRule]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { verifyDistract } from '@/api/distract'
  export default {
    data() {
      return {
        bodyStyle: {
          height: '500px',
          overflow: 'auto'
        },
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        },
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },

      }
    },
    methods: {
      show(recode) {
        this.visible = true;
        this.confirmLoading = false;
        this.$nextTick(() => {
          this.form.setFieldsValue(recode);
        })
      },
      handleSubmit() {
        this.confirmLoading = true;

        const { form: { validateFields } } = this;

        validateFields((errors, fieldsValue) => {
          const that = this;
          if (errors) {
            this.confirmLoading = false;
            return;
          }
          const params = {
            distract: {
              ...this.form.getFieldsValue(),
              createDate: fieldsValue['createDate'].format('YYYY-MM-DD')
            }
          }
          //   console.log(params, 'params')
          verifyDistract(params)
            .then(res => {
              that.$message.success(res.msg);
              that.visible = false;
              that.confirmLoading = false;
              that.$emit('ok')
            })
        })
      },
      handleCancel() {
        this.visible = false
      },
      isIdCardNo(rule, value, callback) {
        if (!value || value == '') {
          callback('该选项必填');
          return false;
        }
        let num = value.toUpperCase(); //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
          //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
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
          callback('身份证号不正确或不符合规定！');
        }

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
            callback('身份证号的出生日期不对！');
          } else {
            //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
              i;
            for (i = 0; i < 17; i++) {
              nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
              callback('18位身份证号的校验码不正确！');
            }
            callback();
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
</style>