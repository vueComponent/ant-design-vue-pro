<template>
  <div class="card-body nav2Styles">
    <div class="container-fluid">
      <div class="col-sm-12 text-center">
        <h1 class="card-title kanitFonts3 textColerHeader">อื่นๆ</h1>
      </div>
      <div class="container imageBackgroundMain">
        <br />
        <div class="row justify-content-md-center">
          <div class="col-6">
            <a class="navbar-brand" href="#">
              <img
                class="img-responsive imageRowBottom"
                src="/img/newImage/BT_01.png"
                alt="..."
              />
            </a>
          </div>
          <div class="col-6">
            <a class="navbar-brand" href="#">
              <img
                class="img-responsive imageRowBottom"
                src="/img/newImage/BT_02.png"
                alt="..."
              />
            </a>
          </div>
        </div>
        <br />
        <div class="row justify-content-md-center">
          <div class="col-6">
            <a class="navbar-brand" href="#">
              <img
                class="img-responsive imageRowBottom"
                src="/img/newImage/BT_03.png"
                alt="..."
                :style="imageRowBottom"
              />
            </a>
          </div>
          <div class="col-6">
            <a class="navbar-brand" href="#">
              <img
                class="img-responsive imageRowBottom"
                src="/img/newImage/BT_04.png"
                alt="..."
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;
}
.textColerHeader {
  color: #ffd373;
}
.imageRowBottom {
  width: 100%;
}
.imageBackgroundMain {
  background-image: url(/img/newImage/backgroungImage.png);
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 550px;

  @media (max-width: 420px) {
    background-size: contain no-repeat;
    height: 500px;
  }
}
</style>
