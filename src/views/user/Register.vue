<template>
  <div class="card-body nav2Styles">
    <br />
    <div class="container-fluid text-center">
      <h2 slot="header" class="card-title kanitFonts3 textCenter">ยินดีต้อนรับ</h2>
      <h4 slot="header" class="card-title kanitFonts3 textCenter">ข้อมูลการสมัครสมาชิกใหม่</h4>
    </div>
    <div class="card-body">
      <form>
        <div class="col-lg-12">
          <div class="form-group-lg boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <div class="custom-select kanitFonts1">
                    <select class="custom-select kanitFonts1 selectTextColor" v-model="user.accbank">
                      <option disabled value="1">ธนาคารที่ใช้</option>
                      <option value="2">Bank A</option>
                      <option value="3">Bank B</option>
                      <option value="4">Bank C</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <input
                    type="search"
                    class="kanitFonts2 inputBlackBoxStyle"
                    placeholder=" เลขที่บัญชี.."
                    maxlength="16"
                    v-model="user.banknumber"
                  />
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <input
                    type="search"
                    class="kanitFonts2 inputBlackBoxStyle"
                    placeholder=" ชื่อ - นามสกุล (ชื่อบัญชีธนาคาร)"
                    v-model="user.fullname"
                  />
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <input
                    type="search"
                    class="kanitFonts2 inputBlackBoxStyle"
                    placeholder=" เบอร์โทรศัพท์"
                    maxlength="10"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    v-model="user.telephone"
                    required
                  />
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <input
                    type="search"
                    class="kanitFonts2 inputBlackBoxStyle"
                    placeholder=" รหัสเข้าเล่น (ล็อกอินเข้าสู่ระบบ)"
                    v-model="user.password"
                  />
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group-lg boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <div class="custom-select kanitFonts1">
                    <select class="custom-select kanitFonts1 selectTextColor" v-model="user.knowus">
                      <option disabled value="1">รู้จักเราที่ไหน ?</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <div class="form-group-lg boxPDStyles">
            <div class="row">
              <div class="col-sm-12">
                <div class="inputGroupStyle">
                  <div class="custom-select kanitFonts1">
                    <select class="custom-select kanitFonts1 selectTextColor" v-model="user.promotion">
                      <option disabled value="1">โปรโมชั่น ?</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <img class="img-responsive center-block d-block mx-auto listInputStyle" src="/img/newImage/lineInput.jpg" />
          </div>

          <!-- button register -->
          <br /><br />
          <div class="text-center">
            <router-link class="navbar-brand" to="/user/registerconfirm">
              <img class="img-responsive imgRegister" src="/img/newImage/register-01.png" />
              <!-- <img
                @click.prevent="register"
                class="img-responsive imgRegister"
                src="/img/newImage/register-01.png"
              /> -->
            </router-link>
          </div>
          <br />
          <div class="row text-center">
            <label class="control-label kanitFonts1 textMemo">
              <span class="colorSpan">*</span>
              กรุณากรอกข้อมูลให้ครบทุกช่อง
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
// import ChartCard from "src/components/Cards/ChartCard.vue";
// import StatsCard from "src/components/Cards/StatsCard.vue";
// import LTable from "src/components/Table.vue";

export default {
  // components: {
  //   LTable,
  //   ChartCard,
  //   StatsCard,
  // },
  data() {
    return {
      user: {
        accbank: '1',
        banknumber: '',
        fullname: '',
        telephone: '',
        password: '',
        promotion: null,
        knowus: '1',
        promotion: '1',
        aboutMe: '',
      },
    }
  },
  methods: {
    register() {
      alert('register data: ' + JSON.stringify(this.user))
    },
  },
}
</script>
<style lang="less" scoped>
.custom-select {
  position: relative;
  height: 40px;
  width: 100%;
  color: white;
  display: inline-block;
  appearance: none;
  @media (max-width: 420px) {
    font-size: 14px;
  }
}
.custom-select select {
  height: 40px;
  // color: white !important;
  font-size: 20px;
  border-color: black;
  background-color: black !important;
  text-transform: uppercase;
  outline: none;
  appearance: none;
  @media (max-width: 420px) {
    font-size: 14px;
  }
}
.custom-select::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 17px;
  width: 0;
  height: 0;
  border-left: 7px solid black;
  border-right: 7px solid black;
  border-top: 10px solid #fac234;
  pointer-events: none;
  appearance: none;
  color: white;
  @media (max-width: 420px) {
    font-size: 14px;
  }
}

.nav2Styles {
  background-color: black;
}
.textCenter {
  text-align: center;
  color: #ffd373;
}
.imgRegister {
  width: 40%;

  @media (max-width: 420px) {
    width: 50%;
  }
}
.colorSpan {
  color: red;
}
.textMemo {
  color: #828282;
  font-size: 20px;

  @media (max-width: 420px) {
    font-size: 14px;
  }
}

.listInputStyle {
  width: 100%;
  max-width: 100%;
}

.selectTextColor {
  color: #828282;
}

//form-StyleInput & StyleSelect
.boxPDStyles {
  margin-top: 25px;
}
.inputGroupStyle {
  background-color: black;
  width: 100%;
  height: 40px;
}
.inputBlackBoxStyle {
  background-color: black;
  border-width: 0px;
  color: white;
  width: 100%;
  height: 40px;
  font-size: 20px;

  @media (max-width: 420px) {
    font-size: 14px;
  }
}
</style>
