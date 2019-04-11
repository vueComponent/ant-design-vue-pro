<template>
  <a-card :bordered="false" class="ant-pro-components-tag-select">
    <a-form layout="inline">
      <a-form-item label="所属类目">
        <tag-select>
          <tag-select-option value="Category1">类目一</tag-select-option>
          <tag-select-option value="Category2">类目二</tag-select-option>
          <tag-select-option value="Category3">类目三</tag-select-option>
          <tag-select-option value="Category4">类目四</tag-select-option>
          <tag-select-option value="Category5">类目五</tag-select-option>
          <tag-select-option value="Category6">类目六</tag-select-option>
          <tag-select-option value="Category7">类目七</tag-select-option>
          <tag-select-option value="Category8">类目八</tag-select-option>
          <tag-select-option value="Category9">类目九</tag-select-option>
          <tag-select-option value="Category10">类目十</tag-select-option>
        </tag-select>
      </a-form-item>
      <a-divider dashed />
      <a-form-item label="owner">
        <a-row>
          <a-col :md="24">
            <a-select style="max-width: 268px; width: 100%;" mode="multiple" :defaultValue="['a1', 'b2']" @change="handleChange" placeholder="Please select">
              <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">{{ (i + 9).toString(36) + i }}</a-select-option>
            </a-select>
            <a>只看自己的</a>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>

  </a-card>
</template>

<script>
import { TagSelect } from '@/components'
const TagSelectOption = TagSelect.Option

export default {
  components: {
    TagSelect,
    TagSelectOption
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
</style>
