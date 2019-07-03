<script>
import { Button, Form } from "ant-design-vue";

const FormItem = Form.Item;

export default {
  props: {
    className: String,
    loading: Boolean
  },
  render() {
    return (
      <FormItem>
        <Button
          size="large"
          class="submit"
          type="primary"
          htmlType="submit"
          loading={this.loading}
        >
          {this.$slots.default}
        </Button>
      </FormItem>
    );
  }
};
</script>

<style lang="less" scoped>
.submit {
  width: 100%;
  margin-top: 24px;
}
</style>
