<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form>
        <a-row>
          <a-col :span='18'>
            <a-row>
              <a-col :span='4' :offset='5'>
                <a-avatar src='http://st.so.com/stu?a=siftview&imgkey=t024632b9b804821bd9.jpg&cut=0&fromurl=http://www.yhd.com/S-theme/22432/&cut=0#sn=13&id=847f8c63d328480ca7fc15be3d66d59a' style='width: 128px;height: 128px'/>
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
                  <a-input/>
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
                  <a-textarea placeholder='这个人很懒，什么都没留下' :autoSize='{minRows: 5, maxRows:5}' style='position: relative'/>
                  <span style='position: absolute;bottom: 0;right:3px;height: 25px'>0/140</span>
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
                  <a-input/>
                </a-form-item>
              </a-col>
              <a-col :span='13'>
                <a-form-item>
                  <a-input/>
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
export default {
  name: 'AccountSetting'
}
</script>

<style scoped>

</style>
