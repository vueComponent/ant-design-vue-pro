<script>
import { Form, Tabs } from "ant-design-vue";
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
        }
      };
    }
  },
  render() {
    const { tabs, type } = this.$data;
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
          <Form onSubmit={this.handleSubmit}>
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

export default Form.create()(Login);
</script>
