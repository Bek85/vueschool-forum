import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import store from '@/store';
import firebase from '@/helpers/firebase';
import firebaseConfig from '@/config/firebase';
import fontawesome from '@/plugins/fontawesome';
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective';
import PageScrollDirective from '@/plugins/PageScrollDirective';
import Vue3Pagination from '@/plugins/Vue3Pagination';
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = createApp(Root);

app.config.globalProperties.console = console;

app.use(router);
app.use(store);
app.use(fontawesome);
app.use(ClickOutsideDirective);
app.use(PageScrollDirective);
app.use(Vue3Pagination);
app.use(VeeValidatePlugin);

app.mount('#app');
