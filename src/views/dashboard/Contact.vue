<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ติดต่อเรา</h1>
    </div>
    <div class="container">
      <br />
      <div class="row justify-content-md-center">
        <div class="col-6 text-center">
          <a class="navbar-brand" href="#">
            <img
              class="img-responsive imageButton"
              src="/img/newImage/BT_Line.png"
              alt="..."
            />
          </a>
        </div>
        <div class="col-6 text-center">
          <a class="navbar-brand" href="#">
            <img
              class="img-responsive imageButton"
              src="/img/newImage/BT_Tell.png"
              alt="..."
            />
          </a>
        </div>
      </div>
      <br />
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;

  @media (max-width: 420px) {
    height: 500px;
    
  }
}
.textColerHeader {
  color: #ffd373;
}
.imageBackgroundMain {
  background-image: url(/img/newImage/backgroungImage.png);
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 420px) {
    // font-size: 24px;
  }
}

.imageButton {
  width: 80%;
  @media (max-width: 420px) {
    width: 100%;
  }
}
</style>
