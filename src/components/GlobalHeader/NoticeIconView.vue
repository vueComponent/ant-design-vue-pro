<template>
  <notice-icon
    class="action"
    :count="unreadCount"
    :loading="fetchingNotices"
    :clearText="$t('message')['component.noticeIcon.clear']"
    :viewMoreText="$t('message')['component.noticeIcon.view-more']"
    @itemClick="handleItemClick"
    @clear="handleNoticeClear"
    @viewMore="handleViewMore"
    clearClose
  >
    <notice-icon-tab
      tabKey="notification"
      :count="unreadData.notification"
      :list="noticeData.notification"
      :title="$t('message')['component.globalHeader.notification']"
      :emptyText="$t('message')['component.globalHeader.notification.empty']"
      showViewMore
    ></notice-icon-tab>
    <notice-icon-tab
      tabKey="message"
      :count="unreadData.message"
      :list="noticeData.message"
      :title="$t('message')['component.globalHeader.message']"
      :emptyText="$t('message')['component.globalHeader.message.empty']"
      showViewMore
    ></notice-icon-tab>
    <notice-icon-tab
      tabKey="event"
      :count="unreadData.event"
      :list="noticeData.event"
      :title="$t('message')['component.globalHeader.event']"
      :emptyText="$t('message')['component.globalHeader.event.empty']"
      showViewMore
    ></notice-icon-tab>
  </notice-icon>
</template>

<script>
import NoticeIcon from "@/components/NoticeIcon";
import _groupBy from "lodash/groupBy";
import moment from "moment";
import { mapActions, mapState } from "vuex";
export default {
  components: { NoticeIcon, NoticeIconTab: NoticeIcon.Tab },
  // data(){
  //   return {
  //     fetchingNotices: true,
  //   };
  // },
  computed: {
    ...mapState("global", {
      notices: state => state.notices,
      unreadCount: state => state.unreadCount,
      fetchingNotices: state => state.fetchingStatus.notice
    }),
    noticeData() {
      const { notices = [] } = this;
      if (notices.length === 0) {
        return {};
      }
      const newNotices = notices.map(notice => {
        const newNotice = { ...notice };
        if (newNotice.datetime) {
          newNotice.datetime = moment(notice.datetime).fromNow();
        }
        if (newNotice.id) {
          newNotice.key = newNotice.id;
        }
        return newNotice;
      });
      return _groupBy(newNotices, "type");
    },
    unreadData() {
      const unreadMsg = {};
      Object.entries(this.noticeData).forEach(([key, value]) => {
        if (!unreadMsg[key]) {
          unreadMsg[key] = 0;
        }
        if (Array.isArray(value)) {
          unreadMsg[key] = value.filter(item => !item.read).length;
        }
      });
      return unreadMsg;
    }
  },
  mounted() {
    this.fetchNotices();
  },
  methods: {
    ...mapActions("global", [
      "fetchNotices",
      "changeNoticeReadState",
      "clearNotices"
    ]),
    handleItemClick(item) {
      this.changeNoticeReadState(item.id);
    },
    handleNoticeClear(title, tabKey) {
      this.$message.success(
        `${this.$t("message")["component.noticeIcon.cleared"]} ${title}`
      );
      this.clearNotices(tabKey);
    },
    handleViewMore() {}
  }
};
</script>

<style scoped>
.action {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;
}
</style>
