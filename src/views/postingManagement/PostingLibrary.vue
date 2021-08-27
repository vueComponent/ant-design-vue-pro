<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :span='6'>
          <a-input-search placeholder='请输入' v-model='search'/>
        </a-col>
        <a-col :span='4' :offset='14'>
          <a-button type='primary'>新建帖子</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-list
          :grid="{gutter: 24, column:3}"
          :dataSource="data"
          class="card-list"
          style='margin-top: 15px'
          size="large"
          :pagination="pagination">
          <a-list-item slot="renderItem" slot-scope="item">
            <template>
              <a-card :hoverable="true" size='small'>
                <a-card-meta>
                  <span slot="title">{{ item.title }}</span>
                  <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" shape='square'/>
                  <div class="meta-content" slot="description">
                    <p style='display: -webkit-box;-webkit-line-clamp:2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;'>{{ item.content }}</p>
                    <span style='float: right'>更新于{{item.updateTime}}   <a-icon type='delete'  style='font-size: 20px'/>   <a-icon type='form' style='font-size: 20px'/></span>
                  </div>
                </a-card-meta>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
const data = []
for (let i = 0; i < 18; i++) {
  data.push({
    id: i,
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    updateTime: '7月27日'
  })
}

const pagination = { showQuickJumper: true, total: 85, pageSize: 12, showTotal: total => `总共${total}个项目` }

export default {
  name: 'postingLibrary',
  data () {
    return {
      data,
      search: '',
      pagination
    }
  }
}
</script>

<style scoped>
.card-avatar {
  width: 72px;
  height: 72px;
}
</style>
