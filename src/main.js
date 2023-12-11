import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import store from '@/store';

const app = createApp(Root);

app.use(router);
app.use(store);

app.mount('#app');
