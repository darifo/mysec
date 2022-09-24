import { createRouter, createWebHashHistory } from "vue-router";
import DataSheet from '../components/Datasheet.vue';
import UserLogin from '../components/UserLogin.vue'

const routes = [
    { path: '/', name: "HOME", component: UserLogin },
    { path: '/list', name: "LIST", component: DataSheet },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;