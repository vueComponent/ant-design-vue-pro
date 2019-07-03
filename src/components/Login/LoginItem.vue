<script>
import { Form, Input, Button, Row, Col, Icon } from "ant-design-vue";
import omit from "lodash/omit";
import LoginContext from "./LoginContext";
import ItemMap from "./map";

// const FormItem = Form.Item;

// FormItem中的decoratorOption方法有bug，已提交pr到ant-design-vue
// 11行到27行为临时解决方案
import cloneDeep from "lodash/cloneDeep";
import warning from "ant-design-vue/es/_util/warning";
const FormItem = cloneDeep(Form.Item);
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

const WrapFormItem = {
  data() {
    return {
      count: 0
    };
  },
  props: {
    onChange: Function,
    defaultValue: String,
    rules: Array,
    updateActive: Function,
    form: Object,
    customprops: Object,
    name: String,
    placeholder: String,
    type: String,
    getCaptchaButtonText: String,
    getCaptchaSecondText: String,
    onGetCaptcha: Function,
    countDown: Number
  },
  mounted() {
    const { updateActive, name } = this.$props;
    if (updateActive) {
      updateActive(name);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    getFormItemOptions({ onChange, defaultValue, customprops, rules }) {
      const options = {
        rules: rules || customprops.rules
      };
      if (onChange) {
        options.onChange = onChange;
      }
      if (defaultValue) {
        options.initialValue = defaultValue;
      }
      return options;
    },
    getCaptcha() {
      const { onGetCaptcha } = this.$props;
      const result = onGetCaptcha ? onGetCaptcha() : null;
      if (result === false) {
        return;
      }
      if (result instanceof Promise) {
        result.then(this.runGetCaptchaCountDown);
      } else {
        this.runGetCaptchaCountDown();
      }
    },
    runGetCaptchaCountDown() {
      const { countDown } = this.$props;
      this.count = countDown || 59;
      this.interval = setInterval(() => {
        this.count -= 1;
        if (this.count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    }
  },
  render() {
    const { count } = this.$data;

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules, updateActive props
    const {
      // eslint-disable-next-line no-unused-vars
      onChange,
      // eslint-disable-next-line no-unused-vars
      defaultValue,
      // eslint-disable-next-line no-unused-vars
      rules,
      // eslint-disable-next-line no-unused-vars
      updateActive,
      form: { getFieldDecorator },
      customprops,
      name,
      type,
      getCaptchaButtonText,
      getCaptchaSecondText,
      ...restProps
    } = this.$props;

    customprops.prefix = (
      <Icon type={customprops.prefixType} class="prefixIcon" />
    );

    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.$props);

    const otherProps = {};
    Object.keys(restProps).forEach(key => {
      if (restProps[key]) otherProps[key] = restProps[key];
    });

    if (type === "Captcha") {
      const inputProps = omit(otherProps, ["onGetCaptcha", "countDown"]);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator(name, options)(
                <Input {...{ props: { ...customprops, ...inputProps } }} />
              )}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count}
                class="getCaptcha"
                size="large"
                onClick={this.getCaptcha}
              >
                {count
                  ? `${count} ${getCaptchaSecondText}`
                  : getCaptchaButtonText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }

    return (
      <FormItem>
        {getFieldDecorator(name, options)(
          <Input {...{ props: { ...customprops, ...otherProps } }} />
        )}
      </FormItem>
    );
  }
};

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = {
    props: {
      onChange: Function,
      defaultValue: String,
      name: String,
      placeholder: String,
      rules: Array,
      getCaptchaButtonText: String,
      getCaptchaSecondText: String,
      onGetCaptcha: Function,
      countDown: Number
    },
    render() {
      const props = { props: { ...this.$props } };
      return (
        <LoginContext.Consumer>
          {context => (
            <WrapFormItem
              customprops={item.props}
              rules={item.rules}
              {...props}
              type={key}
              updateActive={context.updateActive}
              form={context.form}
            />
          )}
        </LoginContext.Consumer>
      );
    }
  };
});

export default LoginItem;
</script>
