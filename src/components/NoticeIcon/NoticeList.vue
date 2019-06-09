<script>
import PropTypes from "ant-design-vue/lib/_util/vue-types";

const prefixCls = "notice-list";
const genCls = moduleName => `${prefixCls}__${moduleName}`;

export default {
  name: "NoticeList",
  // functional: true,
  props: {
    count: PropTypes.number,
    list: PropTypes.array,
    data: PropTypes.array.def([]),
    title: PropTypes.string,
    tabKey: PropTypes.string,
    showClear: PropTypes.bool.def(true),
    showViewMore: PropTypes.bool.def(false),
    emptyText: PropTypes.string,
    clearText: PropTypes.string,
    viewMoreText: PropTypes.string,
    onViewMore: PropTypes.func.def(() => null),
    onClick: PropTypes.func.def(() => null),
    onClear: PropTypes.func.def(() => null)
  },
  // eslint-disable-next-line
  render(h) {
    const {
      title,
      data,
      emptyText,
      clearText,
      showClear,
      showViewMore,
      viewMoreText,
      onClick,
      onClear,
      onViewMore
    } = this;
    if (data.length === 0) {
      return (
        <div class={genCls("not-found")}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
        </div>
      );
    }
    return (
      <div>
        <AList
          class={genCls("list")}
          dataSource={data}
          renderItem={(item, i) => {
            const itemCls = {
              [genCls("list-item")]: true,
              [genCls("list-read")]: !!item.read
            };
            const leftIcon = item.avatar ? (
              typeof item.avatar === "string" ? (
                <AAvatar
                  class={genCls("list-item__avatar")}
                  src={item.avatar}
                />
              ) : (
                <span class={genCls("list-item__icon-element")}>
                  {item.avatar}
                </span>
              )
            ) : (
              ""
            );
            let extra = item.extra;
            if (item.extra && item.status) {
              const color = {
                todo: "",
                processing: "blue",
                urgent: "red",
                doing: "gold"
              }[item.status];
              extra = item.extra ? (
                typeof item.extra === "string" ? (
                  <ATag color={color} style={{ marginRight: 0 }}>
                    {item.extra}
                  </ATag>
                ) : (
                  item.extra
                )
              ) : (
                ""
              );
            }
            return (
              <AListItem
                class={itemCls}
                key={item.key || i}
                onClick={() => onClick && onClick(item)}
              >
                <AListItemMeta
                  class={genCls("list-item__meta")}
                  avatar={leftIcon}
                  title={
                    <div class={genCls("list-item__title")}>
                      {item.title}
                      <div class={genCls("list-item__extra")}>{extra}</div>
                    </div>
                  }
                  description={
                    <div>
                      <div class={genCls("list-item__description")}>
                        {item.description}
                      </div>
                      <div class={genCls("list-item__datetime")}>
                        {item.datetime}
                      </div>
                    </div>
                  }
                />
              </AListItem>
            );
          }}
        />
        <div class={genCls("bottom-bar")}>
          {showClear ? (
            <div onClick={onClear}>
              {clearText} {title}
            </div>
          ) : (
            ""
          )}
          {showViewMore ? (
            <div onClick={e => onViewMore && onViewMore(e)}>{viewMoreText}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" src="./NoticeList.less"></style>
