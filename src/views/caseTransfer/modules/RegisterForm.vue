<template>
  <a-modal title="新建申请" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item>
          <a-input-search placeholder="搜索患者身份证号" @search="onSearch" v-decorator="['card', requiredRule]" enterButton />
        </a-form-item>

        <div v-if="JSON.stringify(patient) != '{}'">
          <a-divider orientation="left">患者信息</a-divider>
          <user-detail :patient="patient"></user-detail>
          <a-divider orientation="left">申请理由</a-divider>
          <a-form-item>
            <a-textarea rows="3" v-decorator="['reason', { rules: [{ required: JSON.stringify(patient) != '{}', message: '该选项必填' }] }]" placeholder="请输入申请理由" style="margin-bottom: 0" />
          </a-form-item>
        </div>

        <div v-else>
          <div class="zwhz" v-if="tipCode == 3"></div>
          <div class="bkzy" v-else-if="tipMsg == 0 || tipMsg == 5"></div>
          <div class="zwsj">{{ tipMsg }}</div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getPatientDetailByCard } from '@/api/patient'
  import { addDistract } from '@/api/distract'
  import UserDetail from './UserDetailTop';
  export default {
    components: {
      UserDetail
    },
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
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
        patient: {},
        tipMsg: '暂无数据',
        tipCode: -200
      }
    },
    methods: {
      show() {
        this.patient = {};
        this.tipMsg = '暂无数据'
        this.tipCode = -200
        this.visible = true;
      },
      onSearch(value) {
        this.confirmLoading = true;
        this.patient = {};
        const { form: { validateFieldsAndScroll } } = this
        validateFieldsAndScroll(['card'], (errors, values) => {
          if (errors) {
            this.confirmLoading = false;
            return
          }
          const params = new FormData()
          params.append('type', 1)
          params.append('card', value);
          getPatientDetailByCard(params).then(res => {
            this.confirmLoading = false;
            if (res.code == 1) {
              this.patient = res.data
            } else {
              this.tipMsg = res.msg
              this.tipCode = res.code
            }
          })
        })
      },
      handleSubmit() {
        this.confirmLoading = false
        this.form.validateFieldsAndScroll((errors, fieldsValue) => {
          if (errors) {
            this.confirmLoading = false
            return
          }
          if (JSON.stringify(this.patient) == '{}') return

          const distract = {
            ...fieldsValue,
            patientId: this.patient.patientId,
            centerId: this.patient.centerId,
          }
          const params = new FormData()
          params.append('distract', JSON.stringify(distract))
          addDistract(params).then(res => {
            this.$message.success(res.msg);
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok')
          })
        })
      },
      handleCancel() {
        this.visible = false
      },
      validateCard(rule, value, callback) {
        if (!value) {
          callback('该选项必填');
          return;
        }
        var num = value.toUpperCase(); //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
          callback('身份证号长度不正确或不符合规定！');
          return;
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
          return;
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
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
              i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
              nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
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
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
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
          }
        }
        callback()
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-divider-horizontal.ant-divider-with-text-left {
    color: #1890ff;
  }

  .zwhz {
    width: 220px;
    height: 220px;
    margin: auto;
    margin-bottom: 20px;
    background: url('../../../assets/zwhz.png') 80% 80% no-repeat;
  }
  .bkzy {
    width: 220px;
    height: 220px;
    margin: auto;
    margin-bottom: 20px;
    background: url('../../../assets/bkzy.png') 80% 80% no-repeat;
  }
  .zwsj {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    color: #1890ff;
  }
</style>