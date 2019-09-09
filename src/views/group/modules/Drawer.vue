<template>
  <div>
    <a-drawer width="350" placement="right" :closable="false" @close="onClose" :visible="visible" :maskClosable="maskClosable">
      <div class="porjectInfo">
        <h4 class="proJectInfoTitle">
          <img src="../../../assets/proTitle.png" alt="" />
          项目
        </h4>
        <p :class="[{checkedPro:i==n},'porjectItem']"   @click="checkedPro(item,i)"  v-for="(item,i) in dataList">
          <my-icon type="iconziyuan1" />
          {{item.projectName}}
        </p>
      </div>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right'
        }"
      >
        <a-button @click="onClose" type="primary">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { MyIcon } from '@/components/_util/util';
import { getDatalList,getPatientList,joinProject } from '@/api/group';
export default {
  data() {
    return {
      dataList:[],
      n:0,
      checkedP:{},
      visible: false,
      maskClosable: false,
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px'
      },
      pStyle2: {
        marginBottom: '24px'
      }
    };
  },
  created(){
    const parems = new URLSearchParams();
    parems.append('pageNumber', 1);
    parems.append('pageSize', 10);
    getDatalList(parems).then(res => {
      this.dataList=res.data;
    });
  },
  components: {
    MyIcon
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.$emit('checkedP', this.dataList[this.n]);
      this.visible = false;
    },
    checkedPro(value,i){
      this.n=i;
    }
  }
};
</script>
<style lang="less" scoped>
.porjectInfo {
  .proJectInfoTitle {
    height: 65px;
    color: #019fe7;
    font-size: 20px;
    border-bottom: 1px solid #dddddd;
    img {
      width: 65px;
    }
  }
  .porjectItem {
    margin: 0px;
    font-size: 18px;
    padding:20px;
    color: #838383;
    &:hover,&.checkedPro{
      background-color: #eaf2fd;
      color: #35b4ed;
    }
    .anticon{
      font-size: 25px;
      margin-right: 15px;
      vertical-align: text-top;
    }
  }
}
</style>
