<template>
  <a-popover trigger="click" v-model="visible" v-if="show">
    <div class="visitInfo" slot="content">
      <a-timeline>
        <div v-for="(item, index) in list">
          <a-timeline-item v-for="(v, i) in item">
            <div slot="dot" v-if="i==0">
              <div class="visitContent">
                <span class="visitYear">
                  <a-icon type="file-text" /></span>
                <span class="visitYearText">{{v.gyYear}}年</span>
              </div>
            </div>
            <div class="visiItem" @click="jump(v)">
              <p class="visiItemTitle">
                <span class="visiItemName">{{v.typeName}}</span>
                <span class="visiItemTime">
                  <a-icon type="clock-circle" />
                  {{v.createDate | moment('YYYY-MM-DD')}}
                </span>
              </p>
              <div class="visiItemPro">
                <a-progress :percent="parseInt(v.progress)" :showInfo="false" />
              </div>
            </div>
          </a-timeline-item>
        </div>
      </a-timeline>
    </div>
    <span class="more">更多</span>
  </a-popover>
</template>
<script>
import { getSFDataList } from '@/api/patient'
import moment from 'moment'
import _ from 'lodash'

export default {
  data() {
    return {
      visible: false,
      list: []
    }
  },
  computed: {
    show() {
      return !_.isEmpty(this.list)
    }
  },
  props: {
    patientId: {
      type: Number
    }
  },
  created() {
    var that = this
    var param = new URLSearchParams()
    param.append('patientId', this.patientId)
    getSFDataList(param)
      .then(res => {
        if (!_.isEmpty(res.data)) {
          that.list = res.data
        } else {
          that.visible = false
        }
      })
  },
  methods: {
    moment,
    hide() {
      this.visible = false
    },
    jump(v) {
      this.visible = false
      if (v.type === 3) {
        this.$router.push('/list/task/' + v.patientBasisId)
      } else if (v.type === 4) {
        this.$router.push('/jxjzq/' + v.patientBasisId)
      } else if (v.type === 2) {
        this.$router.push('/list/task/' + v.patientBasisId + '/11')
      }
    }
  }
};
</script>
<style lang="less" scoped>
.visitInfo {
  padding: 20px;
  padding-bottom: 0px;
  padding-top: 40px;
  height: 200px;
  overflow: auto;
}

.visitContent {
  .visitYear {
    display: block;
    background: #cbe5f7;
    border-radius: 50%;
    font-size: 14px;
    color: #54bde7;
    height: 25px;
    width: 25px;
    text-align: center;
    line-height: 25px;
    position: relative;
    left: 5px;
  }

  .visitYearText {
    display: block;
    font-size: 12px;
  }
}

.visiItem {
  height: 50px;
  width: 194px;
  padding: 5px;
  border: 1px solid #dddddd;
  margin-left: 10px;
  position: relative;
  top: -15px;
  cursor: pointer;

  .visiItemTitle {
    margin: 0;
    overflow: hidden;

    .visiItemName {
      font-size: 12px;
    }

    .visiItemTime {
      font-size: 12px;
      float: right;
      color: #9dadb3;
    }
  }
}

.more {
  color: #1890ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>