<script>
import AvatarListItem from "./item";

export default {
  name: "AvatarList",
  components: {
    AvatarListItem
  },
  props: {
    size: {
      type: [String, Number],
      default: "default"
    },
    maxLength: {
      type: Number,
      default: 0
    },
    excessItemsStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  render(h) {
    const list = this.$slots.default;
    let items;
    if (this.maxLength > 0 && this.maxLength < list.length) {
      items = list.slice(0, this.maxLength);
      items.push(h("avatar-list-item", "+" + (list.length - this.maxLength)));
    } else {
      items = list;
    }

    return h(
      "ul",
      { class: "avatar-list" },
      items.map(item => {
        return h("li", { class: "avatar-list-item" }, [item]);
      })
    );
  }
};
</script>

<style lang="less" scoped>
.avatar-list {
  display: inline-block;
  padding: 0;
  margin: 0 0 0 8px;
  font-size: 0;
  list-style: none;
  .avatar-list-item {
    display: inline-block;
    margin-left: -8px;
    .ant-avatar {
      border: 1px solid #fff;
      cursor: pointer;
    }
  }
}
</style>
