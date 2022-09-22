
import { createStore } from 'vuex';

const state = {
  doc_height: 600,
  doc_width: 1000,
  app_info: {}
};
const mutations = {
  RESIZE_WIN (state, value) {
    state.doc_height = value.height;
    state.doc_width = value.width;
  },
  SAVE_APP_INFO (state, value) {
    state.app_info = value;
  }
};
const actions = {
  resizeWin ({ commit }, value) {
    commit('RESIZE_WIN', value);
  },
};

export default createStore({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: {}
});