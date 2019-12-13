<template>
  <div class="rank">
    <h4 class="title">{{ title }}</h4>
    <ul class="list">
      <li :key="index" v-for="(item, index) in list">
        <span>{{ index + 1 }}</span>
        <span class="download" @click="download(item.id)">{{ item.name }}</span>
        <span>{{ item.downloads }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'RankList',
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: null
    }
  },
  data(){
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL
    }
  },
  methods: {
    download(id) {
      window.open(this.baseUrl + '/index/downLoad?id=' + id)
    }
  }
}
</script>
<style lang="less" scoped>
.rank {
  padding: 0 32px 32px 72px;

  .list {
    margin: 25px 0 0;
    padding: 0;
    list-style: none;

    li {
      margin-top: 16px;

      span {
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
        line-height: 22px;

        &.download {
          cursor: pointer;
          color: #39f;
        }

        &:first-child {
          background-color: #f5f5f5;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-right: 24px;
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
        }

        &.active {
          background-color: #314659;
          color: #fff;
        }

        &:last-child {
          float: right;
        }
      }
    }
  }
}

.mobile .rank {
  padding: 0 32px 32px 32px;
}
</style>