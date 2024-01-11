import { createStore } from 'vuex';
import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import categories from '@/store/modules/categories';
import forums from '@/store/modules/forums';
import threads from '@/store/modules/threads';
import posts from '@/store/modules/posts';
import users from '@/store/modules/users';
import auth from '@/store/modules/auth';

export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth,
  },
  state: {
    unsubscribes: [],
  },
  actions,
  mutations,
  getters,
});
