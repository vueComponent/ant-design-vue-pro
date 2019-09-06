<template>
  <span>
    <a-icon type="edit" @click="showMicroorganism" class="mcroorganism"/>
    <a-modal title="药敏检查" width="800px" :visible="visible" :footer="null" :centered="centered"  @cancel="handleCancel" :bodyStyle="bodyStyle">
      <p ><a-button class="editable-add-btn" @click="handleAdd">添加抗生素</a-button></p>
      <a-table rowKey="keyW" size="middle" :pagination="pagination" :columns="columns" :dataSource="data">
        <template v-for="col in ['microbeName', 'antibiotic', 'allergyValue']" :slot="col" slot-scope="text, record, index">
          <div :key="col" 
            <a-input v-if="record.editable" style="margin: -5px 0;" :value="text" @change="e => handleChange(e.target.value, record.keyW, col)" />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="antibioticResult" slot-scope="text, record, index">
          <div>
            <a-select defaultValue="耐药" v-if="record.editable" style="margin: -5px 0;width: 100%" :value="text" @change="value => handleSelectChange(value, record.keyW)">
              <a-select-option value="耐药">耐药</a-select-option>
              <a-select-option value="敏感">敏感</a-select-option>
              <a-select-option value="未做">未做</a-select-option>
            </a-select>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
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
    </a-modal>
  </span>
</template>
<script>
const columns = [
  {
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
    title: '抗生素检测结果',
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
  model: {
    prop: 'transfer', //v-model绑定的数据，相当于别名，可以和父组件中的变量名称不一样。
    event: 'mySign' // 自定义组件发送的信号名称。
  },
  props: {
    transfer: '',
    dataSource: {
      type: Array,
      default: () => {
        return [];
      }
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
      centered: true
    };
  },
  methods: {
    showMicroorganism(){
       this.visible = true
    },
    handleCancel(){
      this.visible=false
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    handleSelectChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0];
      if (target) {
        target['antibioticResult'] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.keyW)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }

      this.$emit('mySign', this.data);
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
      console.log("key",key)
      const newData = [...this.data];
      this.data = newData.filter(item => item.keyW !== key);
      console.log("this.data",this.data)
      console.log("newData",newData)

      this.$emit('mySign', this.data);
    },
    handleAdd() {
      const { count, data } = this;
      const newData = {
        keyW: count + 1,
        antibiotic: '',
        microbeName: this.vitamin,
        antibioticResult: '',
        allergyValue: ''
      };
      this.data = [...data, newData];
      this.count = count + 1;

      this.$emit('mySign', this.data);
    }
  },
  watch: {
    dataSource: {
      immediate: true,
      handler(val) {
        this.data = val;
        console.log('val', val);
        this.vitamin = val[0] ? val[0].microbeName : '';
        this.count = val.length > 0 ? val[val.length - 1].keyW : 0;
        this.$emit('mySign', this.data);
        console.log('this.count', this.count);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.mcroorganism{
  font-size: 18px;
  margin-right: 20px;
  &:hover{
    cursor: pointer;
    color: #0399EC;
  }  
}
</style>
