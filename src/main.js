// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(VueKonva)
app.use(ElementPlus)
app.mount('#app')
