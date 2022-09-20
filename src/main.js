import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Router from './router';
import Store from './store';

createApp(App)
    .use(Router)
    .use(Store)
    .use(ElementPlus)
    .mount('#app');
