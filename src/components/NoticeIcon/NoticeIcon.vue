<script>
import HeaderDropdown from "../HeaderDropdown";
import NoticeList from "./NoticeList";
import PropTypes from "ant-design-vue/lib/_util/vue-types";
import {
  getOptionProps,
  filterEmpty
} from "ant-design-vue/lib/_util/props-util";
import _map from "lodash/map";

const prefixCls = "notice-icon";

export default {
  name: "NoticeIcon",
  props: {
    count: PropTypes.number.def(0),
    className: PropTypes.string,
    popupVisible: PropTypes.bool,
    loading: PropTypes.bool,
    clearText: PropTypes.string,
    viewMoreText: PropTypes.string,
    clearClose: PropTypes.bool.def(false)
  },
  data() {
    return {
      visible: false,
      emptyImage:
        "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
    };
  },
  methods: {
    handleVisibleChange(visible) {
      this.visible = visible;
    },
    handleTabChange(tabType) {
      this.$emit("tabChange", tabType);
    },
    // eslint-disable-next-line
    getNotificationBox(h) {
      const { loading, clearText, viewMoreText } = this;
      const children = filterEmpty(this.$slots.default);
      if (!children) {
        return null;
      }
      const panes = _map(children, child => {
        const childProps = getOptionProps(child);
        const {
          list,
          title,
          count,
          tabKey,
          showClear,
          emptyText,
          showViewMore
        } = childProps;
        const len = list && list.length ? list.length : 0;
        const msgCount = count || count === 0 ? count : len;
        const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
        const props = {
          clearText,
          emptyText,
          viewMoreText,
          showClear,
          showViewMore,
          title,
          onClick: item => this.$emit("itemClick", item, childProps),
          onClear: () => this.$emit("clear", title, tabKey),
          onViewMore: event => this.$emit("viewMore", childProps, event)
        };
        return (
          <ATabPane tab={tabTitle} key={tabKey}>
            <NoticeList data={list} {...{ props }} />
          </ATabPane>
        );
      });
      return (
        <div>
          <ASpin spinning={loading} delay={0}>
            <ATabs class={`${prefixCls}__tabs`} onChange={this.handleTabChange}>
              {panes}
            </ATabs>
          </ASpin>
        </div>
      );
    }
  },
  render(h) {
    const { className, count, visible, popupVisible } = this;
    const noticeButtonClass = {
      [className]: !!className,
      opened: !!visible,
      [`${prefixCls}__notice-button`]: true
    };
    const notificationBox = this.getNotificationBox(h);
    const NoticeBellIcon = <a-icon type="bell" class={`${prefixCls}__icon`} />;
    const trigger = (
      <span class={noticeButtonClass}>
        <ABadge
          count={count}
          style={{ boxShadow: "none" }}
          class={`${prefixCls}__badge`}
        >
          {NoticeBellIcon}
        </ABadge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ("popupVisible" in this) {
      popoverProps.visible = popupVisible;
    }
    return (
      <HeaderDropdown
        placement="bottomRight"
        overlayClassName={`${prefixCls}__popover`}
        trigger={["click"]}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        overlay={notificationBox}
        {...popoverProps}
      >
        {trigger}
      </HeaderDropdown>
    );
  }
};
</script>

<style lang="less" src="./NoticeIcon.less"></style>
