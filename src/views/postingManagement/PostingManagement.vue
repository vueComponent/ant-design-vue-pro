<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="[0,16]">
          <span style="font-weight: bold;height: 30px;line-height: 30px">最近编辑</span>
          <a-button style="float: right">全部帖子素材</a-button>
        </a-row>
        <a-list
          rowKey="id"
          :grid="{gutter: 24, column:3}"
          :dataSource="nearlyData"
          class="card-list"
          style="margin-top: 15px"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template>
              <a-card :hoverable="true" size="small">
                <a-card-meta>
                  <span slot="title">{{ item.title }}</span>
                  <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" shape="square"/>
                  <div class="meta-content" slot="description">
                    <p style="display: -webkit-box;-webkit-line-clamp:2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;">{{ item.content }}</p>
                    <span style="float: right">更新于{{item.updateTime}}  <a-icon type="form"/></span>
                  </div>
                </a-card-meta>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <a-card style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-row :gutter="[0,0]" style="font-weight: bold;margin-bottom: 10px">已发布</a-row>
        <a-row :gutter="[0,0]">
          <a-col :span="6">
            <a-radio-group v-model="radio">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="notDeleted">未删除</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
            <a-input-search placeholder="请输入"/>
          </a-col>
          <a-col :span="4" :offset="8">
            <a-button type="primary">新建帖子</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
            <a-list-item :key="index" v-for="(item, index) in publishedData">
              <a-list-item-meta :description="item.description">
                <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
                <a slot="title">{{ item.title }}</a>
              </a-list-item-meta>
              <div slot="actions">
                <a @click="edit(item)">查看</a>
              </div>
              <div slot="actions">
                <a>删除</a>
              </div>
              <div class="list-content">
                <div class="list-content-item">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div class="list-content-item">
                  <span>开始时间</span>
                  <p>{{ item.startAt }}</p>
                </div>
                <div class="list-content-item">
                  <span><a-icon type="eye"/>{{ item.views }}</span>
                </div>
                <div class="list-content-item">
                  <span><a-icon type="star"/>{{ item.favorite }}</span>
                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
const nearlyData = []
for (let i = 0; i < 3; i++) {
  nearlyData.push({
    id: i,
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    updateTime: '7月27日'
  })
}

const publishedData = [
  {
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    description: '那是一种内在的东西， 他们到达不了，也无法触及的',
    owner: '付晓晓',
    startAt: '2018-07-26 22:44',
    views: 12123,
    favorite: 12123
  },
  {
    title: 'Angular',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    owner: '曲丽丽',
    startAt: '2018-07-26 22:44',
    views: 12123,
    favorite: 12123
  },
  {
    title: 'Ant Design',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    description: '生命就像一盒巧克力，结果往往出人意料',
    owner: '林东东',
    startAt: '2018-07-26 22:44',
    views: 12123,
    favorite: 12123
  },
  {
    title: 'Ant Design Pro',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    owner: '周星星',
    startAt: '2018-07-26 22:44',
    views: 12123,
    favorite: 12123
  },
  {
    title: 'Bootstrap',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    owner: '吴加好',
    startAt: '2018-07-26 22:44',
    views: 12123,
    favorite: 12123
  }
]
export default {
  name: 'PostingManagement',
  data () {
    return {
      nearlyData,
      publishedData,
      radio: 'all'
    }
  }
}
</script>

<style lang="less" scoped>
.card-avatar {
  width: 72px;
  height: 72px;
}
.list-content-item {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
      line-height: 20px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
}
</style>
