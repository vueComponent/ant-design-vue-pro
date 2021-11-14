<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-form-item label="发布板块" :colon="false">
                <a-select :v-decorator="['plate']">
                  <a-select-option value="0">济事</a-select-option>
                  <a-select-option value="1">济人</a-select-option>
                  <a-select-option value="2">同德</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="发布主题" :colon="false">
                <a-select :v-decorator="['theme']">
                  <a-select-option value="0">求职信息</a-select-option>
                  <a-select-option value="1">学习天地</a-select-option>
                  <a-select-option value="2">校园活动</a-select-option>
                  <a-select-option value="3">生活指南</a-select-option>
                  <a-select-option value="4">竞赛</a-select-option>
                  <a-select-option value="5">学术科研</a-select-option>
                  <a-select-option value="6">一起造梦</a-select-option>
                  <a-select-option value="7">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="发布内容" :colon="false">
                <a-input placeholder="标题" :v-decorator="['title']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <wang-editor/>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5">
              <a-form-item label="封面图片" :colon="false"></a-form-item>
              <a-upload
                name="cover"
                list-type="picture-card"
                @change="handleChange"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-col>
            <a-col :span="19">
              <a-row>
                <a-form-item>
                  <a-checkbox style="color: rgba(0, 0, 0, 0.85);" :v-decorator="['hasLink']">跳转链接 用户在帖子底部点击可跳转对应页面</a-checkbox>
                </a-form-item>
              </a-row>
              <a-row>
                <a-col :span="2">
                  <span style="color: rgba(0, 0, 0, 0.85);">链接标题</span>
                </a-col>
                <a-col :span="22">
                  <a-form-item>
                    <a-input v-decorator="['linkTitle']"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="2">
                  <span style="color: rgba(0, 0, 0, 0.85);">链接</span>
                </a-col>
                <a-col :span="22">
                  <a-form-item>
                    <a-input v-decorator="['link']"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="96">
            <a-col :span="1">
              <a-button type="primary">发布</a-button>
            </a-col>
            <a-col :span="1">
              <a-button type="primary">保存</a-button>
            </a-col>
            <a-col :span="1">
              <a-button type="primary">预览</a-button>
            </a-col>
            <a-col :span="16">
              <a-checkbox style="height: 30px;line-height: 30px">我已阅读并同意遵循<a>《济星云社区管理规范》</a></a-checkbox>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<!--<script src="https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js"></script>-->

<script>
import WangEditor from '@/components/Editor/WangEditor'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'PublishArticle',
  components: { WangEditor },
  data () {
    return {
      loading: false,
      imageUrl: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          console.log(value)
        }
      })
    },
    handleChange (info) {
      console.log(info)
      if (info.file.status === 'uploading') {
      //   request({
      //     url: '/posting/jishiUploadPhoto',
      //     method: 'post',
      //     data: {
      //       file:info.file.
      //     }
      //   })
      //     .then(res => {})
      this.loading = true
      return
    }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
