<template>
  <footer class="navbar mr-auto backgrondFooter">
    <div class="container-fluid row align-items-center">
      <div class="col-2">
        <a class="navbar-brand" href="#/admin/account">
          <img class="imgFooterBarSize" src="/img/newImage/BT_Account.png" alt="..."
        /></a>
      </div>
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/deposit-money"
          ><img class="imgFooterBarSize2" src="/img/newImage/BT_Deposit.png" alt="..."
        /></a>
      </div>
      <div class="col-3">
        <a class="navbar-brand" href="#/admin/withdraw-money"
          ><img class="imgFooterBarSize2" src="/img/newImage/BT_Withdraw.png" alt="..."
        /></a>
      </div>
      <div class="col-2">
        <a class="navbar-brand" href="#/admin/history-view"
          ><img class="imgFooterBarSize3" src="/img/newImage/BT_History.png" alt="..."
        /></a>
      </div>
      <div class="col-2">
        <a class="navbar-brand menuList" href="#/admin/contact"
          ><img class="imgFooterBarSize4" src="/img/newImage/BT_Contact.png" alt="..."
        /></a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'contcontent-footerent'
}
</script>
<style lang="less">
.backgrondFooter {
  background-image: url(/img/newImage/BG_Menubar.jpg);
  background-size: contain;
  background-size: no-repeat;
  width: 100%;
}

.menuList {
  color: #828282;
}
.imgFooterBarSize {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 420px) {
    width: 100%;
  }
}
.imgFooterBarSize2 {
  width: 40%;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 420px) {
    width: 70%;
    margin-left: 15px;
  }
}
.imgFooterBarSize3 {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 420px) {
    width: 100%;
    margin-left: 15px;
  }
}
.imgFooterBarSize4 {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-left: 45px;

  @media (max-width: 420px) {
    width: 100%;
    margin-left: 25px;
  }
}
</style>
