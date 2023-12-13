import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import store from '@/store';

const app = createApp(Root);

app.config.globalProperties.console = console;
app.use(router);
app.use(store);

app.mount('#app');
