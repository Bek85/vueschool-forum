import {
  docToResource,
  findById,
  makeAppendChildToParentMutation,
  upsert,
} from '@/helpers';

export default {
  setAuthId(state, id) {
    state.authId = id;
  },

  setAuthUserUnsubscribe(state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe;
  },

  setAuthObserverUnsubscribe(state, unsubscribe) {
    state.authObserverUnsubscribe = unsubscribe;
  },

  setItem(state, { resource, item }) {
    upsert(state[resource], docToResource(item));
  },

  appendUnsubscribe(state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe);
  },

  clearAllUnsubscribes(state) {
    state.unsubscribes = [];
  },

  setPost(state, { post }) {
    upsert(state.posts, post);
  },

  setUser(state, { user }) {
    upsert(state.users, user);
  },

  appendThreadToForum: makeAppendChildToParentMutation({
    parent: 'forums',
    child: 'threads',
  }),

  appendThreadToUser: makeAppendChildToParentMutation({
    parent: 'users',
    child: 'threads',
  }),
};
