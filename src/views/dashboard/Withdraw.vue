<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ถอนเงิน</h1>
    </div>

    <div class="container imageCardBG1">
      <div class="row justify-content-between">
        <div class="col-sm-12">
          <h1 class="kanitFonts1 fontH1">เครดิตคงเหลือ</h1>
          <h1 class="kanitFonts3 fontH2">0.00 ฿</h1>
        </div>
      </div>
      <div class="row justify-content-start">
        <h3 class="kanitFonts1 textCreditbox">
          *เครดิตของคุณไม่เพียงพอสำหรับการถอนเงิน
        </h3>
      </div>
    </div>
    <br />

    <div class="container imageCardBG2">
      <div class="row justify-content-between">
        <div class="col-sm-12">
          <h1 class="kanitFonts1 fontH1">จำนวนเงินที่ต้องการถอน</h1>
          <input
            class="kanitFonts2 inputStyle"
            placeholder="0.00"
            type="search"
          />
        </div>
      </div>
      <br />
      <div class="row justify-content-start">
        <h3 class="kanitFonts1 textCreditbox">
          เพื่อความรวดเร็วในการถอน แนะนำให้ใช้ธนาคารเดียวกันกับที่ฝากเงิน
        </h3>
      </div>
    </div>

    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">บัญชีรับเงิน</h1>
    </div>

    <div class="container imageBackgroundMain">
      <br />
      <div class="row justify-content-md-start">
        <div class="col-sm-3">
          <img
            class="img-responsive imageBank"
            src="/img/newImage/SCB_Logo.jpg"
            alt="..."
          />
        </div>
        <div class="col-sm-6 text-start">
          <h3 class="kanitFonts1 textBankHeader1">ธนาคารไทยพาณิชย์</h3>
          <h3 class="kanitFonts2 textBankHeader2">09085666930</h3>
          <h3 class="kanitFonts1 textBankHeader1">
            ชื่อบัญชี : น.ส.ตัวอย่าง ตัวอย่าง
          </h3>
        </div>

        <div class="col-sm-3">
          <select class="select kanitFonts3 dateSortTable" v-model="bank.days">
            <option disabled value="0">เลือกบัญชี</option>
            <option value="1">ภายใน 3 วัน</option>
            <option value="2">ภายใน 7 วัน</option>
          </select>
        </div>
      </div>
      <br /><br />

      <div class="row justify-content-md-center">
        <div class="col-sm-12 text-center">
          <a class="navbar-brand" href="#">
            <img
              class="img-responsive imgConfirm"
              src="/img/newImage/BT_CF.png"
              alt="..."
            />
          </a>
        </div>
      </div>
      <br />
    </div>
    <br />
  </div>
</template>
<script>

export default {
  data() {
    return {
      bank: {
        bankName: "   ธนาคารไทยพาณิชย์",
        bankNumber: "0908566930",
        days: 0
      }
    }
  }
};
</script>
<style lang="less" scoped>
.select {
  padding-right: 30px !important;
  background: #ebc467 url("/images/BT_Choose.png") no-repeat calc(100% - 4px)
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
    background-size: 22px;
  }
}

.nav2Styles {
  background-color: black;
}
.textColerHeader {
  color: #ffd373;
  font-size: 32px;

  @media (max-width: 420px) {
    font-size: 24px;
  }
}
.textCreditbox {
  color: red;
  font-size: 20px;

  @media (max-width: 420px) {
    font-size: 12px;
  }
}
.textBottomBoxcredit {
  color: #ffca45;
  font-size: 22px;
}
.textBankHeader1 {
  color: white;
  font-size: 32px;

  @media (max-width: 420px) {
    font-size: 14px;
  }
}
.textBankHeader2 {
  color: white;
  font-size: 40px;

  @media (max-width: 420px) {
    font-size: 18px;
  }
}

.fontH1 {
  font-size: 28px;
  @media (max-width: 420px) {
    font-size: 20px;
  }
}

.fontH2 {
  font-size: 28px;
  @media (max-width: 420px) {
    font-size: 20px;
  }
}

.imageBackgroundMain {
  background-image: url(/img/newImage/backgroungImage.png);
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.imageDeposit {
  width: 100%;
}
.imageBank {
  width: 100%;
  border-radius: 10px;
}
.imageCardBG1 {
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
.imageCardBG2 {
  background-image: url(/img/newImage/BG_Detail02.png);
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
.inputStyle {
  background-color: black;
  border-width: 0px;
  color: white;
  width: 100%;
  height: 50px;
  font-size: 32px;

  @media (max-width: 420px) {
    height: 32px;
    font-size: 20px;
  }
}
.dateSortTable {
  background-image: url(/img/newImage/BT_Choose.png);
  height: 50px;
  width: 190px;
  font-size: 25px;

  @media (max-width: 420px) {
    width: 150px;
    height: 30px;
    font-size: 14px;
  }
}

.imgConfirm {
  width: 50%;

  @media (max-width: 420px) {
    width: 50%;
  }
}
</style>
