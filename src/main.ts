import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Router from './router';
import Store from './store';
const sqlite3 = require('sqlite3').verbose();

const app = createApp(App);

app.provide('DB', sqlite3);

app.use(Router);
app.use(Store);
app.use(ElementPlus);

app.mount('#app');
