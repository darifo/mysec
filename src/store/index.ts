import { createStore } from 'vuex'

interface IRootState {
    count: number,
    doc_height: number,
    doc_width: number,
    app_info: Object,
}

const store = createStore<IRootState>({   //定义state的类型限定
    state() {   //创建的时候，已经给state的类型进行了限定
        return {
            count: 0,
            doc_height: 600,
            doc_width: 1000,
            app_info: {},
        }
    },
    getters: {},
    mutations: {
        RESIZE_WIN(state, value) {
            state.doc_height = value.height;
            state.doc_width = value.width;
        },
        SAVE_APP_INFO(state, value) {
            state.app_info = value;
        },
    },
    actions: {
        resizeWin({ commit }, value) {
            commit('RESIZE_WIN', value);
        },
    }
})

export default store 