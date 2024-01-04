import { createApp } from 'vue';
import Root from './App.vue';
import router from './router';
import store from '@/store';
import firebase from '@/helpers/firebase';
import firebaseConfig from '@/config/firebase';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faPencil } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faPencil);

firebase.initializeApp(firebaseConfig);

const app = createApp(Root);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.config.globalProperties.console = console;
app.use(router);
app.use(store);

app.mount('#app');
