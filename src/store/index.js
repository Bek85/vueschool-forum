import { createStore } from 'vuex';
import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
    unsubscribes: [],
    authUserUnsubscribe: null,
  },
  actions,
  mutations,
  getters,
});
