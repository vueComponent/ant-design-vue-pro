<template>
  <div class="card-body nav2Styles">
    <div class="col-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">โปรโมชั่น</h1>
    </div>

    <!-- list promotions -->
    <div class="container">
      <br />
      <div class="row justify-content-md-center">
        <img
          class="avatar border-gray"
          src="/img/newImage/Promotion01.png"
          alt="..."
          :style="imagePromotion"
        />
      </div>
      <br />
      <div class="row justify-content-md-center">
        <img
          class="avatar border-gray"
          src="/img/newImage/Promotion02.png"
          alt="..."
          :style="imagePromotion"
        />
      </div>
      <br />
      <div class="row justify-content-md-center">
        <img
          class="avatar border-gray"
          src="/img/newImage/Promotion03.png"
          alt="..."
          :style="imagePromotion"
        />
      </div>
    </div>
    <br />
  </div>
</template>
<script>

export default {
  data() {
    return {
      nav2Styles: {
        backgroundColor: "black",
        height: "90%"
      },
      textColerHeader: {
        color: "#ffd373"
      }
    }
  }
};
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;
}

.textColerHeader {
  color: #ffd373;
  font-size: 42px;
  @media (max-width: 420px) {
    font-size: 20px;
  }
}
</style>
