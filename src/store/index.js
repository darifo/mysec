
import { createStore } from 'vuex';

const state = {
  doc_height: 600,
  doc_width: 1000
};
const mutations = {
  RESIZE_WIN (state, value) {
    state.doc_height = value.height;
    state.doc_width = value.width;
  },
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