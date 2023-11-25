// import './assets/main.css'

import { createApp } from "vue";
import App from "./App.vue";
import VueKonva from "vue-konva";
import "default-passive-events";

const app = createApp(App);

app.use(VueKonva);
app.mount("#app");
