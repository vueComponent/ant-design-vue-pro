<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-sm-8 bgStyle">
        <div class="user-layout-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="less" scoped>
.bgStyle {
  background-color: black;
  // height: 920px;
}
</style>
