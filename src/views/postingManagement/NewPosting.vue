<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <wang-editor v-on:editorChange="setEditorContent" :value="content"/>
    </a-card>
    <a-card :bordered='false'>
      <a-form :form="form" layout='inline' :colon='false' labelAlign='left' hideRequiredMark>
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
                    <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'><span class='required'>*</span>标题</span>
                    <span style='margin: 0 auto;font-size: 12px;width: 50px;white-space: pre-line;line-height: 20px;color: #90939999'>20字以内</span>
                  </div>
                  <a-input placeholder='请输入标题' style='width: 100%' :maxLength="20" v-decorator="['title',{initialValue:data.title, rules: [{ required: true, message: '请输入标题' , whitespace: true},{max: 20, message: '标题不能超过20个字'}] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter='36'>
              <a-col :span='12'>
                <a-form-item :labelCol='{span: 8}' :wrapperCol='{span: 16}' style='width: 100%'>
                  <div slot='label' style='display: flex;flex-direction: column'>
                    <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'><span class='required'>*</span>帖子主题</span>
                    <span style='margin: 0 auto;font-size: 12px;width: 60px;white-space: pre-line;line-height: 20px;color: #90939999'>可作为用户的筛选条件</span>
                  </div>
                  <a-select placeholder='请选择' style='width: 100%' v-decorator="['labelId',{initialValue:data.labelId, rules: [{ required: true, message: '请选择板块' , whitespace: true}] }]">
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
                  <a-input placeholder='请输入作者名称/昵称' v-decorator="['owner',{initialValue:data.owner}]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item :labelCol='{span: 2}' :wrapperCol='{span: 22}' style='width: 100%'>
            <div slot='label' style='display: flex;flex-direction: column'>
              <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'><span class='required'>*</span>摘要</span>
              <span style='margin: 0 auto;font-size: 12px;width: 50px;white-space: pre-line;line-height: 20px;color: #90939999'>40字以内</span>
            </div>
            <a-input placeholder='请输入摘要' style='width: 100%' :maxLength="40" v-decorator="['brief',{initialValue:data.brief, rules: [{ required: true, message: '请输入摘要' }] }]"/>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item>
            <div style='height: 50px;margin-left: 20px'>
              <a-checkbox style='color: rgba(0, 0, 0, 0.85);' v-model="hasLink" v-decorator='["hasLink"]'>
                <span style='font-weight: bold;font-size: 16px'>跳转链接   </span>
                <span style='color: #90939999'>用户在帖子底部点击可跳转对应页面  </span>
              </a-checkbox>
              <a style='text-decoration: underline' @click="() => this.linkCardPreviewShow=true">效果示意图</a>
            </div>
          </a-form-item>
        </a-row>
        <a-row v-if="hasLink">
          <a-col :span='6'>
            <a-form-item :labelCol='{span: 8}' :wrapperCol='{span: 16}' style='width: 100%'>
              <div slot='label' style='display: flex;flex-direction: column'>
                <span style='text-align: center;font-weight: bold;height: 20px;line-height: 20px'>链接标题</span>
                <span style='margin: 0 auto;font-size: 12px;width: 70px;white-space: pre-line;line-height: 20px;color: #90939999'>15个字以内</span>
              </div>
              <a-input placeholder='请输入标签链接' v-decorator="['linkTitle',{initialValue:data.linkTitle}]"/>
            </a-form-item>
          </a-col>
          <a-col :span='18'>
            <a-form-item :labelCol='{span: 4}' :wrapperCol='{span: 20}' style='width: 100%'>
              <div slot='label' style='display: flex;flex-direction: column'>
                <span style='text-align: center;font-weight: bold'>链接</span>
              </div>
              <a-input placeholder='仅支持微信公众号推文和问卷星链接' v-decorator="['linkUrl',{initialValue:data.linkUrl}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter='96'>
          <a-col :span='18'>
            <a-checkbox v-model='agreeCb' style='height: 30px;line-height: 30px;margin-left: 20px'>我已阅读并同意遵循</a-checkbox>
            <a target="_blank" href="https://jixingyun.tongji.edu.cn/%E6%B5%8E%E6%98%9F%E4%BA%91%E7%A4%BE%E5%8C%BA%E7%AE%A1%E7%90%86%E8%A7%84%E8%8C%83.html" style='text-decoration: underline'>《济星云社区管理规范》</a>
            <div v-show='!agreeCb && agreeTip' style='margin-left: 40px;color: #f5222d;'>请阅读并同意</div>
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
    <a-modal
      v-model="linkCardPreviewShow"
      @ok="() => this.linkCardPreviewShow=false"
      width="300px">
      <img src="./linkCard.png" style="width: 250px;"/>
    </a-modal>
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
      data: {},
      hasLink: false,
      agreeCb: true,
      agreeTip: false,
      linkCardPreviewShow: false,
      content: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  created () {
    if (this.$route.params.postingId) {
      request({
        url: '/posting/adminGetPostingDetail/' + this.$route.params.postingId,
        method: 'get'
      })
        .then(res => {
          console.log(res)
          const data = res.data
          const neededData = {
            content: data.content,
            title: data.title,
            labelId: data.labelId.toString(),
            owner: data.owner,
            brief: data.brief,
            hasLink: Boolean(data.linkUrl),
            linkTitle: data.linkTitle,
            linkUrl: data.linkUrl
          }
          this.data = neededData
          this.hasLink = neededData.hasLink
          this.content = data.content
          // console.log(data.content)
          if(data.firstPicUrl) {
            this.fileList = [
              {
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: data.firstPicUrl
              }
            ]
          }
        })
    }
  },
  methods: {
    change () {
      console.log('test')
    },
    save () {
      this.agreeTip = true
      this.form.validateFields((err, value) => {
        if(err || !this.agreeCb){
          console.log(err)
          return
        }
        let firstPicUrl = null
        if(this.fileList && this.fileList.length){
          firstPicUrl = this.fileList[0].url
        }
        if(storage.get(ROLE_ID)=='organization'){
          request({
            url: '/posting/organizationCreatePosting',
            method: 'post',
            data: {
              ...value,
              released: false,
              firstPicUrl,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              if(res.success) {
                this.$message.success(res.msg || '保存成功')
              }else {
                this.$message.error(res.msg || '保存失败')
              }
            })
        } else if(storage.get(ROLE_ID)=='admin') {
          request({
            url: '/posting/adminCreatePosting',
            method: 'post',
            data: {
              ...value,
              released: false,
              firstPicUrl,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              if(res.success) {
                this.$message.success(res.msg || '保存成功')
              }else {
                this.$message.error(res.msg || '保存失败')
              }
            })
        }
      })
    },
    saveAndPublish () {
      this.agreeTip = true
      this.form.validateFields((err, value) => {
        if(err || !this.agreeCb){
          console.log(err)
          return
        }
        let firstPicUrl = null
        if(this.fileList && this.fileList.length){
          firstPicUrl = this.fileList[0].url
        }
        if(storage.get(ROLE_ID)=='organization'){
          request({
            url: '/posting/organizationCreatePosting',
            method: 'post',
            data: {
              ...value,
              released: true,
              firstPicUrl,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              if(res.success) {
                this.$message.success(res.msg || '保存并发布成功')
              }else {
                this.$message.error(res.msg || '保存并发布失败')
              }
              // released: true包含了发布
              // request({
              //   url: '/posting/organizationPublishPosting/' + res.data.id,
              //   method: 'get',
              // })
              //   .then(res2 =>{
              //     console.log(res2)
              //     if(res2.success) {
              //       this.$message.success(res2.msg || '保存并发布成功')
              //     }else {
              //       this.$message.error(res2.msg || '保存并发布失败')
              //     }
              //   })
            })
        } else if(storage.get(ROLE_ID)=='admin') {
          request({
            url: '/posting/adminCreatePosting',
            method: 'post',
            data: {
              ...value,
              released: true,
              firstPicUrl,
              content: this.content
            }
          })
            .then(res => {
              console.log(res)
              if(res.success) {
                this.$message.success(res.msg || '保存并发布成功')
              }else {
                this.$message.error(res.msg || '保存并发布失败')
              }
              // released: true包含了发布
              // request({
              //   url: '/posting/adminPublishPosting/' +res.data.id,
              //   method: 'get',
              // })
              //   .then(res2 =>{
              //     console.log(res2)
              //     if(res2.success) {
              //       this.$message.success(res2.msg || '保存并发布成功')
              //     }else {
              //       this.$message.error(res2.msg || '保存并发布失败')
              //     }
              //   })
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
.required {
  color: #f5222d;
  font-family: SimSun,sans-serif;
}
</style>
