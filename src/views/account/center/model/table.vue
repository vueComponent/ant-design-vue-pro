<template>
  <span class="editMcroorganism">
    <p @click="showMicroorganism">
      <a-icon type="edit" class="mcroorganism" /><span>编辑</span>
    </p>
    <a-modal ref="picUpload" title="药敏检查" width="800px" :visible="visible" :footer="null" :maskClosable="false" :centered="centered" @cancel="handleCancel" :bodyStyle="bodyStyle">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="药敏类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="typeof type1 !== 'undefined' || typeof type2 !== 'undefined'">
            <a-radio-group v-model="t1" @change="changeType1($event)" v-if="typeof type1 !== 'undefined'">
              <a-radio value="1">粘液型</a-radio>
              <a-radio value="2">非粘液型</a-radio>
            </a-radio-group>
            <a-radio-group v-model="t2" @change="changeType2($event)" v-if="typeof type2 !== 'undefined'">
              <a-radio value=" 1">粘液型</a-radio>
              <a-radio value="2">非粘液型</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="上传图像" :labelCol="labelColHor" :wrapperCol="wrapperHor">
            <div class="clearfix" style="margin-top: 10px;">
              <a-upload :action="uploadUrl" listType="picture-card" class="images" v-viewer @preview="handlePreview" :fileList="fileList" @change="picChange">
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-button style="position: absolute;top: 84px;left: 120px;font-size: 12px;padding: 0 5px;height: 30px;" @click="_import" v-if="fileList.length === 1">OCR识别</a-button>
            </div>
          </a-form-item>
        </a-form>
        <p style="text-align: right">
          <a-button class="editable-add-btn" @click="handleAdd">添加抗生素</a-button>
        </p>
        <a-table rowKey="keyW" size="middle" :pagination="pagination" :columns="columns" :dataSource="data">
          <template v-for="col in [ 'antibiotic', , 'antibioticResult']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input v-if="record.editable" style="margin: -5px 0;" :value="text" @change="e => handleChange(e.target.value, record.keyW, col)" />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template slot="allergyValue" slot-scope="text, record">
            <div>
              <a-select defaultValue="S" v-if="record.editable" style="margin: -5px 0;width: 100%" :value="text" @change="value => handleSelectChange(value, record.keyW)">
                <a-select-option value="S">S</a-select-option>
                <a-select-option value="R">R</a-select-option>
                <a-select-option value="I">I</a-select-option>
                <a-select-option value="*">*</a-select-option>
              </a-select>
              <template v-else>{{text}}</template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.keyW)">保存</a>
                <a-popconfirm title="确定取消?" @confirm="() => cancel(record.keyW)"><a>取消</a></a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => edit(record.keyW)">编辑</a>
                <a-popconfirm v-if="data.length" title="确定删除?" @confirm="() => onDelete(record.keyW)"><a href="javascript:;">删除</a></a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </a-spin>
    </a-modal>
  </span>
</template>
<script>
import { getOcrResult } from '@/api/basis'
import _ from 'lodash'

const columns = [{
    title: '微生物名称',
    dataIndex: 'microbeName',
    width: '20%',
    scopedSlots: { customRender: 'microbeName' }
  },
  {
    title: '抗生素',
    dataIndex: 'antibiotic',
    width: '20%',
    scopedSlots: { customRender: 'antibiotic' }
  },
  {
    title: 'MIC值',
    dataIndex: 'antibioticResult',
    width: '20%',
    scopedSlots: { customRender: 'antibioticResult' }
  },
  {
    title: '药敏结果',
    dataIndex: 'allergyValue',
    width: '20%',
    scopedSlots: { customRender: 'allergyValue' }
  },
  {
    title: '操作',
    width: '20%',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    type1: {
      type: String
    },
    type2: {
      type: String
    },
    isFirst: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    picSource: {
      type: String
    }
  },
  data() {
    this.cacheData = this.dataSource.map(item => ({ ...item }));
    return {
      pagination: false,
      data: this.dataSource,
      columns,
      count: this.dataSource.length + 1,
      vitamin: '',
      visible: false,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      centered: true,
      t1: '',
      t2: '',
      form: this.$form.createForm(this),
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 3 },
        md: { span: 3 }
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 19 },
        md: { span: 19 }
      },
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList: [],
      confirmLoading: false,
      picData: this.picSource
    };
  },
  methods: {
    showMicroorganism() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.keyW)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handlePreview() {
        const viewer = document.querySelector('.images').$viewer;
        viewer.show()
    },
    handleSelectChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.keyW)[0]
      if (target) {
        target['allergyValue'] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.keyW)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0];
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.keyW)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
    onDelete(key) {
      console.log("key", key)
      const newData = [...this.data]
      this.data = newData.filter(item => item.keyW !== key)
      console.log("this.data", this.data)
      console.log("newData", newData)

      // this.$emit('mySign', this.data);
    },
    handleAdd() {
      const { count, data } = this
      const newData = {
        keyW: count + 1,
        antibiotic: '',
        microbeName: this.vitamin,
        antibioticResult: '',
        allergyValue: ''
      };
      this.data = [newData, ...data]
      this.count = count + 1

      // this.$emit('mySign', this.data);
    },
    changeType1(e) {
      this.$emit('listen', e.target.value)
    },
    changeType2(e) {
      this.$emit('listen', e.target.value)
    },
    picChange({ fileList }) {
      this.fileList = fileList
      if (fileList && fileList[0] && fileList[0].response) {
        this.picData = fileList[0].response.fileName
        if (this.isFirst) {
          this.$emit('changePic1', this.picData)
        } else {
          this.$emit('changePic2', this.picData)
        }
      }
    },
    _import() {
      this.confirmLoading = true
      var params = new URLSearchParams()
      params.append('type', 7)
      params.append('url', this.fileList[0].response.data.src)
      var that = this
      getOcrResult(params)
        .then(res => {
          console.log(res.data)
          this.confirmLoading = false
          if (res.data.microbeName !== this.vitamin) {
            this.$message.warn('请上传' + this.vitamin || '其他菌种' + '的图片')
          } else {
            this.$message.success(res.data.info)
            this.data.splice(0, this.data.length)
            _.each(res.data.maList, function(v, k) {
              that.data.push({ keyW: k, ...v })
            })
            that.cacheData = res.data.maList.map(item => ({ ...item }))
            // this.$emit('changeSource1')
            // if (this.isFirst) {
            //   this.$emit('changeSource1', this.data)
            // }
          }
        })
        .catch(error => {
          this.confirmLoading = false
        })
    }
  },
  watch: {
    dataSource: {
      immediate: true,
      handler(val) {
        this.data = val
        console.log('val', val)
        this.vitamin = val[0] ? val[0].microbeName : ''
        this.count = val.length > 0 ? val[val.length - 1].keyW : 0
        // this.$emit('mySign', this.data)
      }
    },
    picSource: {
      immediate: true,
      handler(val) {
        this.picData = val
      }
    },
    type1: {
      immediate: true,
      handler(val) {
        this.t1 = val
      }
    },
    type2: {
      immediate: true,
      handler(val) {
        this.t2 = val
      }
    }
  }
};
</script>
<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.editMcroorganism {
  display: inline-block;
  margin: 0;
  margin-right: 20px;

  .mcroorganism {
    font-size: 14px;
    color: #0399EC;
  }

  span {
    color: #0399EC;

  }

  &:hover {
    cursor: pointer;

    span {
      text-decoration: underline;
    }
  }
}

.editable-add-btn {
    background-color: #00a59b;
    color: #fff;
}
</style>