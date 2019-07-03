import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import enUS from "./locale/enUS";
import zhCN from "./locale/zhCN";
import queryString from "query-string";
import VueHighlightJS from "vue-highlightjs";

import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  Input,
  Select,
  LocaleProvider,
  Dropdown,
  DatePicker,
  Badge,
  Tabs,
  Spin,
  List,
  Avatar,
  Tooltip,
  Tag,
  Checkbox,
  Col,
  Row,
  Popover,
  Progress,
  Alert,
  message
} from "ant-design-vue";
import Authorized from "./components/Authorized";
import Auth from "./directives/auth";
import "highlight.js/styles/github.css";
import ref from "vue-ref";
Vue.use(ref, { name: "ant-ref" });

// FormItem中的decoratorOption方法有bug，已提交pr到ant-design-vue
// 47行到73行为临时解决方案
const FormItem = Form.Item;
import find from "lodash/find";
import warning from "ant-design-vue/es/_util/warning";
FormItem.methods.decoratorOption = vnode => {
  if (vnode.data && vnode.data.directives) {
    const directive = find(vnode.data.directives, ["name", "decorator"]);
    warning(
      !directive || (directive && Array.isArray(directive.value)),
      `Invalid directive: type check failed for directive "decorator". Expected Array, got ${typeof (directive // directive可能为undefined
        ? directive.value
        : directive)}. At ${vnode.tag}.`
    );
    return directive ? directive.value : null;
  } else {
    return null;
  }
};

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(LocaleProvider);
Vue.use(Dropdown);
Vue.use(DatePicker);
Vue.use(Avatar);
Vue.use(Tooltip);
Vue.component("Authorized", Authorized);
Vue.use(Auth);
Vue.use(VueI18n);
Vue.use(VueHighlightJS);
Vue.use(Badge);
Vue.use(Tabs);
Vue.use(Spin);
Vue.use(List);
Vue.use(Tag);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Alert);
Vue.prototype.$message = message;

const i18n = new VueI18n({
  locale: queryString.parse(location.search).locale || "zhCN",
  messages: {
    zhCN: { message: zhCN },
    enUS: { message: enUS }
  }
});

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1154049_w87h4oeytph.js" // 在 iconfont.cn 上生成
});

Vue.component("IconFont", IconFont);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
