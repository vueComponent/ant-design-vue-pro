<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <wang-editor v-on:editorChange="setEditorContent"/>
    </a-card>
    <a-card :bordered='false'>
      <a-form :form="form" layout='inline' :colon='false' labelAlign='left'>
        <a-row>
          <a-col :span='6'>
            <a-form-item :labelCol='{span: 12}' :wrapperCol='{span: 12}'>
              <div slot='label' style='display: flex;flex-direction: column;padding: 15px'>
                <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>封面</span>
                <span style='margin: 0 auto;font-size: 12px;width: 50px;white-space: pre-line;line-height: 20px;color: #90939999'>点击右侧上传封面</span>
              </div>
              <a-upload
                action="https://www.wallbreaker.top/posting/jishiUploadPhoto"
                name="cover"
                list-type="picture-card"
                :file-list="fileList"
                :customRequest="uploadCover"
                :remove="removeCover"
              >
                <div v-if="!fileList.length">
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span='18'>
            <a-row>
              <a-col :span='24'>
                <a-form-item :labelCol='{span: 4}' :wrapperCol='{span: 20}' style='width: 100%'>
                  <div slot='label' style='display: flex;flex-direction: column'>
                    <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>标题</span>
                    <span style='margin: 0 auto;font-size: 12px;width: 50px;white-space: pre-line;line-height: 20px;color: #90939999'>20字以内</span>
                  </div>
                  <a-input placeholder='请输入标题' style='width: 100%' v-decorator="['title']"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter='36'>
              <a-col :span='12'>
                <a-form-item :labelCol='{span: 8}' :wrapperCol='{span: 16}' style='width: 100%'>
                  <div slot='label' style='display: flex;flex-direction: column'>
                    <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>帖子主题</span>
                    <span style='margin: 0 auto;font-size: 12px;width: 60px;white-space: pre-line;line-height: 20px;color: #90939999'>可作为用户的筛选条件</span>
                  </div>
                  <a-select placeholder='请选择' style='width: 100%' v-decorator="['labelId']">
                    <a-select-option value="21">求职信息</a-select-option>
                    <a-select-option value="22">学习天地</a-select-option>
                    <a-select-option value="23">校园活动</a-select-option>
                    <a-select-option value="24">生活指南</a-select-option>
                    <a-select-option value="25">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span='12'>
                <a-form-item :labelCol='{span: 8}' :wrapperCol='{span: 16}' style='width: 100%'>
                  <div slot='label' style='display: flex;flex-direction: column'>
                    <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>owner/作者</span>
                    <span style='margin: 0 auto;font-size: 12px;width: 100px;white-space: pre-line;line-height: 20px;color: #90939999'>对用户不显示，便于进行推文管理</span>
                  </div>
                  <a-input placeholder='请输入作者名称/昵称' v-decorator="['owner']"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item>
            <div style='height: 50px;margin-left: 20px'>
              <a-checkbox style='color: rgba(0, 0, 0, 0.85);' v-decorator='["hasLink"]'>
                <span style='font-weight: bold;font-size: 16px'>跳转链接   </span>
                <span style='color: #90939999'>用户在帖子底部点击可跳转对应页面  </span>
              </a-checkbox>
              <a style='text-decoration: underline'>查看效果图</a>
            </div>
          </a-form-item>
        </a-row>
        <a-row>
          <a-col :span='6'>
            <a-form-item :labelCol='{span: 8}' :wrapperCol='{span: 16}' style='width: 100%'>
              <div slot='label' style='display: flex;flex-direction: column'>
                <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>链接标题</span>
                <span style='margin: 0 auto;font-size: 12px;width: 70px;white-space: pre-line;line-height: 20px;color: #90939999'>15个字以内</span>
              </div>
              <a-input placeholder='请输入标签链接' v-decorator="['linkTitle']"/>
            </a-form-item>
          </a-col>
          <a-col :span='18'>
            <a-form-item :labelCol='{span: 4}' :wrapperCol='{span: 20}' style='width: 100%'>
              <div slot='label' style='display: flex;flex-direction: column'>
                <span style='text-align: center;font-weight: bold'>链接</span>
              </div>
              <a-input placeholder='仅支持微信公众号推文和问卷星链接' v-decorator="['linkUrl']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter='96'>
          <a-col :span='18'>
            <a-checkbox style='height: 30px;line-height: 30px;margin-left: 20px'>我已阅读并同意遵循</a-checkbox>
            <a style='text-decoration: underline'>《济星云社区管理规范》</a>
          </a-col>
          <a-col :span='1'>
            <a-button @click="save" type='primary'>保存</a-button>
          </a-col>
          <a-col :span='1'>
            <a-button @click="saveAndPublish" type='primary'>保存并发布</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <AvatarModal/>
  </page-header-wrapper>
</template>

<script>
import WangEditor from '@/components/Editor/WangEditor'

export default {
  components: { WangEditor }
}
</script>

<script>
// import E from 'wangeditor'
// const editor = new E('#editor')
// editor.create()
import WangEditor from '@/components/Editor/WangEditor'
import AvatarModal from '@/viewsOfOld/account/settings/AvatarModal'

import request from '@/utils/request'
import storage from 'store'
import { ROLE_ID } from '@/store/mutation-types'

export default {
  name: 'newPosting',
  components: {
    WangEditor,
    AvatarModal
  },
  data () {
    return {
      imageUrl: '',
      loading: false,
      fileList: [],
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  methods: {
    change () {
      console.log('test')
    },
    save () {
      this.form.validateFields((err, value) => {
        if(err){
          console.log(err)
        }
        if(storage.get(ROLE_ID)=='organization'){
          request({
            url: '/posting/organizationCreatePosting',
            method: 'post',
            data: {
              ...value,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
            })
        } else if(storage.get(ROLE_ID)=='admin') {
          request({
            url: '/posting/adminCreatePosting',
            method: 'post',
            data: {
              ...value,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
            })
        }
      })
    },
    saveAndPublish () {
      console.log('')
      this.form.validateFields((err, value) => {
        if(err){
          console.log(err)
        }
        if(storage.get(ROLE_ID)=='organization'){
          request({
            url: '/posting/organizationCreatePosting',
            method: 'post',
            data: {
              ...value,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              request({
                url: '/posting/organizationPublishPosting/' + res.data.id,
                method: 'get',
              })
                .then(res2 =>{
                  console.log(res2)
                })
            })
        } else if(storage.get(ROLE_ID)=='admin') {
          request({
            url: '/posting/adminCreatePosting',
            method: 'post',
            data: {
              ...value,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              request({
                url: '/posting/adminPublishPosting/' +res.data.id,
                method: 'get',
              })
                .then(res2 =>{
                  console.log(res2)
                })
            })
        }
      })
    },
    setEditorContent (data) {
      // console.log('success')
      this.content=data
    },
    uploadCover (event) {
      console.log(event)
      this.loading = true
      var file = event.file
      console.log(file)
      let formData = new FormData();
      formData.append('file', file);
      request({
        url: '/posting/jishiUploadPhoto',
        method: 'post',
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      })
        .then(res => {
          console.log(res)
          this.fileList = [
            {
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: res.data
            },
          ]
          this.loading = false
        })
    },
    removeCover (e) {
      console.log(e)
      this.fileList.shift()
      return true
    }
  }
}
</script>

<style scoped>

</style>
