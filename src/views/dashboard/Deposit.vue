<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ฝากเงินอัตโนมัติ</h1>
    </div>

    <div class="container imageBackgroundMain">
      <br />
      <div class="col-sm-12 text-center">
        <input
          type="text"
          id="userId"
          disabled
          class="kanitFonts1 inputBankText"
          placeholder="ธนาคารไทยพาณิชย์"
          v-model="bank.bankName"
        />
      </div>
      <div class="col-sm-12 text-center">
        <input
          type="text"
          id="userId"
          disabled
          class="kanitFonts1 inputBankText"
          placeholder="0908566930"
          v-model="bank.bankNumber"
        />
      </div>
      <h4 class="kanitFonts2 labelMemoText">
        *ควรใช้บัญชีข้างบนในการฝากเงินเท่านั้น
      </h4>
      <br />
      <div class="row justify-content-md-center">
        <div class="col-12 text-center">
          <img
            class="img-responsive imageDeposit"
            src="/img/newImage/Text_H01.png"
            alt="..."
          />
        </div>
      </div>
      <br />

      <div class="row justify-content-md-center">
        <div class="col-12 text-center">
          <img
            class="img-responsive imageBank"
            src="/img/newImage/SCB_Logo.jpg"
            alt="..."
          />
        </div>
      </div>
      <br />

      <div class="row justify-content-md-center text-center">
        <div class="col-5">
          <a class="navbar-brand" href="#">
            <img
              class="img-responsive imageRowBottom"
              src="/img/newImage/BT_Copy.png"
              alt="..."
            />
          </a>
        </div>
        <div class="col-1" />
        <div class="col-5">
          <a class="navbar-brand" href="#">
            <img
              class="img-responsive imageRowBottom"
              src="/img/newImage/BT_Check.png"
              alt="..."
            />
          </a>
        </div>
      </div>
      <br /><br />
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      bank: {
        bankName: "ธนาคารไทยพาณิชย์",
        bankNumber: "0908566930"
      },
    }
  }
};
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;
}

.inputBankText {
  width: 90%;
  height: 70px;
  margin: 25px;
  background-color: #212121;
  border-radius: 4px;
  color: white;
  font-size: 25px;

  @media (max-width: 420px) {
    width: 90%;
    height: 30%;
    margin: 10px;
    font-size: 16px;
  }
}
.labelMemoText {
  color: red;
  font-size: 20px;
  text-align: center;
  font-size: 25px;

  @media (max-width: 420px) {
    font-size: 15px;
  }
}
.textColerHeader {
  color: "#ffd373";
  @media (max-width: 420px) {
    font-size: 24px;
  }
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
.imageDeposit {
  width: 50%;

  @media (max-width: 420px) {
    width: 70%;
  }
}
.imageBank {
  width: 70%;
  @media (max-width: 420px) {
    width: 90%;
  }
}

.imageRowBottom {
  width: 90%;
  @media (max-width: 420px) {
    width: 120%;
  }
}
</style>
