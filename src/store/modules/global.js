import request from "../../utils/request";

const state = {
  notices: [],
  fetchingStatus: {
    notice: false
  },
  notifyCount: 0,
  unreadCount: 0
};

const actions = {
  async fetchNotices({ commit, state }) {
    commit("changeFetchStatus", { payload: { notice: true } });
    const res = await request({
      url: "/api/notices",
      method: "GET"
    });
    const { data = [] } = res;
    commit("saveNotices", { payload: data });
    const unreadCount = state.notices.filter(item => !item.read).length;
    commit("changeNotifyCount", { unreadCount, notifyCount: data.length });
    commit("changeFetchStatus", { payload: { notice: false } });
  },
  clearNotices({ commit, state }, payload) {
    commit("saveClearedNotices", { payload });
    const count = state.notices.length;
    const unreadCount = state.notices.filter(item => !item.read).length;
    commit("changeNotifyCount", { unreadCount, notifyCount: count });
  },
  changeNoticeReadState({ commit, state }, payload) {
    const notices = state.notices.map(item => {
      const notice = { ...item };
      if (notice.id === payload) {
        notice.read = true;
      }
      return notice;
    });
    commit("saveNotices", { payload: notices });
    commit("changeNotifyCount", {
      notifyCount: notices.length,
      unreadCount: notices.filter(item => !item.read).length
    });
  }
};

const mutations = {
  changeFetchStatus(state, { payload }) {
    state.fetchingStatus = {
      ...state.fetchingStatus,
      ...payload
    };
  },
  saveClearedNotices(state, { payload }) {
    state.notices = state.notices.filter(item => item.type !== payload);
  },
  saveNotices(state, { payload }) {
    state.notices = payload;
  },
  changeNotifyCount(state, { notifyCount, unreadCount }) {
    state.notifyCount = notifyCount;
    state.unreadCount = unreadCount;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
