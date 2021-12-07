<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ลืมรหัสผ่าน</h1>
    </div>
    <div class="container imageCard">
      <div class="wrapper-full-page marginToTop">
        <div class="col-sm-12">
          <label class="kanitFonts2 labelStyleInput">หมายเลขโทรศัพท์*</label>
        </div>
        <input
          type="search"
          class="form-control kanitFonts1 inputStyle"
          placeholder="xxx-xxx-xxxx"
        />
        <br />
        <div class="itemTextCenter">
        <router-link class="navbar-brand" to="/user/login">
            <img
              class="img-responsive imageGotoPasword"
              src="/img/newImage/BT_Password.png"
              alt="..."
            />
        </router-link>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
hr.new5 {
  border: 1px solid white;
  border-radius: 0px;
}

.nav2Styles {
  background-color: black;
  margin-top: 12%;
  height: 740px;

  @media (max-width: 420px) {
    margin-top: 50%;
    height: 580px;
  }
}
.textColerHeader {
  color: #ffd373;
}
.textFooterBoxLogin {
  color: #757575;
  font-size: 24px;
}
.itemTextCenter {
  text-align: center;
}
.marginToTop {
  padding-top: 15px;
}
.labelStyleInput {
  // margin-left: 25px;
  width: 90%;
  font-size: 25px;
  @media (max-width: 420px) {
    font-size: 16px;
  }
}
.inputStyle {
  background-color: black;
  border-width: 0px;
  width: 100%;
  color: white;
  font-size: 18px;

  @media (max-width: 420px) {
    background-color: black;
    border-width: 0px;
    width: 100%;
    color: white;
    font-size: 14px;
  }
}
.imageGotoPasword {
  width: 40%;

  @media (max-width: 420px) {
    width: 50%;
  }
}
.imageCard {
  background-image: url(/img/newImage/BG_Detail01.png);
  background-size: contain no-repeat;
  background-position: center;
  width: 100%;
  border-radius: 10px;

  @media (max-width: 420px) {
    background-size: contain no-repeat;
    background-position: center;
    width: 100%;
    border-radius: 10px;
  }
}
</style>
