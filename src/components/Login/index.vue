<script>
import { Form, Tabs } from "ant-design-vue";
import LoginSubmit from "./LoginSubmit";
import LoginTab from "./LoginTab";
import LoginItem from "./LoginItem";
import LoginContext from "./LoginContext";

const Login = {
  props: {
    defaultActiveKey: {
      type: String,
      default: ""
    },
    onTabChange: {
      type: Function,
      default: () => {}
    },
    onSubmit: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      type: this.$props.defaultActiveKey,
      tabs: [],
      active: {}
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      const { type, form, onSubmit } = this;
      const activeFileds = this.active[type];
      form.validateFields(activeFileds, { force: true }, (err, values) => {
        onSubmit(err, values);
      });
    },
    onSwitch(type) {
      this.type = type;
      const { onTabChange } = this;
      onTabChange(type);
    },
    getContext() {
      const { tabs } = this.$data;
      const { form } = this.$props;
      return {
        tabUtil: {
          addTab: id => {
            this.tabs = [...tabs, id];
          },
          removeTab: id => {
            this.tabs = tabs.filter(currentId => currentId !== id);
          }
        },
        form: {
          ...form
        },
        updateActive: activeItem => {
          const { type, active } = this;
          if (active[type]) {
            active[type].push(activeItem);
          } else {
            active[type] = [activeItem];
          }
          // this.active = active
          console.log(this.active);
        }
      };
    }
  },
  render() {
    const { tabs, type } = this.$data;
    const { form } = this.$props;
    const children = this.$slots.default;
    const TabChildren = [];
    const otherChildren = [];

    children.forEach(item => {
      // console.log("item: ", item);
      if (!item) {
        return;
      }

      if (item.componentOptions && item.componentOptions.tag === "Tab") {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div class="login">
          <Form form={form} onSubmit={this.handleSubmit}>
            {tabs.length > 0 ? (
              <div>
                <Tabs
                  animated={false}
                  class={"tabs"}
                  activeKey={type}
                  onChange={this.onSwitch}
                >
                  {TabChildren}
                </Tabs>
                {otherChildren}
              </div>
            ) : (
              children
            )}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
};

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
</script>
