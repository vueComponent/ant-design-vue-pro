<template>
  <div class="card-body nav2Styles">
    <div class="container-fluid">
      <div class="itemTextCenter">
        <h1 slot="header" class="card-title kanitFonts3 textCenter1">การสมัครของคุณสำเร็จ</h1>
        <div class="col-lg-12">
          <label class="kanitFonts2 textCenter2"> ขอบคุณสำหรับการสมัครสมาชิก </label>
        </div>
        <div class="col-lg-12">
          <label class="card-title kanitFonts2 textCenter2"> คุณสามารถใช้ชื่อผู้ใช้ </label>
        </div>

        <div class="col-lg-12">
          <label class="card-title kanitFonts2 textCenter2"> และรหัสผ่านนี้ เพื่อทำการเข้าสู่ระบบ </label>
        </div>
      </div>
      <div class="imageClass imageCard">
        <div class="container-fluid">
          <div class="col-sm-6">
            <h1 class="kanitFonts3 labelStyleInput marginToTop">ชื่อเข้าระบบ</h1>
          </div>
          <input type="email" class="form-control kanitFonts2 inputStyle" placeholder="User Id" />
          <div class="col-sm-6">
            <h2 class="kanitFonts3 labelStyleInput">รหัสผ่าน</h2>
          </div>
          <input type="email" class="form-control kanitFonts2 inputStyle" placeholder="Password" />
          <div class="text-center">
            <router-link class="navbar-brand" to="/user/account">
              <img class="img-responsive imageGotoMainmenu" src="/img/newImage/BT_GotoMenu.png" alt="Go to main page" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <br />
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        userId: '  VIP  :  0908566930',
      },
    }
  },
}
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;
  margin-top: 25%;
  height: 800px;

  @media (max-width: 420px) {
    margin-top: 35%;
    height: 640px;
  }
}

.imageClass {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 'center';
}
.imageLogoUserClass {
  height: 120px;
  width: 120px;
  background-repeat: no-repeat;
  background-size: cover;
  @media (max-width: 988px) {
    background-size: cover;
  }
}

.textCenter1 {
  text-align: center;
  color: #ffd373;
  font-size: 38px;

  @media (max-width: 420px) {
    font-size: 28px;
  }
}

.textCenter2 {
  text-align: center;
  color: white;
  font-size: 24px;

  @media (max-width: 420px) {
    font-size: 16px;
  }
}

.itemTextCenter {
  text-align: center;
}

.marginToTop {
  padding-top: 25px;
}
.labelStyleInput {
  width: 100%;
  font-size: 20px;

  @media (max-width: 420px) {
    font-size: 15px;
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
.imageGotoMainmenu {
  width: 30%;
  margin-top: 10px;

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
.imageLogoUser {
  background-image: url(/img/newImage/Profile_Picture.png);
}
</style>
