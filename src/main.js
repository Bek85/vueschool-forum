import { createApp } from 'vue';
import Root from './App.vue';
export const app = createApp(Root);
import '@/plugins/vue-router';

app.mount('#app');
