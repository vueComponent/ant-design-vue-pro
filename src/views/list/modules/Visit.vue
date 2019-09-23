<template>
  <a-popover trigger="click" v-model="visible">
    <div class="visitInfo" slot="content">
      <a-timeline>
        <a-timeline-item>
          <div slot="dot">
            <div class="visitContent">
              <span class="visitYear"><a-icon type="file-text" /></span>
              <span class="visitYearText">第1年</span>
            </div>
          </div>
          <div class="visiItem">
            <p class="visiItemTitle">
              <span class="visiItemName">半年随访</span>
              <span class="visiItemTime">
                <a-icon type="clock-circle" />
                2019-08-01
              </span>
            </p>
            <div class="visiItemPro"><a-progress :percent="30" showInfo="false" /></div>
          </div>
        </a-timeline-item>
        <a-timeline-item>
          <div class="visiItem">
            <p class="visiItemTitle">
              <span class="visiItemName">半年随访</span>
              <span class="visiItemTime">
                <a-icon type="clock-circle" />
                2019-08-01
              </span>
            </p>
            <div class="visiItemPro"><a-progress :percent="30" showInfo="false" /></div>
          </div>
        </a-timeline-item>
        <a-timeline-item color="red">
          <div class="visiItem">
            <p class="visiItemTitle">
              <span class="visiItemName">半年随访</span>
              <span class="visiItemTime">
                <a-icon type="clock-circle" />
                2019-08-01
              </span>
            </p>
            <div class="visiItemPro"><a-progress :percent="30" showInfo="false" /></div>
          </div>
        </a-timeline-item>
        <a-timeline-item>
          <div slot="dot">
            <div class="visitContent">
              <span class="visitYear"><a-icon type="file-text" /></span>
              <span class="visitYearText">第1年</span>
            </div>
          </div>
          <div class="visiItem">
            <p class="visiItemTitle">
              <span class="visiItemName">半年随访</span>
              <span class="visiItemTime">
                <a-icon type="clock-circle" />
                2019-08-01
              </span>
            </p>
            <div class="visiItemPro"><a-progress :percent="30" showInfo="false" /></div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <span>更多</span>
  </a-popover>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      visible: false
    };
  },
  filters: {},
  methods: {
    hide() {
      console.log(111);
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
  .visitInfo{
    padding:20px;
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
  top:-15px;
  .visiItemTitle {
    margin: 0;
    overflow: hidden;
    .visiItemTime {
      font-size: 12px;
      float: right;
      color: #9dadb3;
    }
  }
}
</style>
