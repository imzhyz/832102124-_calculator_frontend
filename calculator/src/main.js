import "@/styles/normalize.css"

// ant
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import { setupRouter } from './router/index.js'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 引入router
setupRouter(app)

app.use(Antd)
    .mount('#app')
