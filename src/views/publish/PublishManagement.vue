<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-row :gutter="96">
          <a-col :span="1"><a-button :type="this.interface==='published'?'primary':'default'" @click="() => this.interface='published'">已发布</a-button> </a-col>
          <a-col :span="1"><a-button :type="this.interface==='draft'?'primary':'default'" @click="() => this.interface='draft'">草稿箱</a-button></a-col>
          <a-col :span="1"><a-button :type="this.interface==='garbage'?'primary':'default'" @click="() => this.interface='garbage'">垃圾箱</a-button></a-col>
        </a-row>
        <div style="height: 20px"/>
        <PublishedBox v-show="this.interface==='published'"></PublishedBox>
        <DraftBox v-show="this.interface==='draft'"></DraftBox>
        <GarbageBox v-show="this.interface==='garbage'"></GarbageBox>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import PublishedBox from '@/views/publish/PublishedBox'
import DraftBox from '@/views/publish/DraftBox'
import GarbageBox from '@/views/publish/GarbageBox'

export default {
  name: 'PublishManagement',
  components: { GarbageBox, DraftBox, PublishedBox },
  data () {
    return {
      interface: 'published'
    }
  }
}
</script>

<style scoped>

</style>
