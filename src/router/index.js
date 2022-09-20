import { createRouter, createWebHashHistory } from "vue-router";
import UserLogin from '@/components/UserLogin';
import DataSheet from '@/components/DataSheet';

const routes = [
    { path: '/', component: UserLogin },
    { path: '/list', component: DataSheet },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;