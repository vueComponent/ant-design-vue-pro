<template>
  <div class="card-body nav2Styles">
    <!-- menu-list1 -->
    <div class="row justify-content-md-center">
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/deposit-money">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList1"
            src="/img/newImage/icon_01.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/withdraw-money">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList1"
            src="/img/newImage/icon_02.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/promotion">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList1"
            src="/img/newImage/icon_03.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/payback-money">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList1"
            src="/img/newImage/icon_04.png"
            alt="..."
          />
        </a>
      </div>
    </div>
    <br />

    <!-- card-price -->
    <div class="container imageCardBG">
      <div class="row justify-content-between">
        <div class="col-sm-12">
          <label class="kanitFonts1 fontH1">รายการเครดิต</label>
        </div>
        <div class="col-sm-12">
          <label class="kanitFonts3 fontH2">100,000.00 ฿</label>
        </div>
      </div>
      <br />
      <div class="row justify-content-start">
        <h3 class="kanitFonts2 fontDesc">คำอธิบายรายละเอียดรายการเครดิต</h3>
        <h3 class="kanitFonts2 fontDesc">เพื่อความรวดเร็วในการทำการถอน แนะนำให้ใช้ธนาคารเดียวกับที่ฝากเงิน</h3>
      </div>
    </div>

    <!-- menu-list2 -->
    <br />
    <div class="row justify-content-md-center">
      <div class="col-4">
        <a class="navbar-brand" href="#/admin/recommend-friend">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList2"
            src="/img/newImage/icon_05.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-4">
        <a class="navbar-brand" href="#/admin/recommend-friend-income">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList2x"
            src="/img/newImage/icon_06.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-4">
        <a class="navbar-brand" href="#/admin/history-view">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList3x"
            src="/img/newImage/icon_07.png"
            alt="..."
          />
        </a>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-4">
        <a class="navbar-brand" href="#">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList2"
            src="/img/newImage/icon_08.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-4">
        <a class="navbar-brand" href="#">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList2"
            src="/img/newImage/icon_09.png"
            alt="..."
          />
        </a>
      </div>
      <div class="col-4">
        <a class="navbar-brand" href="#/admin/other-view">
          <img
            class="img-responsive center-block d-block mx-auto imgMenuList2"
            src="/img/newImage/icon_010.png"
            alt="..."
          />
        </a>
      </div>
    </div>
    <br />

    <!-- open games -->
    <div class="row justify-content-center">
      <div class="col-sm-6">
        <a class="navbar-brand" href="#">
          <img class="img-responsive center-block d-block mx-auto imgPlaygame" src="/img/newImage/BT_Gotoplay1.png" />
        </a>
      </div>
    </div>
    <br />
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        userId: 'VIP:0908566930'
      },
      nav2Styles: {
        backgroundColor: 'black'
      }
    }
  }
}
</script>
<style lang="less">
.nav2Styles {
  background-color: black;
}

.imageCardBG {
  background-image: url(/img/newImage/BG_Detail01.png);
  // margin-top: 5%;
  // margin-bottom: 5%;
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

.imgMenuList1 {
  width: 60%;

  @media (max-width: 420px) {
    width: 85%;
  }
}

.fontH1 {
  font-size: 28px;
  margin-top: 10px;
  @media (max-width: 420px) {
    font-size: 18px;
  }
}
.fontH2 {
  font-size: 28px;
  @media (max-width: 420px) {
    font-size: 18px;
  }
}
.fontDesc {
  font-size: 18px;

  @media (max-width: 420px) {
    font-size: 12px;
  }
}

.imgMenuList2 {
  width: 45%;

  @media (max-width: 420px) {
    width: 65%;
  }
}
.imgMenuList2x {
  width: 70%;

  @media (max-width: 420px) {
    width: 100%;
  }
}
.imgMenuList3x {
  width: 40%;

  @media (max-width: 420px) {
    width: 58%;
  }
}

.imgPlaygame {
  width: 100%;

  @media (max-width: 420px) {
    width: 60%;
  }
}
</style>
