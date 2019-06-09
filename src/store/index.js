import Vue from "vue";
import Vuex from "vuex";
import form from "./modules/form";
import global from "./modules/global";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    form,
    global
  }
});
