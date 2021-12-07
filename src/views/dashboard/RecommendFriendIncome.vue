<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">รายได้แนะนำเพื่อน</h1>
    </div>

    <div class="container imageCardBG">
      <div class="row justify-content-center">
        <div class="col-12 text-start">
          <h1 class="kanitFonts1 fontH1">รายการเครดิต</h1>
        </div>
        <div class="col-12 text-center">
          <h1 class="kanitFonts3 moneyBox">100,000.00</h1>
        </div>
      </div>
      <br />
      <div class="text-center">
        <a class="navbar-brand" href="#">
          <img
            class="img-responsive imageTransferCredit"
            src="/img/newImage/BT_Credit.png"
            alt="Go to main page"
          />
        </a>
      </div>
    </div>

    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ประวัติรายการ</h1>
    </div>

    <div class="container imageBackgroundTable">
      <br />
      <div class="row">
        <div class="col-7">
          <label class="kanitFonts2 textTableHeader">
            รายการวันนี้
            <label class="kanitFonts2 textDateHeader"> 02/04/2564 </label>
          </label>
        </div>
        <div class="col-5">
          <select class="select kanitFonts3 dateSortTable" v-model="mock.days">
            <option disabled value="0">วันที่</option>
            <option value="1">ภายใน 3 วัน</option>
            <option value="2">ภายใน 7 วัน</option>
          </select>
        </div>
      </div>
      <br />

      <img
        class="img-responsive center-block d-block mx-auto listInputStyle"
        src="/img/newImage/lineInput.jpg"
      />
      <br />
      <div class="row">
        <label class="kanitFonts2 textDatatable"> ไม่พบข้อมูล </label>
        <br />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  data() {
    return {
      mock: {
        days: 0,
      },
    };
  },
};
</script>
<style lang="less" scoped>
select {
  padding-right: 30px !important;
  background: #ebc467 url("/images/BT_Choose.png") no-repeat calc(100% - 10px)
    center;
  -webkit-appearance: none;
  -webkit-border-radius: 2px;
  -webkit-padding-end: 30px;
  -webkit-padding-start: 9px;
  -moz-appearance: none;
  -moz-padding-end: 30px;
  -moz-padding-start: 9px;
  border-radius: 6px;
  border: 0px;

  @media (max-width: 420px) {
    background-size: 20px;
  }
}

.dateSortTable {
  background-image: url(/img/newImage/BT_Choose.png);
  height: 50px;
  width: 190px;
  font-size: 25px;

  @media (max-width: 420px) {
    width: 100px;
    height: 28px;
    font-size: 12px;
  }
}

.nav2Styles {
  background-color: black;
}
.textColerHeader {
  color: #ffd373;
  font-size: 38px;

  @media (max-width: 420px) {
    font-size: 22px;
  }
}
.imageRowBottom {
  width: 100%;
}
.imageCardBG {
  background-image: url(/img/newImage/BG_Detail01.png);
  margin-top: 5%;
  margin-bottom: 5%;
  background-size: contain no-repeat;
  background-position: center;
  width: 100%;
  border-radius: 10px;
}
.imageBackgroundTable {
  background-image: url(/img/newImage/backgroungImage.png);
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 420px) {
    background-size: contain no-repeat;
    background-position: center;
    width: 100%;
    border-radius: 10px;
  }
}
.moneyBox {
  color: black;
  font-size: 42px;
  margin: 0 auto;

  @media (max-width: 420px) {
    font-size: 28px;
  }
}
.textTableHeader {
  color: #ffca45;
  font-size: 28px;

  @media (max-width: 420px) {
    font-size: 12px;
  }
}
.textDateHeader {
  color: white;
  font-size: 28px;

  @media (max-width: 420px) {
    font-size: 12px;
  }
}
.listInputStyle {
  width: 100%;
  max-width: 100%;
}
.textDatatable {
  color: white;
  font-size: 28px;
  @media (max-width: 420px) {
    font-size: 12px;
  }
}

.fontH1 {
  font-size: 28px;
  margin-top: 15px;

  @media (max-width: 420px) {
    font-size: 18px;
  }
}

.imageTransferCredit {
  width: 50%;

  @media (max-width: 420px) {
    width: 60%;
  }
}
</style>
