<template>
  <div class="page-header-index-wide">
    <a-row :gutter="10">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本月患者数" :total="indexData.currMonthPatients">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            上月患者数
            <span>{{ indexData.lastMonthPatients }}</span>
          </template>
          <div class="page-header-index-img">
            <img style="width: 64px; height: 64px" src="../../assets/home2.png">
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本月访视数" :total="indexData.currMonthBasis">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            上月访视数
            <span>{{ indexData.lastMonthBasis }}</span>
          </template>
          <div class="page-header-index-img">
            <img style="width: 64px; height: 64px" src="../../assets/home3.png">
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本年患者数" :total="indexData.currYearPatients">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            上年患者数
            <span>{{ indexData.lastYearPatients }}</span>
          </template>
          <div class="page-header-index-img">
            <img style="width: 64px; height: 64px" src="../../assets/home1.png">
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="患者总数" :total="indexData.realNum">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(24,144,255)" :target="indexData.completionRate" :percentage="indexData.completionRate" height="8px" />
          </div>
          <template slot="footer">
            <p style="margin-right: 16px;display: inline-block;margin-bottom: 0;">
              <span slot="term">计划数</span>
              {{ indexData.planNum }}
            </p>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" :bodyStyle="bodyStyle" title="我的工作" total="￥126,560">
          <a-row :gutter="10">
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <router-link :to="{name:'Task'}">
                <div class="card-wait-data">
                  <span class="myIcon">
                    <my-icon type="iconziyuan1" /></span>
                  <div>
                    <p>待办访视</p>
                    <h1>{{ myWork.nodoVisitsNum }}</h1>
                  </div>
                </div>
              </router-link>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <router-link :to="{name:'caseTransferReview'}">
                <div class="card-wait-data">
                  <span class="myIcon">
                    <my-icon type="iconqitabingli" /></span>
                  <div>
                    <p>待审转移病例</p>
                    <h1>{{ myWork.noDoPatientTransferNum }}</h1>
                  </div>
                </div>
              </router-link>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <router-link :to="{name:'wxQuestionReview'}">
                <div class="card-wait-data">
                  <span class="myIcon">
                    <my-icon type="iconziyuan" /></span>
                  <div>
                    <p>待审问卷</p>
                    <h1>{{ myWork.noDoQuestionNum }}</h1>
                  </div>
                </div>
              </router-link>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <router-link :to="{name:'wxPatientReportReview'}">
                <div class="card-wait-data">
                  <span class="myIcon">
                    <my-icon type="icondaishenzhuanyibingli" /></span>
                  <div>
                    <p>待审阅报告</p>
                    <h1>{{ myWork.otherNum }}</h1>
                  </div>
                </div>
              </router-link>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" title="病例省份占比">
          <div>
            <pie></pie>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :sm="48" :md="24" :lg="14" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
          <div class="salesCard tooltip-y">
            <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '10px', paddingLeft: '16px' }">
              <a-tab-pane loading="true" tab="新增病例数" key="1">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="48" :xs="48">
                    <bar :data="eachMonthPatients" title="新增病例数" />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane tab="新增访视数" key="2">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="48" :xs="48">
                    <bar :data="eachMonthBasiss" title="新增访视数" />
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :lg="10" :style="{ marginBottom: '10px' }">
          <a-card :loading="loading" title="资料下载" :bordered="false" :body-style="{ padding: '0' }" :style="{ height: '180px' }">
            <div class="salesCard">
              <rank-list :list="rankList" />
            </div>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :lg="10" :style="{ marginBottom: '10px' }">
          <a-card :loading="loading" title="伦理批件上传" :bordered="false" :body-style="{ padding: '0' }" :style="{ height: '170px' }">
            <div class="uploadFile" :style="file" >
              <p v-if="showFile">
                  <img src="../../assets/pdf.png"/>
              </p>
              <div v-if="showList" style="margin-bottom: 10px;">
                <img src="../../assets/file.png" style="margin: -1px 10px 0 0;"/>
                <span style="color: #3aa1ff;">{{fileName}}</span>
              </div>
              <a-upload
                name="file"
                :multiple="true"
                :action="uploadUrl"
                :headers="headers"
                :showUploadList= "false"
                @change="handleChange"
              >
                <a-button>上传文件</a-button>
              </a-upload>
            </div>
            
        </a-card>
      </a-col>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from 'moment';
