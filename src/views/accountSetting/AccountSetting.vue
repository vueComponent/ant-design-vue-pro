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
                  <a-input v-model="nickName" :disabled="canEditName"/>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <br><br>
                <a style='text-decoration: underline' @click="showEditNameModal" v-if="canModifyName">修改名称</a><br>
                <span style='color: #90939999'><a-icon type="exclamation-circle" theme='filled'/> 恒星号名称每年仅支持修改一次</span>
              </a-col>
            </a-row>
            <br>
            <a-row :gutter='24'>
              <a-col :span='17'>
                <a-form-item>
                  <a-textarea placeholder='这个人很懒，什么都没留下' :autoSize='{minRows: 5, maxRows:5}' style='position: relative' @change="descriptionLimitNumber" v-model="description"/>
                  <span style='position: absolute;bottom: 0;right:3px;height: 25px'>{{ number }}/140</span>
                  <span v-if="descriptionLimit" slot="help" style="color: red">字数已达上限！</span>
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
                <a-button type='primary' @click="updateMessage">更新信息</a-button>
              </a-col>
            </a-row>
            <a-row>
              <span style='color: #90939999'>若有疑问请与破壁工作室取得联系，联系方式：</span>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-modal
      v-model="editModal.visible"
      title="修改名称"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForEditName"
      width="30%">
      <a-form-item>
        <a-input v-model="newName" @change="newNameLimitNumber"/>
        <span v-if="newNameLimit" slot="help" style="color: red" >字数已达上限！</span>
      </a-form-item>
    </a-modal>
    <a-modal
      v-model="confirmModal.visible"
      title="确认修改"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForConfirmEditName"
      width="30%">
      <p>确认将名字修改成“{{newName}}”吗</p>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import storage from 'store'
import { DETAIL } from '@/store/mutation-types'
// import request from '@/utils/request'

export default {
  name: 'AccountSetting',
  data () {
    const detail = storage.get(DETAIL)
    return {
      description: '',
      ...detail,
      descriptionLimit: false,
      newNameLimit: false,
      canEditName: true,
      editModal: { visible: false },
      confirmModal: { visible: false },
      newName: '',
      canModifyName: true
    }
  },
  beforeCreate () {
    console.log(storage.get(DETAIL))
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  computed: {
    number: function () {
      return this.description.length
    }
  },
  methods: {
   descriptionLimitNumber (e) {
     if (this.description.length >= 140) {
       this.description = this.description.slice(0, 140)
       this.descriptionLimit = true
     } else {
       this.descriptionLimit = false
     }
   },
    newNameLimitNumber () {
     if (this.newName.length >= 15) {
       this.newName = this.newName.slice(0, 15)
       this.newNameLimit = true
     } else {
       this.newNameLimit = false
     }
    },
    showEditNameModal () {
     this.editModal.visible = true
    },
    tapOkForEditName () {
     console.log('ok')
      this.editModal.visible = false
      this.confirmModal.visible = true
    },
    tapOkForConfirmEditName () {
     console.log('okk')
    },
    updateMessage () {
      // this.form.validateFields((err, value) => {
      //   if (err) {
      //     console.log(err)
      //   }
      //   console.log(value)
      //   request({
      //     url: '/posting/organizationEditPosting',
      //     method: 'patch',
      //     data: {
      //       id: this.$route.params.postingId,
      //       ...value,
      //       content: this.content
      //     }
      //   })
      //     .then(res => {
      //       console.log(res)
      //     })
      // })
    }
  }
}
</script>

<style scoped>

</style>
