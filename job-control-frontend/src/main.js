import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { pinia } from './store';

import './style.css'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(VueApexCharts);

app.mount('#app');
