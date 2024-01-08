import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import store from '@/store';
import firebase from '@/helpers/firebase';
import firebaseConfig from '@/config/firebase';
import fontawesome from '@/plugins/fontawesome';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('fetchAuthUser');
  }
});

const app = createApp(Root);

app.config.globalProperties.console = console;
app.use(fontawesome);
app.use(router);
app.use(store);

app.mount('#app');
