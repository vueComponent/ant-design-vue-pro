<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form>
        <a-row>
          <a-col :span='18'>
            <a-row>
              <a-col :span='4' :offset='5'>
                <a-avatar :src="avatarUrl" style='width: 128px;height: 128px'/>
              </a-col>
              <a-col :span='2' :offset='1'>
                <div style='height: 128px;position: relative'>
                  <a style='position: absolute;bottom: 0;text-decoration: underline'>修改密码</a>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter='24'>
              <a-col :span='17'>
                <a-form-item label='恒星号名称' :colon='false'>
                  <a-input v-model="nickName"/>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <br><br>
                <a style='text-decoration: underline'>修改名称</a><br>
                <span style='color: #90939999'><a-icon type="exclamation-circle" theme='filled'/> 恒星号名称每年仅支持修改一次</span>
              </a-col>
            </a-row>
            <br>
            <a-row :gutter='24'>
              <a-col :span='17'>
                <a-form-item>
                  <a-textarea placeholder='这个人很懒，什么都没留下' :autoSize='{minRows: 5, maxRows:5}' style='position: relative' @change="limitNumber" v-model="description"/>
                  <span style='position: absolute;bottom: 0;right:3px;height: 25px'>{{ number }}/140</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter='24'>
              <a-col :span='4'>
                <span>联系人手机号</span>
              </a-col>
              <a-col :span='13'>
                <span style='color: #90939999'><a-icon type="exclamation-circle" theme='filled'/> 不对外展示，仅用于破壁工作室对接</span>
              </a-col>
            </a-row>
            <a-row :gutter='24'>
              <a-col :span='4'>
                <a-form-item>
                  <a-input v-model="teacherName"/>
                </a-form-item>
              </a-col>
              <a-col :span='13'>
                <a-form-item>
                  <a-input v-model="teacherContact"/>
                </a-form-item>
              </a-col>
              <a-col>
                <a-icon type='plus-circle' style='font-size: 30px'/>
              </a-col>
            </a-row>
            <br><br><br><br><br><br>
            <a-row>
              <a-col :span='2' :offset='15'>
                <a-button type='primary'>更新信息</a-button>
              </a-col>
            </a-row>
            <a-row>
              <span style='color: #90939999'>若有疑问请与破壁工作室取得联系，联系方式：</span>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import storage from 'store'
import { DETAIL } from '@/store/mutation-types'

export default {
  name: 'AccountSetting',
  data () {
    const detail = storage.get(DETAIL)
    return {
      description: '',
      ...detail
    }
  },
  computed: {
    number: function () {
      return this.description.length
    }
  },
  methods: {
   limitNumber (e) {
     if (this.description.length >= 140) {
       this.description = this.description.slice(0, 140)
     }
   }
  }
}
</script>

<style scoped>

</style>
