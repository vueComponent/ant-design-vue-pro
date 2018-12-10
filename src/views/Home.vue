<template>
  <div class="home">
    <div class="banner">
      <img alt="Vue logo" style="width: 64px; height: 64px" src="../assets/logo.png">
      <h3>Welcome to Your Vue.js App</h3>
    </div>

    <br/>

    <h2># Trend 组件 </h2>

    <a-divider> 正常 </a-divider>

    <a-card>

      <trend flag="up" style="margin-right: 16px;">
        <span slot="term">工资</span>
        5%
      </trend>
      <trend flag="up" style="margin-right: 16px;">
        <span slot="term">工作量</span>
        50%
      </trend>
      <trend flag="down">
        <span slot="term">身体状态</span>
        50%
      </trend>

    </a-card>

    <a-divider> 颜色反转 </a-divider>

    <a-card>

      <trend flag="up" :reverse-color="true" style="margin-right: 16px;">
        <span slot="term">工资</span>
        5%
      </trend>
      <trend flag="down" :reverse-color="true" style="margin-right: 16px;">
        <span slot="term">工作量</span>
        50%
      </trend>

    </a-card>

    <a-divider> AvatarList </a-divider>

    <a-card>
      <avatar-list :max-length="3">
        <avatar-list-item tips="Jake" src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" />
        <avatar-list-item tips="Andy" src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
      </avatar-list>

      <a-divider type="vertical" style="margin: 0 16px" />

      <avatar-list size="mini">
        <avatar-list-item tips="Jake" src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" />
        <avatar-list-item tips="Andy" src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png" />
        <avatar-list-item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
      </avatar-list>
    </a-card>
  </div>
</template>

<script>
  // @ is an alias to /src

  import Trend from '@/components/Trend'
  import AvatarList from '@/components/AvatarList'

  const AvatarListItem = AvatarList.AvatarItem

  export default {
    name: 'Home',
    components: {
      Trend,
      AvatarList,
      AvatarListItem
    }
  }
</script>

<style scoped>
  .home {
    width: 900px;
    margin: 0 auto;
  }
  .home > .banner {
    text-align: center;
    padding-top: 25px;
    margin: 25px 0;
  }
</style>
