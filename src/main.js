import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import AppDate from '@/components/AppDate.vue';

const app = createApp(Root);

app.component('AppDate', AppDate);

app.use(router).mount('#app');