import { Pie, ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, NumberInfo, MiniSmoothArea } from '@/components';
import { mixinDevice } from '@/utils/mixin';
import { getAllNumbers, getMyWork, getPatientsAndBasiss, getProvinceCompare, manualList,uploadFlie,fileList } from '@/api/home';
import { MyIcon } from '@/components/_util/util';

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    NumberInfo,
    MiniSmoothArea,
    Pie,
    MyIcon
  },
  data() {
    return {
      bodyStyle: {
        padding: '12px 20px',
      },
      indexData: {},
      myWork: {},
      loading: true,
      rankList: [],
      eachMonthPatients: [],
      eachMonthBasiss: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      headers: {
        authorization: 'authorization-text',
      },
      uploadUrl:'../ethics/uploadFile',
      showFile:true,
      showList:false,
      fileName:'',
      file:"text-align: center; padding: 10px 0 10px 25px;"
    };
  },
  created() {
    var that = this
    fileList().then(res => {
      if(res.fileName){
          this.showFile = false
          this.showList = true
          this.file = "text-align: left; padding: 10px 0 10px 25px;"
      }
      this.fileName = res.fileName;
    });
    getAllNumbers().then(res => {
      this.indexData = res.data.allNumbers;
    });
    getMyWork().then(res => {
      this.myWork = res.data.myWork;
    });
    getPatientsAndBasiss().then(res => {
      const keyMap = { monthDate: 'x', monthPatients: 'y' };
      const keyMap1 = { monthDate: 'x', monthBasis: 'y' }
      _.each(res.data.eachMonthPatients, function(item, index) {
        //  console.log(item)
        item.monthDate = item.monthDate + "月"
        // item.monthPatients=item.monthPatients;
        that.eachMonthPatients[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key
          newData[newKey] = item[key]
          return newData
        }, {})
      })
      _.each(res.data.eachMonthBasiss, function(item, index) {
        //  console.log(item)
        item.monthDate = item.monthDate + "月";
        that.eachMonthBasiss[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap1[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {})
      })
    })
    manualList().then(res => {
      that.rankList = res.data
    })
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000)
    // this.loadComments()
  },
  methods: {
    // loadComments() {
    //   var list = JSON.parse(localStorage.getItem("pro__Access-Token"));
    //   this.uploadUrl = list.value.uploadPicURL;
    // },
    handleChange(info) {
       
        var url = info.file.response.fileName
        var fileNames = info.file.response.originalFileName
        // 判断文件格式
        var filextension = fileNames.substring(fileNames.lastIndexOf("."),fileNames.length);
        filextension = filextension.toLowerCase();

        if (filextension == '.pdf') {
          const params = new URLSearchParams()
          params.append('url', url)
          params.append('fileName', fileNames)
          uploadFlie(params).then(res => {
            this.$message.success('文件上传成功');
            this.fileName = info.file.response.originalFileName
            this.showFile = false
            this.showList = true
            this.file = "text-align: left; padding: 10px 0 10px 25px;"
          })
          .catch(()=>{
            this.$message.error('文件上传失败');
          }) 
          
        }else{
          this.$message.error('对不起，系统仅支持pdf格式的文件');
          return
        }
        
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-pro-trend .up {
  color: #1aa355;
}

/deep/.ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
  padding: 12px 16px;
}

/deep/.ant-card-head-title {
  padding: 10px 0px;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;

  &.desktop div[class^='ant-col']:last-child {
    position: absolute;
    right: 0;
    height: 100%;
  }
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);

  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}

.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}

.card-wait-data {
  box-sizing: border-box;
  padding: 20px;
  background-color: #f7f8f8;
  height: 90px;
  background-image: url('');

  span.myIcon {
    display: inline-block;
    vertical-align: top;
    width: 40px;

    .anticon {
      font-size: 25px;
    }
  }

  div {
    display: inline-block;

    p {
      margin-bottom: 0px;
    }

    h1 {
      font-size: 30px;
      font-weight: normal;
      color: #000000;
    }
  }
}

/deep/.tooltip-y {
  /deep/.g2-tooltip-list li {
    font-size: 0px;
    position: relative;

    /deep/.g2-tooltip-marker {
      display: none !important;
    }

    /deep/.g2-tooltip-value {
      position: absolute;
      font-size: 12px;
      left: -30px;
    }
  }
}

.page-header-index-img {
  position: absolute;
  top: -50px;
  right: 40px;
}

.rank{
  padding: 0 32px 32px 30px;
}
// 上传文件
.uploadFile button{
  background: #3aa1ff;
  border: none;
  color: white;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 14px;
  line-height: 22px;
}

</style>