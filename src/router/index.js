import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from '@/components/HelloWorld';
import UserLogin from '@/components/UserLogin';
import DataSheet from '@/components/DataSheet';

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/login',  component: UserLogin },
    { path: '/list', component: DataSheet },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;