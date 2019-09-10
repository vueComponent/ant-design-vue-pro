<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small"  icon="user" />
          <span>上海肺科医院</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0" @click="$refs.userCenterModal.showModal()">
              <a-icon type="user"/>
              <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="1"  @click="$refs.changePassword.showModal()">
              <a-icon type="setting"/>
              <span>修改密码</span>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <user-center ref="userCenterModal"></user-center>
    <change-password ref="changePassword"></change-password>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import userCenter from './userCenter'
import changePassword from './changePassword'
import { loginOut } from '@/api/login';
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    userCenter,
    changePassword
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          loginOut().then(res => {
            if(res.code==0){
              that.$message.success(res.msg);
              that.$router.push({ name: 'login' });
            }
          })
        },
        onCancel () {
        }
      })
    },
    userCenter(){
      // thi.userCenterModal
    }
  }
}
</script>
