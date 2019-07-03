<script>
import { Tabs } from "ant-design-vue";
import LoginContext from "./LoginContext";

const { TabPane } = Tabs;

const generateId = (() => {
  let i = 0;
  return (prefix = "") => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

export default {
  typeName: "LoginTab",
  props: {
    active: Boolean,
    destroyInactiveTabPane: Boolean,
    rootPrefixCls: String,
    tab: String
  },
  data() {
    return {
      uniqueId: generateId("login-tab-")
    };
  },
  mounted() {
    this.tabUtil.addTab(this.uniqueId);
  },
  render() {
    const props = { props: { ...this.$props } };
    return (
      <LoginContext.Consumer>
        {value => {
          this.tabUtil = value.tabUtil;
          return <TabPane {...props}>{this.$slots.default}</TabPane>;
        }}
      </LoginContext.Consumer>
    );
  }
};
</script>
