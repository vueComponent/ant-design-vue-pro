<template>
  <a-list :loading="loading" :data-source="data" :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card class="ant-pro-pages-list-projects-card" hoverable>
        <img slot="cover" :src="item.cover" :alt="item.title" />
        <a-card-meta :title="item.title">
          <template slot="description">
            <ellipsis :length="50">{{ item.description }}</ellipsis>
          </template>
        </a-card-meta>
        <div class="cardItemContent">
          <span>{{ item.updatedAt | fromNow }}</span>
          <div class="avatarList">
            <avatar-list size="mini">
              <avatar-list-item
                v-for="(member, i) in item.members"
                :key="`${item.id}-avatar-${i}`"
                :src="member.avatar"
                :tips="member.name"
              />
            </avatar-list>
          </div>
        </div>
      </a-card>
    </a-list-item>
  </a-list>
</template>

<script>
import moment from 'moment'
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.AvatarItem

export default {
  name: 'Project',
  components: {
    AvatarList,
    AvatarListItem,
    Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  data () {
    return {
      data: [],
      form: this.$form.createForm(this),
      loading: true
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      this.$http.get('/list/article', { params: { count: 8 } }).then(res => {
        console.log('res', res)
        this.data = res.result
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
