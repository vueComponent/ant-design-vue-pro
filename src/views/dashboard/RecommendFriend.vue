<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">แนะนำเพื่อน</h1>
    </div>

    <div class="container imageCardBG">
      <div class="row justify-content-start">
        <div class="col-sm-12">
          <h1 class="kanitFonts1 fontH1">แชร์ลิ้งค์ของคุณ</h1>
        </div>
        <div class="col-sm-12">
          <input
            type="search"
            id="myLink"
            class="form-control kanitFonts2 inputStyle"
            v-model="link"
            disabled
          />
        </div>
      </div>
      <br />
      <div class="text-center">
        <a class="navbar-brand" v-on:click="myFunction">
          <img class="img-responsive imageCopyLink" src="/img/newImage/Copys.png" alt="Go to main page" />
        </a>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-6">
        <a class="navbar-brand" href="#">
          <img class="img-responsive imageRowBottom" src="/img/newImage/Line.png" alt="..." />
        </a>
      </div>
      <div class="col-6">
        <a class="navbar-brand" href="#">
          <img class="img-responsive imageRowBottom" src="/img/newImage/Facebook.png" alt="..." />
        </a>
      </div>
    </div>

    <br />
    <div class="row justify-content-md-center">
      <img class="avatar border-gray" src="/img/newImage/Promotion.png" alt="..." />
    </div>
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {
      link: 'http.//d20gjgs2odnf.coorjd.fn.com'
    }
  },
  methods: {
    myFunction() {
      var copyText = document.getElementById('myLink')
      copyText.select()
      copyText.setSelectionRange(0, 99999) /* For mobile devices */
      navigator.clipboard.writeText(copyText.value)
      // console.log(copyText.value)
      // alert('Copied the text: ' + copyText.value)
    },
  },
}
</script>
<style lang="less" scoped>
.nav2Styles {
  background-color: black;
}

.textColerHeader {
  color: #ffd373;
  font-size: 32px;

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
.inputStyle {
  background-color: black;
  border-width: 0px;
  color: white;
  width: 100%;
  height: 50px;
  font-size: 32px;

  @media (max-width: 420px) {
    height: 28px;
    font-size: 15px;
  }
}

.fontH1 {
  font-size: 28px;
  margin-top: 10px;
  @media (max-width: 420px) {
    font-size: 18px;
  }
}

.imageCopyLink {
  width: 30%;

  @media (max-width: 420px) {
    width: 40%;
  }
}
</style>
