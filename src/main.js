import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import { vSwipe } from "@/directives/swipe.js";
import vLongpress from "@/directives/longpress";

import "./style.css";

const app = createApp(App);

app.directive("swipe", vSwipe);
app.directive("longpress", vLongpress);

app.use(createPinia());

app.mount("#app");
