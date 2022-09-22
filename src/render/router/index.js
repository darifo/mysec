import { createRouter, createWebHashHistory } from "vue-router";
import UserLogin from '@/render/components/UserLogin';
import DataSheet from '@/render/components/DataSheet';

const routes = [
    { path: '/', component: UserLogin },
    { path: '/list', component: DataSheet },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;