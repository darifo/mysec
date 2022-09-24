import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Router from './router'
import Store from './store'

const electron = require('electron')
const app = createApp(App)

app.provide('$main', electron)

app.use(Router)
app.use(Store)
app.use(ElementPlus)

app.mount('#app')
