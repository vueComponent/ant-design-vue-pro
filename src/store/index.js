import Vue from "vue";
import Vuex from "vuex";
import form from "./modules/form";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    form
  }
});
