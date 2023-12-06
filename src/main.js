import { createApp } from 'vue';
import Root from './App.vue';
export const app = createApp(Root);
import router from './router';

app.use(router).mount('#app');
